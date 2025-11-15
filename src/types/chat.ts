// Chat-related types for Supabase

export interface SupabaseConversation {
  id: string;
  created_at: string;
  updated_at: string;
  last_message_at: string | null;
  last_message_content: string | null;
  last_message_type: 'text' | 'image' | 'location' | 'document';
  request_id: string | null;
  offer_id: string | null;
  order_id: string | null;
}

export interface SupabaseConversationParticipant {
  id: string;
  conversation_id: string;
  user_id: string;
  joined_at: string;
  last_read_at: string | null;
  is_pinned: boolean;
  is_archived: boolean;
  unread_count: number;
}

export interface SupabaseMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'location' | 'document';
  created_at: string;
  updated_at: string;

  // Optional fields for non-text messages
  image_url?: string | null;
  document_url?: string | null;
  document_name?: string | null;
  location_name?: string | null;
  location_address?: string | null;
  location_lat?: number | null;
  location_lng?: number | null;

  is_edited: boolean;
  is_deleted: boolean;
}

// Extended types with joined data
export interface ConversationWithParticipants
  extends SupabaseConversation {
  participants: SupabaseConversationParticipant[];
  other_user?: {
    id: string;
    nickname: string;
    image: string | null;
    is_online: boolean;
  };
  my_participant?: SupabaseConversationParticipant;
}

export interface MessageWithSender extends SupabaseMessage {
  sender?: {
    id: string;
    nickname: string;
    image: string | null;
  };
}

// Request/Response types
export interface CreateConversationRequest {
  participant_user_id: string;
  request_id?: string;
  offer_id?: string;
  order_id?: string;
}

export interface SendMessageRequest {
  conversation_id: string;
  content: string;
  message_type?: 'text' | 'image' | 'location' | 'document';
  image_url?: string;
  document_url?: string;
  document_name?: string;
  location_name?: string;
  location_address?: string;
  location_lat?: number;
  location_lng?: number;
}

export interface MarkAsReadRequest {
  conversation_id: string;
}
