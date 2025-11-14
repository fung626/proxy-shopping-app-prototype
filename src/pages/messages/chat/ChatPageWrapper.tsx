import { Button } from '@/components/ui/button';
import { chatSupabaseService } from '@/services/chatSupabaseService';
import { useAuthStore } from '@/store/zustand/authStore';
import { MessageWithSender } from '@/types/chat';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatPage } from './ChatPage';
import { ChatPageSkeleton } from './ChatPageSkeleton';

export function ChatPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);

  // Load conversation and messages
  const loadConversation = useCallback(async () => {
    if (!id || !user) return;

    setLoading(true);
    try {
      const conv = await chatSupabaseService.getConversationById(id);
      setConversation(conv);

      const msgs = await chatSupabaseService.getMessages(id);
      setMessages(msgs);

      // Mark as read
      await chatSupabaseService.markAsRead({ conversation_id: id });
    } catch (error) {
      console.error('Error loading conversation:', error);
    } finally {
      setLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    loadConversation();
  }, [loadConversation]);

  // Subscribe to real-time message updates
  useEffect(() => {
    if (!id) return;

    chatSupabaseService.subscribeToMessages(id, (message) => {
      setMessages((prev) => [...prev, message]);

      // Mark as read if it's not our message
      if (message.sender_id !== user?.id) {
        chatSupabaseService.markAsRead({ conversation_id: id });
      }
    });

    return () => {
      chatSupabaseService.unsubscribeFromMessages(id);
    };
  }, [id, user?.id]);

  const handleBack = () => {
    navigate('/messages');
  };

  const handleSendMessage = async (
    _chatId: string,
    content: string,
    type: 'text' | 'image' | 'location' | 'document'
  ) => {
    if (!id || !user) return;

    try {
      await chatSupabaseService.sendMessage({
        conversation_id: id,
        content: content,
        message_type: type,
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  if (loading) {
    return <ChatPageSkeleton />;
  }

  if (!conversation) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            Conversation not found
          </p>
          <Button onClick={handleBack}>Back to Messages</Button>
        </div>
      </div>
    );
  }

  const chatData = {
    id: conversation.id,
    agentName: conversation.other_user?.nickname || 'Unknown User',
    agentImage: conversation.other_user?.image || '',
    isOnline: conversation.other_user?.is_online || false,
    requestTitle: conversation.request_id
      ? `Request #${conversation.request_id.slice(0, 8)}`
      : 'Direct Message',
    messages: messages.map((msg) => ({
      id: msg.id,
      content: msg.content,
      sender:
        msg.sender_id === user?.id
          ? ('user' as const)
          : ('agent' as const),
      timestamp: new Date(msg.created_at),
      type: msg.message_type,
      status: 'delivered' as const,
      imageUrl: msg.image_url || undefined,
      documentName: msg.document_name || undefined,
      location: msg.location_name
        ? {
            name: msg.location_name,
            address: msg.location_address || '',
          }
        : undefined,
    })),
  };

  return (
    <div className="h-screen">
      <ChatPage
        chat={chatData}
        onBack={handleBack}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
