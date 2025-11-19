import { supabase } from '@/supabase/client';
import {
  ConversationWithParticipants,
  CreateConversationRequest,
  MarkAsReadRequest,
  MessageWithSender,
  SendMessageRequest,
  SupabaseConversation,
  SupabaseMessage,
} from '@/types/chat';
import { RealtimeChannel } from '@supabase/supabase-js';

class ChatSupabaseService {
  private conversationSubscriptions: Map<string, RealtimeChannel> =
    new Map();

  /**
   * Ensure user profile exists in users table
   */
  private async ensureUserProfileExists(
    userId: string
  ): Promise<boolean> {
    try {
      // Check if user exists
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('id', userId)
        .single();

      if (existingUser) return true;

      // User doesn't exist in users table
      // For current user, we can create profile from auth data
      const {
        data: { user: currentAuthUser },
      } = await supabase.auth.getUser();

      if (currentAuthUser && currentAuthUser.id === userId) {
        // Create profile for current user
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: currentAuthUser.id,
            email: currentAuthUser.email!,
            name:
              currentAuthUser.user_metadata?.name ||
              currentAuthUser.email?.split('@')[0] ||
              'User',
            nickname: currentAuthUser.user_metadata?.nickname,
            phone: currentAuthUser.phone,
            avatar: currentAuthUser.user_metadata?.avatar_url,
            created_at: currentAuthUser.created_at,
            updated_at:
              currentAuthUser.updated_at ||
              currentAuthUser.created_at,
          });

        if (insertError) {
          console.error('Error creating user profile:', insertError);
          return false;
        }

        return true;
      }

