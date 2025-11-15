import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SignInView from '@/pages/auth/SignInView';
import { chatSupabaseService } from '@/services/chatSupabaseService';
import { useLanguage } from '@/store/LanguageContext';
import { useAuthStore } from '@/store/zustand/authStore';
import { ConversationWithParticipants } from '@/types/chat';
import { MessageCircle, Search, X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MessagesTabSkeleton } from '../messages/MessagesTabSkeleton';

interface Item {
  id: string;
  userName: string;
  userImage: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  requestTitle: string;
  isOnline: boolean;
  messageType: 'text' | 'image' | 'location' | 'document';
  isPinned?: boolean;
}

export function MessagesTab() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [conversations, setConversations] = useState<
    ConversationWithParticipants[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showInfoBox, setShowInfoBox] = useState(true);

  const { user } = useAuthStore();

  const selectedAgentId = location.state?.selectedAgentId;

  // Load conversations from Supabase
  const loadConversations = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await chatSupabaseService.getMyConversations();
      setConversations(data);
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get or create conversation with selected agent and navigate to it
  const handleGetOrCreateConversation = useCallback(
    async (agentId: string) => {
      if (!user) return;

      try {
        const conversation =
          await chatSupabaseService.getOrCreateConversation({
            participant_user_id: agentId,
          });

        if (conversation) {
          navigate(`/messages/chat/${conversation.id}`);
        }
      } catch (error) {
        console.error('Error creating conversation:', error);
      }
    },
    [user, navigate]
  );

  // Initial load
  useEffect(() => {
    if (user) {
      loadConversations();
    }
  }, [user, loadConversations]);

  // Subscribe to real-time conversation updates
  useEffect(() => {
    if (!user) return;
    chatSupabaseService.subscribeToConversations(() => {
      // Reload conversations when there's an update
      loadConversations();
    });

    return () => {
      chatSupabaseService.unsubscribeAll();
    };
  }, [user, loadConversations]);

  // Auto-select chat when an agent is specified
  useEffect(() => {
    if (selectedAgentId && user && conversations.length > 0) {
      handleGetOrCreateConversation(selectedAgentId);
    }
  }, [
    selectedAgentId,
    user,
    conversations.length,
    handleGetOrCreateConversation,
  ]);

  if (!user) {
    return (
      <SignInView
        title="nav.messages"
        description="messages.description"
        signInPrompt="messages.signInPrompt"
        signInDescription="messages.signInDescription"
        signInButtonText="profile.signIn"
      />
    );
  }

  if (loading) {
    return <MessagesTabSkeleton />;
  }

  // Transform conversations to Item format
  const Items: Item[] = conversations.map((conv) => ({
    id: conv.id,
    userName: conv.other_user?.nickname || t('common.unknownUser'),
    userImage: conv.other_user?.image || '/default-avatar.png',
    lastMessage: conv.last_message_content || '',
    timestamp: new Date(conv.updated_at),
    unreadCount: conv.my_participant?.unread_count || 0,
    requestTitle: 'Direct Message', // Request relationship not yet in ConversationWithParticipants type
    isOnline: conv.other_user?.is_online || false,
    messageType:
      (conv.last_message_type as
        | 'text'
        | 'image'
        | 'location'
        | 'document') || 'text',
    isPinned: conv.my_participant?.is_pinned || false,
  }));

  // Helper functions for MessagesList logic
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t('time.now');
    if (diffMins < 60)
      return t('time.minutesAgo', { count: diffMins });
    if (diffHours < 24)
      return t('time.hoursAgo', { count: diffHours });
    if (diffDays < 7) return t('time.daysAgo', { count: diffDays });
    return date.toLocaleDateString();
  };

  const getMessagePreview = (message: Item): string => {
    switch (message.messageType) {
      case 'image':
        return `📷 ${t('messages.types.image')}`;
      case 'location':
        return `📍 ${t('messages.types.location')}`;
      case 'document':
        return `📎 ${t('messages.types.document')}`;
      default:
        return message.lastMessage;
    }
  };

  // Filter and sort messages
  const filteredMessages = Items.filter(
    (message) =>
      message.userName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      message.requestTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      message.lastMessage
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  const sortedMessages = [...filteredMessages].sort((a, b) => {
    // Pinned messages first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by timestamp
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  return (
    <div className="flex-1 bg-background pb-[74px]">
      {/* Header */}
      <div className="bg-card px-4 pt-12 pb-6">
        <h1 className="text-3xl font-semibold text-foreground">
          {t('messages.title')}
        </h1>
        <p className="text-muted-foreground mt-1">
          {t('messages.description')}
        </p>
      </div>

      <div className="px-4 py-4">
        {/* Feature Info Box */}
        {showInfoBox && (
          <div className="mb-6 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">
                    {t('messages.chatManagement')}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('messages.info')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground ml-2"
                onClick={() => setShowInfoBox(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder={t('messages.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Messages List */}
        {sortedMessages.length === 0 ? (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {searchQuery
                ? t('messages.empty.noResults')
                : t('messages.empty.noMessages')}
            </h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? t('messages.empty.tryDifferentSearch')
                : t('messages.empty.startConversation')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMessages.map((message) => (
              <div
                key={message.id}
                className="p-4 bg-muted/50 rounded-lg cursor-pointer hover:bg-muted transition-colors"
                onClick={() => handleChatSelect(message.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <ImageWithFallback
                      src={message.userImage}
                      alt={message.userName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {message.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground truncate">
                          {message.userName}
                        </h3>
                        {message.isPinned && (
                          <Badge
                            variant="secondary"
                            className="text-xs px-1.5 py-0"
                          >
                            📌
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>

                    <p className="text-sm text-muted-foreground mb-1 truncate">
                      {message.requestTitle}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      <p
                        className={`text-sm truncate flex-1 ${
                          message.unreadCount > 0
                            ? 'font-semibold text-foreground'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {getMessagePreview(message)}
                      </p>
                      {message.unreadCount > 0 && (
                        <Badge
                          variant="default"
                          className="text-xs px-2"
                        >
                          {message.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Navigate to chat when a conversation is selected
  function handleChatSelect(chatId: string) {
    navigate(`/messages/chat/${chatId}`);
  }
}
