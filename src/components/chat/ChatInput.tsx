import { useState, useRef } from 'react';
import { Send, Plus, Image, MapPin, Paperclip, Smile } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

interface ChatInputProps {
  onSendMessage: (content: string, type: 'text' | 'image' | 'location' | 'document') => void;
  onTyping?: (isTyping: boolean) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  onSendMessage, 
  onTyping, 
  disabled = false,
  placeholder = "Type a message..." 
}: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [showAttachments, setShowAttachments] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage, 'text');
      setMessage('');
      onTyping?.(false);
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setMessage(value);
    onTyping?.(value.length > 0);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload the file and get a URL
      onSendMessage(`Shared an image: ${file.name}`, 'image');
      setShowAttachments(false);
    }
  };

  const handleLocationShare = () => {
    onSendMessage('Shared location', 'location');
    setShowAttachments(false);
  };

  const handleDocumentShare = () => {
    onSendMessage('Shared a document', 'document');
    setShowAttachments(false);
  };

  return (
    <div className="border-t border-border bg-card">
      {/* Attachments Menu */}
      {showAttachments && (
        <div className="p-4 border-b border-border">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleImageUpload}
              className="flex flex-col items-center space-y-1 h-16 w-16"
            >
              <Image className="h-6 w-6 text-primary" />
              <span className="text-xs">Photo</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLocationShare}
              className="flex flex-col items-center space-y-1 h-16 w-16"
            >
              <MapPin className="h-6 w-6 text-primary" />
              <span className="text-xs">Location</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDocumentShare}
              className="flex flex-col items-center space-y-1 h-16 w-16"
            >
              <Paperclip className="h-6 w-6 text-primary" />
              <span className="text-xs">Document</span>
            </Button>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex items-end space-x-2 p-4">
        {/* Attachment Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowAttachments(!showAttachments)}
          className="h-10 w-10 flex-shrink-0"
          disabled={disabled}
        >
          <Plus className={`h-5 w-5 transition-transform ${showAttachments ? 'rotate-45' : ''}`} />
        </Button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={message}
            onChange={handleTextChange}
            onKeyPress={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled}
            className="min-h-[40px] max-h-[120px] resize-none rounded-2xl border-muted bg-muted/50 px-4 py-2 pr-12 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
            rows={1}
          />
          
          {/* Emoji Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
            disabled={disabled}
          >
            <Smile className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={!message.trim() || disabled}
          size="icon"
          className="h-10 w-10 rounded-full flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}