-- Chat System Schema for Supabase
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: conversations
-- Stores conversation metadata between users
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE,
  last_message_content TEXT,
  last_message_type TEXT DEFAULT 'text',
  
  -- Optional: If conversations are related to requests/offers/orders
  request_id UUID REFERENCES requests(id) ON DELETE SET NULL,
  offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL
);

-- Table: conversation_participants
-- Links users to conversations (many-to-many relationship)
CREATE TABLE IF NOT EXISTS conversation_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_read_at TIMESTAMP WITH TIME ZONE,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_archived BOOLEAN DEFAULT FALSE,
  unread_count INTEGER DEFAULT 0,
  
  UNIQUE(conversation_id, user_id)
);

-- Table: messages
-- Stores individual messages in conversations
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'location', 'document')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- For non-text messages
  image_url TEXT,
  document_url TEXT,
  document_name TEXT,
  location_name TEXT,
  location_address TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  
  -- Message status tracking
  is_edited BOOLEAN DEFAULT FALSE,
  is_deleted BOOLEAN DEFAULT FALSE
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_user_id ON conversation_participants(user_id);
CREATE INDEX IF NOT EXISTS idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);

-- Function: Update conversation's last message info
CREATE OR REPLACE FUNCTION update_conversation_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    last_message_at = NEW.created_at,
    last_message_content = NEW.content,
    last_message_type = NEW.message_type,
    updated_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update conversation when new message is added
DROP TRIGGER IF EXISTS trigger_update_conversation_last_message ON messages;
CREATE TRIGGER trigger_update_conversation_last_message
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_conversation_last_message();

-- Function: Update unread count for participants
CREATE OR REPLACE FUNCTION update_unread_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Increment unread count for all participants except the sender
  UPDATE conversation_participants
  SET unread_count = unread_count + 1
  WHERE conversation_id = NEW.conversation_id
    AND user_id != NEW.sender_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update unread count when new message is added
DROP TRIGGER IF EXISTS trigger_update_unread_count ON messages;
CREATE TRIGGER trigger_update_unread_count
AFTER INSERT ON messages
FOR EACH ROW
EXECUTE FUNCTION update_unread_count();

-- Row Level Security (RLS) Policies
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS: Users can only see conversations they're part of
CREATE POLICY "Users can view their own conversations"
  ON conversations FOR SELECT
  USING (
    id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

-- RLS: Users can see all participants in conversations they're part of
CREATE POLICY "Users can view participants in their conversations"
  ON conversation_participants FOR SELECT
  USING (
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

-- RLS: Users can update their own participant records
CREATE POLICY "Users can update their own participant records"
  ON conversation_participants FOR UPDATE
  USING (user_id = auth.uid());

-- RLS: Users can only see messages in their conversations
CREATE POLICY "Users can view messages in their conversations"
  ON messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
  );

-- RLS: Users can insert messages in their conversations
CREATE POLICY "Users can send messages in their conversations"
  ON messages FOR INSERT
  WITH CHECK (
    conversation_id IN (
      SELECT conversation_id 
      FROM conversation_participants 
      WHERE user_id = auth.uid()
    )
    AND sender_id = auth.uid()
  );

-- RLS: Users can update their own messages
CREATE POLICY "Users can update their own messages"
  ON messages FOR UPDATE
  USING (sender_id = auth.uid());

-- RLS: Users can insert conversations (when starting a new chat)
CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (true);

-- RLS: Users can insert participant records
CREATE POLICY "Users can add participants"
  ON conversation_participants FOR INSERT
  WITH CHECK (true);

-- Helper function: Get or create conversation between two users
CREATE OR REPLACE FUNCTION get_or_create_conversation(
  user1_id UUID,
  user2_id UUID,
  req_id UUID DEFAULT NULL,
  off_id UUID DEFAULT NULL,
  ord_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  conv_id UUID;
BEGIN
  -- Try to find existing conversation between these two users
  SELECT c.id INTO conv_id
  FROM conversations c
  INNER JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = user1_id
  INNER JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id = user2_id
  WHERE (c.request_id = req_id OR (c.request_id IS NULL AND req_id IS NULL))
    AND (c.offer_id = off_id OR (c.offer_id IS NULL AND off_id IS NULL))
    AND (c.order_id = ord_id OR (c.order_id IS NULL AND ord_id IS NULL))
  LIMIT 1;
  
  -- If no conversation exists, create one
  IF conv_id IS NULL THEN
    INSERT INTO conversations (request_id, offer_id, order_id)
    VALUES (req_id, off_id, ord_id)
    RETURNING id INTO conv_id;
    
    -- Add both participants using ON CONFLICT to handle race conditions
    INSERT INTO conversation_participants (conversation_id, user_id)
    VALUES (conv_id, user1_id), (conv_id, user2_id)
    ON CONFLICT (conversation_id, user_id) DO NOTHING;
  END IF;
  
  RETURN conv_id;
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
