import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Button } from '@/components/ui/button';
import { chatSupabaseService } from '@/services/chatSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { MessageWithSender } from '@/types/chat';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ChatInput } from './ChatInput';
import { ChatMessage, ChatMessageData } from './ChatMessage';
import { ChatPageSkeleton } from './ChatPageSkeleton';

export function ChatPage() {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [otherUserTyping, setOtherUserTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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
      setMessages((prev) => {
        // Check if message already exists (avoid duplicates)
        const messageExists = prev.some(
          (msg) => msg.id === message.id
        );
        if (messageExists) {
          return prev;
        }
        return [...prev, message];
      });
      // Mark as read if it's not our message
      if (message.sender_id !== user?.id) {
        chatSupabaseService.markAsRead({ conversation_id: id });
      }
    });

    return () => {
      chatSupabaseService.unsubscribeFromMessages(id);
    };
  }, [id, user?.id]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Subscribe to typing indicator updates
  useEffect(() => {
    if (!id) return;

    // TODO: Implement real-time typing indicator subscription
    // This would subscribe to a presence channel where users broadcast their typing status
    // For now, this is a placeholder for the future implementation

    return () => {
      // Cleanup subscription
    };
  }, [id]);

  const handleBack = () => {
    navigate('/messages');
  };

  const handleSendMessage = async (
    content: string,
    type: 'text' | 'image' | 'location' | 'document'
  ) => {
    if (!id || !user) return;

    // Optimistically add the message to the UI immediately
    const optimisticMessage: MessageWithSender = {
      id: `temp-${Date.now()}`,
      conversation_id: id,
      sender_id: user.id,
      content,
      message_type: type,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_edited: false,
      is_deleted: false,
      sender: {
        id: user.id,
        nickname: user.nickname || user.name || 'You',
        image: user.avatar || null,
      },
    };

    setMessages((prev) => [...prev, optimisticMessage]);

    try {
      const sentMessage = await chatSupabaseService.sendMessage({
        conversation_id: id,
        content: content,
        message_type: type,
      });

      // Replace the optimistic message with the real one from the server
      if (sentMessage) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === optimisticMessage.id ? sentMessage : msg
          )
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove the optimistic message on error
      setMessages((prev) =>
        prev.filter((msg) => msg.id !== optimisticMessage.id)
      );
    }
  };

  const formatLastSeen = (date?: Date) => {
    if (!date) return '';
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return t('messages.activeNow');
    if (diffInMinutes < 60)
      return t('messages.activeMinutesAgo', { count: diffInMinutes });
    if (diffInMinutes < 1440)
      return t('messages.activeHoursAgo', {
        count: Math.floor(diffInMinutes / 60),
      });
    return t('messages.activeDaysAgo', {
      count: Math.floor(diffInMinutes / 1440),
    });
  };

  const groupMessagesByDate = (messages: ChatMessageData[]) => {
    const groups: { date: string; messages: ChatMessageData[] }[] =
      [];
    let currentDate = '';
    let currentGroup: ChatMessageData[] = [];

    messages.forEach((message) => {
      const messageDate = message.timestamp.toDateString();

      if (messageDate !== currentDate) {
        if (currentGroup.length > 0) {
          groups.push({ date: currentDate, messages: currentGroup });
        }
        currentDate = messageDate;
        currentGroup = [message];
      } else {
        currentGroup.push(message);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ date: currentDate, messages: currentGroup });
    }

    return groups;
  };

  const formatDateHeader = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return t('messages.today');
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t('messages.yesterday');
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric',
      });
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

  // Transform messages to ChatMessageData format
  const chatMessages: ChatMessageData[] = messages.map((msg) => ({
    id: msg.id,
    content: msg.content,
    sender:
      msg.sender_id === user?.id
        ? ('user' as const)
        : ('other' as const),
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
  }));

  const messageGroups = groupMessagesByDate(chatMessages);

  // Get other user info from conversation.other_user or derive from participants
  let otherUserInfo = conversation.other_user;

  // Fallback: if other_user is not populated, try to get from participants
  if (!otherUserInfo && conversation.participants) {
    const otherParticipant = conversation.participants.find(
      (p: any) => p.user_id !== user?.id
    );
    if (otherParticipant) {
      // We'll show a placeholder until the user data is loaded
      otherUserInfo = {
        id: otherParticipant.user_id,
        nickname: 'User',
        image: '',
        is_online: false,
      };
    }
  }

  const otherUserName = otherUserInfo?.nickname || 'Unknown User';
  const otherUserImage = otherUserInfo?.image || '';
  const isOnline = otherUserInfo?.is_online || false;
  const requestTitle = conversation.request_id
    ? `Request #${conversation.request_id.slice(0, 8)}`
    : conversation.offer_id
    ? `Offer #${conversation.offer_id.slice(0, 8)}`
    : 'Direct Message';

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBack}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative">
              <ImageWithFallback
                src={otherUserImage}
                alt={otherUserName}
                className="w-10 h-10 rounded-full object-cover"
              />
              {isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">
                {otherUserName}
              </h2>
              <p className="text-xs text-muted-foreground truncate">
                {requestTitle}
              </p>
              {isOnline ? (
                <p className="text-xs text-green-600">
                  {t('messages.online')}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {otherUserInfo?.last_seen
                    ? formatLastSeen(otherUserInfo.last_seen)
                    : t('messages.offline')}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex}>
            {/* Date Header */}
            {group.date && (
              <div className="flex justify-center my-4">
                <div className="bg-muted px-3 py-1 rounded-full">
                  <span className="text-xs text-muted-foreground font-medium">
                    {formatDateHeader(group.date)}
                  </span>
                </div>
              </div>
            )}

            {/* Messages for this date */}
            {group.messages.map((message, index) => {
              const showAvatar =
                message.sender === 'other' &&
                (index === 0 ||
                  group.messages[index - 1]?.sender === 'user');

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  otherUserAvatar={otherUserImage}
                  otherUserName={otherUserName}
                  showAvatar={showAvatar}
                />
              );
            })}
          </div>
        ))}

        {/* Typing Indicator */}
        {otherUserTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end space-x-2 max-w-[80%]">
              <ImageWithFallback
                src={otherUserImage}
                alt={otherUserName}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex space-x-1">
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <ChatInput
        onSendMessage={handleSendMessage}
        onTyping={(typing) => {
          // TODO: Broadcast typing status to other user via Supabase presence
          // This would send a real-time event that the other user's chat would receive
          console.log('Current user typing:', typing);
        }}
        placeholder={t('messages.messagePlaceholder', {
          name: otherUserName,
        })}
      />
    </div>
  );
}
