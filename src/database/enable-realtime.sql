-- Enable Supabase Realtime for messages table
-- Run this in your Supabase SQL Editor

-- 1. Add messages table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 2. Verify it's enabled (should show 'messages' in the result)
SELECT schemaname, tablename 
FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';

-- 3. For testing: Disable RLS on messages table so realtime events aren't blocked
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;

-- 4. Check current RLS status (rowsecurity should be false)
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('messages', 'conversations', 'conversation_participants');