      // For other users, they should already exist
      // If not, return false (profile should be created on their signup)
      console.warn(
        `User profile not found for userId: ${userId}. They may need to complete signup.`
      );
      return false;
    } catch (error) {
      console.error('Error ensuring user profile exists:', error);
      return false;
    }
  }

  /**
   * Get or create a conversation between current user and another user
   */
  async getOrCreateConversation(
    request: CreateConversationRequest
  ): Promise<ConversationWithParticipants | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Ensure both users have profiles in the users table
      const currentUserExists = await this.ensureUserProfileExists(
        user.id
      );
      const otherUserExists = await this.ensureUserProfileExists(
        request.participant_user_id
      );

      if (!currentUserExists || !otherUserExists) {
        throw new Error(
          'Failed to ensure user profiles exist in database'
        );
      }

      // Step 1: Try to find existing conversation with both participants
      const { data: myParticipants } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', user.id);

      if (myParticipants && myParticipants.length > 0) {
        const myConvIds = myParticipants.map(
          (p) => p.conversation_id
        );

        // Find conversations where the other user is also a participant
        const { data: otherParticipants } = await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', request.participant_user_id)
          .in('conversation_id', myConvIds);

        if (otherParticipants && otherParticipants.length > 0) {
          // Get the actual conversation to match request/offer/order IDs
          const commonConvIds = otherParticipants.map(
            (p) => p.conversation_id
          );

          let query = supabase
            .from('conversations')
            .select('id')
            .in('id', commonConvIds);

          // Apply filters for request/offer/order
          if (request.request_id) {
            query = query.eq('request_id', request.request_id);
          } else {
            query = query.is('request_id', null);
          }

          if (request.offer_id) {
            query = query.eq('offer_id', request.offer_id);
          } else {
            query = query.is('offer_id', null);
          }

          if (request.order_id) {
            query = query.eq('order_id', request.order_id);
          } else {
            query = query.is('order_id', null);
          }

          const { data: existingConvs } = await query.limit(1);

          if (existingConvs && existingConvs.length > 0) {
            console.log(
              'Found existing conversation:',
              existingConvs[0].id
            );
            return await this.getConversationById(
              existingConvs[0].id
            );
          }
        }
      }

      // Step 2: No existing conversation, create a new one
      const { data: newConv, error: convError } = await supabase
        .from('conversations')
        .insert({
          request_id: request.request_id || null,
          offer_id: request.offer_id || null,
          order_id: request.order_id || null,
        })
        .select()
        .single();

      if (convError) {
        console.error('Error creating conversation:', convError);
        throw convError;
      }

      console.log('Created new conversation:', newConv.id);

      // Step 3: Add participants one by one with ON CONFLICT handling
      const participants = [user.id, request.participant_user_id];
      let successCount = 0;

      for (const userId of participants) {
        const { error: partError } = await supabase
          .from('conversation_participants')
          .insert({
            conversation_id: newConv.id,
            user_id: userId,
          });

        if (partError) {
          // If duplicate key, it means this participant already exists (race condition)
          if (
            partError.code === '23505' ||
            partError.message?.includes('duplicate')
          ) {
            console.warn(
              `Participant ${userId} already exists in conversation ${newConv.id}`
            );
            successCount++;
          } else {
            console.error('Error adding participant:', partError);
          }
        } else {
          successCount++;
        }
      }

      if (successCount === 0) {
        throw new Error('Failed to add any participants');
      }

      console.log(
        `Added ${successCount}/${participants.length} participants`
      );

      // Step 4: Return the full conversation
      return await this.getConversationById(newConv.id);
    } catch (error) {
      console.error('Error getting or creating conversation:', error);
      return null;
    }
  }

  /**
   * Get a specific conversation by ID with participants and other user info
   */
  async getConversationById(
    conversationId: string
  ): Promise<ConversationWithParticipants | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .single();

      if (convError) throw convError;

      // Get participants - using service role to bypass RLS if needed
      const { data: participants, error: partError } = await supabase
        .from('conversation_participants')
        .select('*')
        .eq('conversation_id', conversationId);

      console.log('Participants query result:', {
        conversationId,
        participantCount: participants?.length,
        participants,
        error: partError,
      });

      if (partError) {
        console.error('Error fetching participants:', partError);
        throw partError;
      }

      if (!participants || participants.length === 0) {
        console.warn(
          'No participants found for conversation:',
          conversationId
        );
      } else if (participants.length === 1) {
        console.warn('Only 1 participant found (expected 2):', {
          conversationId,
          participant: participants[0],
        });
      }

      // Get other user's info
      const otherParticipant = participants.find(
        (p) => p.user_id !== user.id
      );
      const myParticipant = participants.find(
        (p) => p.user_id === user.id
      );

      let otherUser = null;
      if (otherParticipant) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, nickname, avatar, name')
          .eq('id', otherParticipant.user_id)
          .single();

        if (!userError && userData) {
          otherUser = {
            id: userData.id,
            nickname:
              userData.nickname || userData.name || 'Unknown User',
            image: userData.avatar || '',
            is_online: false, // You can implement online status tracking separately
          };
        }
      }

      return {
        ...conversation,
        participants,
        other_user: otherUser || undefined,
        my_participant: myParticipant,
      };
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  /**
   * Get all conversations for the current user
   */
  async getMyConversations(): Promise<
    ConversationWithParticipants[]
  > {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get user's participant records
      const { data: myParticipants, error: partError } =
        await supabase
          .from('conversation_participants')
          .select('conversation_id')
          .eq('user_id', user.id)
          .eq('is_archived', false);

      if (partError) throw partError;

      const conversationIds = myParticipants.map(
        (p) => p.conversation_id
      );

      if (conversationIds.length === 0) return [];

      // Get conversations
      const { data: conversations, error: convError } = await supabase
        .from('conversations')
        .select('*')
        .in('id', conversationIds)
        .order('updated_at', { ascending: false });

      if (convError) throw convError;

      // Enrich each conversation with participants and other user info
      const enrichedConversations = await Promise.all(
        conversations.map(async (conv) => {
          // Get all participants for this conversation
          const { data: participants } = await supabase
            .from('conversation_participants')
            .select('*')
            .eq('conversation_id', conv.id);

          const otherParticipant = participants?.find(
            (p) => p.user_id !== user.id
          );
          const myParticipant = participants?.find(
            (p) => p.user_id === user.id
          );

          let otherUser = null;
          if (otherParticipant) {
            const { data: userData } = await supabase
              .from('users')
              .select('id, nickname, avatar, name')
              .eq('id', otherParticipant.user_id)
              .single();

            if (userData) {
              otherUser = {
                id: userData.id,
                nickname:
                  userData.nickname || userData.name || 'User',
                image: userData.avatar || '',
                is_online: false,
              };
            }
          }

          return {
            ...conv,
            participants: participants || [],
            other_user: otherUser || undefined,
            my_participant: myParticipant,
          };
        })
      );

      return enrichedConversations;
    } catch (error) {
      console.error('Error getting conversations:', error);
      return [];
    }
  }

  /**
   * Send a message in a conversation
   */
  async sendMessage(
    request: SendMessageRequest
  ): Promise<MessageWithSender | null> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const messageData: any = {
        conversation_id: request.conversation_id,
        sender_id: user.id,
        content: request.content,
        message_type: request.message_type || 'text',
      };

      // Add optional fields based on message type
      if (request.image_url)
        messageData.image_url = request.image_url;
      if (request.document_url)
        messageData.document_url = request.document_url;
      if (request.document_name)
        messageData.document_name = request.document_name;
      if (request.location_name)
        messageData.location_name = request.location_name;
      if (request.location_address)
        messageData.location_address = request.location_address;
      if (request.location_lat)
        messageData.location_lat = request.location_lat;
      if (request.location_lng)
        messageData.location_lng = request.location_lng;

      const { data, error } = await supabase
        .from('messages')
        .insert(messageData)
        .select()
        .single();

      if (error) throw error;

      // Get sender info
      const { data: senderData } = await supabase
        .from('users')
        .select('id, nickname, avatar, name')
        .eq('id', user.id)
        .single();

      return {
        ...data,
        sender: senderData
          ? {
              id: senderData.id,
              nickname:
                senderData.nickname || senderData.name || 'User',
              image: senderData.avatar || null,
            }
          : undefined,
      };
    } catch (error) {
      console.error('Error sending message:', error);
      return null;
    }
  }

  /**
   * Get messages for a conversation
   */
  async getMessages(
    conversationId: string,
    limit: number = 50,
    before?: string
  ): Promise<MessageWithSender[]> {
    try {
      let query = supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (before) {
        query = query.lt('created_at', before);
      }

      const { data: messages, error } = await query;

      if (error) throw error;

      // Get sender info for each message
      const messagesWithSender = await Promise.all(
        messages.map(async (msg) => {
          const { data: senderData } = await supabase
            .from('users')
            .select('id, nickname, avatar, name')
            .eq('id', msg.sender_id)
            .single();

          return {
            ...msg,
            sender: senderData
              ? {
                  id: senderData.id,
                  nickname:
                    senderData.nickname || senderData.name || 'User',
                  image: senderData.avatar || null,
                }
              : undefined,
          };
        })
      );

      return messagesWithSender.reverse(); // Return in chronological order
    } catch (error) {
      console.error('Error getting messages:', error);
      return [];
    }
  }

  /**
   * Mark conversation as read
   */
  async markAsRead(request: MarkAsReadRequest): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('conversation_participants')
        .update({
          last_read_at: new Date().toISOString(),
          unread_count: 0,
        })
        .eq('conversation_id', request.conversation_id)
        .eq('user_id', user.id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error marking as read:', error);
      return false;
    }
  }

  /**
   * Toggle pin status for a conversation
   */
  async togglePin(conversationId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Get current pin status
      const { data: participant } = await supabase
        .from('conversation_participants')
        .select('is_pinned')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .single();

      if (!participant) return false;

      // Toggle pin status
      const { error } = await supabase
        .from('conversation_participants')
        .update({ is_pinned: !participant.is_pinned })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error toggling pin:', error);
      return false;
    }
  }

  /**
   * Archive a conversation
   */
  async archiveConversation(
    conversationId: string
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('conversation_participants')
        .update({ is_archived: true })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error archiving conversation:', error);
      return false;
    }
  }

  /**
   * Subscribe to new messages in a conversation (real-time)
   */
  subscribeToMessages(
    conversationId: string,
    callback: (message: MessageWithSender) => void
  ): RealtimeChannel {
    console.log(
      '🔔 Setting up real-time subscription for conversation:',
      conversationId
    );

    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          console.log('📨 Real-time message received:', payload.new);
          const message = payload.new as SupabaseMessage;

          // Fetch sender info
          const { data: senderData } = await supabase
            .from('users')
            .select('id, nickname, avatar, name')
            .eq('id', message.sender_id)
            .single();

          const messageWithSender: MessageWithSender = {
            ...message,
            sender: senderData
              ? {
                  id: senderData.id,
                  nickname:
                    senderData.nickname || senderData.name || 'User',
                  image: senderData.avatar || null,
                }
              : undefined,
          };

          console.log(
            '📨 Calling callback with message:',
            messageWithSender
          );
          callback(messageWithSender);
        }
      )
      .subscribe((status) => {
        console.log('🔔 Subscription status:', status);
      });

    this.conversationSubscriptions.set(conversationId, channel);
    return channel;
  }

  /**
   * Subscribe to conversation updates (real-time)
   */
  subscribeToConversations(
    callback: (conversation: SupabaseConversation) => void
  ): RealtimeChannel {
    const channel = supabase
      .channel('conversations')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
        },
        (payload) => {
          if (
            payload.eventType === 'UPDATE' ||
            payload.eventType === 'INSERT'
          ) {
            callback(payload.new as SupabaseConversation);
          }
        }
      )
      .subscribe();

    return channel;
  }

  /**
   * Unsubscribe from a conversation's messages
   */
  unsubscribeFromMessages(conversationId: string): void {
    const channel =
      this.conversationSubscriptions.get(conversationId);
    if (channel) {
      supabase.removeChannel(channel);
      this.conversationSubscriptions.delete(conversationId);
    }
  }

  /**
   * Unsubscribe from all channels
   */
  unsubscribeAll(): void {
    this.conversationSubscriptions.forEach((channel) => {
      supabase.removeChannel(channel);
    });
    this.conversationSubscriptions.clear();
  }

  /**
   * Delete a message (soft delete)
   */
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({ is_deleted: true, content: 'Message deleted' })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error deleting message:', error);
      return false;
    }
  }

  /**
   * Edit a message
   */
  async editMessage(
    messageId: string,
    newContent: string
  ): Promise<boolean> {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('messages')
        .update({
          content: newContent,
          is_edited: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', messageId)
        .eq('sender_id', user.id);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error editing message:', error);
      return false;
    }
  }
}

export const chatSupabaseService = new ChatSupabaseService();
