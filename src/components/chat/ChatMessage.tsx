import { ImageWithFallback } from '../figma/ImageWithFallback';

export interface ChatMessageData {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  type: 'text' | 'image' | 'location' | 'document';
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  imageUrl?: string;
  documentName?: string;
  location?: {
    name: string;
    address: string;
  };
}

interface ChatMessageProps {
  message: ChatMessageData;
  agentAvatar?: string;
  agentName?: string;
  showAvatar?: boolean;
}

export function ChatMessage({ message, agentAvatar, agentName, showAvatar }: ChatMessageProps) {
  const isUser = message.sender === 'user';
  
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const getStatusIcon = () => {
    if (!isUser) return null;
    
    switch (message.status) {
      case 'sending':
        return <div className="w-3 h-3 rounded-full bg-muted-foreground/50 animate-pulse" />;
      case 'sent':
        return <div className="w-3 h-3 rounded-full bg-muted-foreground" />;
      case 'delivered':
        return <div className="w-3 h-3 rounded-full bg-primary/60" />;
      case 'read':
        return <div className="w-3 h-3 rounded-full bg-primary" />;
      default:
        return null;
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="max-w-xs">
            <ImageWithFallback
              src={message.imageUrl || ''}
              alt="Shared image"
              className="rounded-lg w-full"
            />
            {message.content && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );
      
      case 'location':
        return (
          <div className="bg-muted/20 rounded-lg p-3 max-w-xs">
            <div className="flex items-center space-x-2 mb-2">
              <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-xs">📍</span>
              </div>
              <span className="font-medium text-sm">{message.location?.name || 'Location'}</span>
            </div>
            <p className="text-xs text-muted-foreground">{message.location?.address}</p>
            {message.content && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );
      
      case 'document':
        return (
          <div className="bg-muted/20 rounded-lg p-3 max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                <span className="text-xs">📄</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{message.documentName || 'Document'}</p>
                <p className="text-xs text-muted-foreground">PDF • 2.1 MB</p>
              </div>
            </div>
            {message.content && (
              <p className="mt-2 text-sm">{message.content}</p>
            )}
          </div>
        );
      
      default:
        return <p className="text-sm leading-relaxed">{message.content}</p>;
    }
  };

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} max-w-[80%] items-end space-x-2`}>
        {/* Avatar */}
        {!isUser && showAvatar && (
          <ImageWithFallback
            src={agentAvatar || ''}
            alt={agentName || 'Agent'}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        )}
        {!isUser && !showAvatar && (
          <div className="w-8" />
        )}
        
        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-2 ${
            isUser
              ? 'bg-primary text-primary-foreground rounded-br-md'
              : 'bg-muted text-foreground rounded-bl-md'
          }`}
        >
          {renderMessageContent()}
          
          {/* Time and Status */}
          <div className={`flex items-center justify-between mt-1 ${
            isUser ? 'flex-row-reverse' : 'flex-row'
          }`}>
            <span className={`text-xs ${
              isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
            }`}>
              {formatTime(message.timestamp)}
            </span>
            {getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
}