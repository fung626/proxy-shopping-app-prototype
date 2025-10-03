import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/store/LanguageContext';
import { MessageCircle, Search, X } from 'lucide-react';
import { useState } from 'react';

export interface ChatListItem {
  id: string;
  agentName: string;
  agentImage: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  requestTitle: string;
  isOnline: boolean;
  messageType: 'text' | 'image' | 'location' | 'document';
  isPinned?: boolean;
}

interface ChatListProps {
  chats: ChatListItem[];
  onChatSelect: (chatId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function ChatList({
  chats,
  onChatSelect,
  searchQuery,
  onSearchChange,
}: ChatListProps) {
  const { t } = useLanguage();
  const [showInfoBox, setShowInfoBox] = useState(true);

  const filteredChats = chats.filter(
    (chat) =>
      chat.agentName
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      chat.requestTitle
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      chat.lastMessage
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Sort chats: pinned first, then by timestamp
  const sortedChats = [...filteredChats].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(
        (now.getTime() - date.getTime()) / (1000 * 60)
      );
      if (diffInMinutes < 1) return t('messages.now');
      if (diffInMinutes === 1) return t('messages.minuteAgo');
      return t('messages.minutesAgo', { count: diffInMinutes });
    } else if (diffInHours < 24) {
      if (diffInHours === 1) return t('messages.hourAgo');
      return t('messages.hoursAgo', { count: diffInHours });
    } else if (diffInHours < 168) {
      // Less than a week
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays === 1) return t('messages.dayAgo');
      return t('messages.daysAgo', { count: diffInDays });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getMessagePreview = (chat: ChatListItem) => {
    switch (chat.messageType) {
      case 'image':
        return `📸 ${t('messages.photoMessage')}`;
      case 'location':
        return `📍 ${t('messages.locationMessage')}`;
      case 'document':
        return `📄 ${t('messages.documentMessage')}`;
      default:
        return chat.lastMessage;
    }
  };

  return (
    <div className="flex-1 bg-background">
      {/* Header */}
      <div className="bg-card px-4 pt-12 pb-4">
        <div className="mb-4">
          <h1 className="text-3xl font-semibold text-foreground">
            {t('messages.title')}
          </h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder={t('messages.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 bg-input-background border-0 rounded-lg text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="px-4 py-2 pb-20">
        {/* Feature Info */}
        {showInfoBox && (
          <div className="mb-6 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MessageCircle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">
                    {t('messages.chatFeaturesTitle')}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('messages.chatFeaturesDescription')}
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

        {/* Chat List */}
        <div className="space-y-1">
          {sortedChats.map((chat) => (
            <Card
              key={chat.id}
              className="p-0 bg-card shadow-none border-0 hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => onChatSelect(chat.id)}
            >
              <div className="flex items-center space-x-3 p-4">
                {/* Avatar with Online Status */}
                <div className="relative flex-shrink-0">
                  <ImageWithFallback
                    src={chat.agentImage}
                    alt={chat.agentName}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  {chat.isOnline && (
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
                  )}
                  {chat.isPinned && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-xs text-primary-foreground">
                        📌
                      </span>
                    </div>
                  )}
                </div>

                {/* Chat Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center space-x-2">
                        <h3
                          className={`font-medium truncate text-foreground ${
                            chat.unreadCount > 0
                              ? 'font-semibold'
                              : ''
                          }`}
                        >
                          {chat.agentName}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="text-xs px-1.5 py-0.5"
                        >
                          {t('messages.agentBadge')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {chat.requestTitle}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 flex-shrink-0 ml-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(chat.timestamp)}
                      </span>
                      {chat.unreadCount > 0 && (
                        <div className="min-w-[20px] h-5 bg-primary rounded-full flex items-center justify-center px-1">
                          <span className="text-white text-xs font-medium">
                            {chat.unreadCount > 99
                              ? '99+'
                              : chat.unreadCount}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p
                      className={`text-sm truncate ${
                        chat.unreadCount > 0
                          ? 'text-foreground font-medium'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {getMessagePreview(chat)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {sortedChats.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('messages.noConversationsFound')}
            </h3>
            <p className="text-muted-foreground">
              {t('messages.tryDifferentSearch')}
            </p>
          </div>
        )}

        {/* No Chats State */}
        {chats.length === 0 && (
          <div className="text-center py-16">
            <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium text-foreground mb-2">
              {t('messages.noMessagesYet')}
            </h3>
            <p className="text-muted-foreground mb-6">
              {t('messages.startProxyShoppingRequest')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
