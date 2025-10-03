import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/store/LanguageContext';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage, ChatMessageData } from './ChatMessage';

export interface ChatData {
  id: string;
  agentName: string;
  agentImage: string;
  requestTitle: string;
  isOnline: boolean;
  lastSeen?: Date;
  messages: ChatMessageData[];
}

interface ChatViewProps {
  chat: ChatData;
  onBack: () => void;
  onSendMessage: (
    chatId: string,
    content: string,
    type: 'text' | 'image' | 'location' | 'document'
  ) => void;
}

export function ChatView({
  chat,
  onBack,
  onSendMessage,
}: ChatViewProps) {
  const { t } = useLanguage();
  const [isTyping, setIsTyping] = useState(false);
  const [agentTyping, setAgentTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  // Simulate agent typing occasionally
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setAgentTyping(true);
        setTimeout(() => setAgentTyping(false), 2000);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleSendMessage = (
    content: string,
    type: 'text' | 'image' | 'location' | 'document'
  ) => {
    onSendMessage(chat.id, content, type);
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

  const messageGroups = groupMessagesByDate(chat.messages);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-3 safe-area-inset-top">
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-10 w-10"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          <div className="flex items-center space-x-3 flex-1 min-w-0">
            <div className="relative">
              <ImageWithFallback
                src={chat.agentImage}
                alt={chat.agentName}
                className="w-10 h-10 rounded-full object-cover"
              />
              {chat.isOnline && (
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card"></div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h2 className="font-semibold text-foreground truncate">
                {chat.agentName}
              </h2>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-muted-foreground truncate">
                  {chat.requestTitle}
                </p>
                <Badge
                  variant="secondary"
                  className="text-xs px-1.5 py-0.5"
                >
                  {t('messages.agentBadge')}
                </Badge>
              </div>
              {chat.isOnline ? (
                <p className="text-xs text-green-600">
                  {t('messages.online')}
                </p>
              ) : (
                <p className="text-xs text-muted-foreground">
                  {formatLastSeen(chat.lastSeen)}
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
                message.sender === 'agent' &&
                (index === 0 ||
                  group.messages[index - 1]?.sender === 'user');

              return (
                <ChatMessage
                  key={message.id}
                  message={message}
                  agentAvatar={chat.agentImage}
                  agentName={chat.agentName}
                  showAvatar={showAvatar}
                />
              );
            })}
          </div>
        ))}

        {/* Agent Typing Indicator */}
        {agentTyping && (
          <div className="flex justify-start mb-4">
            <div className="flex items-end space-x-2 max-w-[80%]">
              <ImageWithFallback
                src={chat.agentImage}
                alt={chat.agentName}
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
        onTyping={setIsTyping}
        placeholder={t('messages.messageAgentPlaceholder', {
          name: chat.agentName,
        })}
      />
    </div>
  );
}
