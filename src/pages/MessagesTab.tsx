import { useState, useEffect } from 'react';
import { ChatList, ChatListItem } from '../components/chat/ChatList';
import { ChatView, ChatData } from '../components/chat/ChatView';
import { ChatMessageData } from '../components/chat/ChatMessage';
import { useLanguage } from '../store/LanguageContext';
import { User } from '../types';
import { MessageCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

interface MessagesTabProps {
  user: User | null;
  onSignIn: () => void;
  onChatViewChange?: (inChatView: boolean) => void;
  selectedAgentId?: string;
}

export function MessagesTab({ user, onSignIn, onChatViewChange, selectedAgentId }: MessagesTabProps) {
  const { t } = useLanguage();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Check authentication first
  if (!user) {
    return (
      <div className="flex-1 bg-background pb-20">
        {/* Header */}
        <div className="bg-card px-4 pt-12 pb-6">
          <h1 className="text-3xl font-semibold text-foreground">{t('nav.messages')}</h1>
          <p className="text-muted-foreground mt-1">{t('messages.description')}</p>
        </div>

        {/* Sign In Prompt */}
        <div className="px-4 py-8">
          <div className="text-center py-12">
            <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('messages.signInPrompt')}</h3>
            <p className="text-muted-foreground mb-6">
              {t('messages.signInDescription')}
            </p>
            <Button onClick={onSignIn} className="px-8">
              {t('profile.signIn')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Auto-select chat when an agent is specified
  useEffect(() => {
    if (selectedAgentId) {
      // Find existing chat with this agent or create new chat
      const existingChat = chatList.find(chat => chat.id === selectedAgentId);
      if (existingChat) {
        setSelectedChatId(selectedAgentId);
        onChatViewChange?.(true);
      } else {
        // Create a new chat with the agent (in a real app, this would create a new conversation)
        setSelectedChatId(selectedAgentId);
        onChatViewChange?.(true);
      }
    }
  }, [selectedAgentId]);

  // Mock chat data
  const [chatList] = useState<ChatListItem[]>([
    {
      id: '1',
      agentName: 'Sarah Johnson',
      agentImage: 'https://images.unsplash.com/photo-1628657485319-5865d0f2791d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4MTIyMzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      lastMessage: 'I found some great options for your laptop requirement. The Dell laptops are available at bulk pricing.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unreadCount: 2,
      requestTitle: 'Office Laptops & Equipment',
      isOnline: true,
      messageType: 'text',
      isPinned: true
    },
    {
      id: '2',
      agentName: 'Michael Chen',
      agentImage: 'https://images.unsplash.com/photo-1584940121258-c2553b66a739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODE1ODkyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      lastMessage: 'Perfect! The materials are ready for pickup. Location details attached.',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      unreadCount: 0,
      requestTitle: 'Construction Materials',
      isOnline: false,
      messageType: 'location'
    },
    {
      id: '3',
      agentName: 'Emma Rodriguez',
      agentImage: 'https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNleSUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODEzODkxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      lastMessage: 'Here are the medical devices you requested',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      unreadCount: 1,
      requestTitle: 'Medical Equipment',
      isOnline: true,
      messageType: 'image'
    },
    {
      id: '4',
      agentName: 'David Kim',
      agentImage: 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMGFzaWFufGVufDF8fHx8MTc1ODEzODkxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      lastMessage: 'The electronics shipment documentation is ready for review',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
      unreadCount: 0,
      requestTitle: 'Consumer Electronics',
      isOnline: false,
      messageType: 'document'
    },
    {
      id: '5',
      agentName: 'Lisa Wang',
      agentImage: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwYXNpYW58ZW58MXx8fHwxNzU4MTM4OTE1fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      lastMessage: 'Thank you for choosing our service! The fashion items have been delivered successfully.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
      unreadCount: 0,
      requestTitle: 'Fashion & Accessories',
      isOnline: true,
      messageType: 'text'
    }
  ]);

  // Create default chat data for agents from ViewOffersPage if they don't exist
  const createDefaultChatForAgent = (agentId: string): ChatData => {
    const agentNames: Record<string, string> = {
      '1': 'Sarah Chen',
      '2': 'Mike Johnson', 
      '3': 'Emma Davis'
    };
    
    return {
      id: agentId,
      agentName: agentNames[agentId] || 'Agent',
      agentImage: 'https://images.unsplash.com/photo-1628657485319-5865d0f2791d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4MTIyMzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      requestTitle: 'New Conversation',
      isOnline: true,
      lastSeen: new Date(),
      messages: [
        {
          id: `${agentId}-welcome`,
          content: `Hi! I'm ${agentNames[agentId] || 'your shopping agent'}. I'm here to help with your shopping request. How can I assist you today?`,
          sender: 'agent',
          timestamp: new Date(),
          type: 'text',
          status: 'delivered'
        }
      ]
    };
  };

  // Mock detailed chat data
  const [chatData] = useState<Record<string, ChatData>>({
    '1': {
      id: '1',
      agentName: 'Sarah Johnson',
      agentImage: 'https://images.unsplash.com/photo-1628657485319-5865d0f2791d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMHdvbWFuJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU4MTIyMzgzfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      requestTitle: 'Office Laptops & Equipment',
      isOnline: true,
      lastSeen: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      messages: [
        {
          id: '1-1',
          content: 'Hi! I saw your request for office laptops. I can help you find the best deals.',
          sender: 'agent',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: '1-2',
          content: 'Great! I need about 15 laptops for our new office. Looking for something with good performance but budget-friendly.',
          sender: 'user',
          timestamp: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: '1-3',
          content: 'Perfect! I have some excellent options from Dell and Lenovo. Both offer great bulk pricing for orders over 10 units.',
          sender: 'agent',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: '1-4',
          content: 'Here are the models I recommend for your requirements',
          sender: 'agent',
          timestamp: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
          type: 'image',
          status: 'read',
          imageUrl: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsYXB0b3AlMjBjb21wdXRlcnxlbnwxfHx8fDE3NTgxMzg5MTV8MA&ixlib=rb-4.1.0&q=80&w=1080'
        },
        {
          id: '1-5',
          content: 'These look perfect! What\'s the pricing for 15 units of the Dell model?',
          sender: 'user',
          timestamp: new Date(Date.now() - 2.2 * 60 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: '1-6',
          content: 'I found some great options for your laptop requirement. The Dell laptops are available at bulk pricing.',
          sender: 'agent',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          type: 'text',
          status: 'delivered'
        },
        {
          id: '1-7',
          content: 'For 15 units of the Dell Inspiron 15, I can offer $650 per unit (regular price $750). Total would be $9,750 including shipping and setup.',
          sender: 'agent',
          timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
          type: 'text',
          status: 'delivered'
        }
      ]
    },
    '2': {
      id: '2',
      agentName: 'Michael Chen',
      agentImage: 'https://images.unsplash.com/photo-1584940121258-c2553b66a739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHByb2Zlc3Npb25hbCUyMG1hbiUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODE1ODkyMXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      requestTitle: 'Construction Materials',
      isOnline: false,
      lastSeen: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      messages: [
        {
          id: '2-1',
          content: 'I can help you source the construction materials you need. What specific materials are you looking for?',
          sender: 'agent',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: '2-2',
          content: 'I need cement, steel bars, and roofing materials for a small house project.',
          sender: 'user',
          timestamp: new Date(Date.now() - 1.8 * 24 * 60 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: '2-3',
          content: 'Perfect! The materials are ready for pickup. Location details attached.',
          sender: 'agent',
          timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
          type: 'location',
          status: 'read',
          location: {
            name: 'Chen Materials Warehouse',
            address: '1234 Industrial Blvd, Construction District'
          }
        }
      ]
    },
    '3': {
      id: '3',
      agentName: 'Emma Rodriguez',
      agentImage: 'https://images.unsplash.com/photo-1708195886023-3ecb00ac7a49?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNleSUyMHByb2Zlc3Npb25hbCUyMHBvcnRyYWl0fGVufDF8fHx8MTc1ODEzODkxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      requestTitle: 'Medical Equipment',
      isOnline: true,
      lastSeen: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
      messages: [
        {
          id: '3-1',
          content: 'Hello! I specialize in medical equipment procurement. What specific devices do you need?',
          sender: 'agent',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: '3-2',
          content: 'I need to purchase some diagnostic equipment for our clinic.',
          sender: 'user',
          timestamp: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000),
          type: 'text',
          status: 'read'
        },
        {
          id: '3-3',
          content: 'Here are the medical devices you requested',
          sender: 'agent',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          type: 'image',
          status: 'delivered',
          imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZXF1aXBtZW50fGVufDF8fHx8MTc1ODEzODkxNXww&ixlib=rb-4.1.0&q=80&w=1080'
        }
      ]
    }
  });

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    onChatViewChange?.(true);
  };

  const handleBackToList = () => {
    setSelectedChatId(null);
    onChatViewChange?.(false);
  };

  const handleSendMessage = (chatId: string, content: string, type: 'text' | 'image' | 'location' | 'document') => {
    // In a real app, this would make an API call
    console.log('Sending message:', { chatId, content, type });
    
    // Mock adding the message to the chat
    const newMessage: ChatMessageData = {
      id: `${chatId}-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date(),
      type,
      status: 'sending'
    };

    // Simulate message status updates
    setTimeout(() => {
      // Update to sent
      console.log('Message sent');
    }, 500);

    setTimeout(() => {
      // Update to delivered
      console.log('Message delivered');
    }, 1000);

    setTimeout(() => {
      // Update to read
      console.log('Message read');
    }, 2000);
  };

  // If a chat is selected, show the chat view
  if (selectedChatId) {
    const currentChat = chatData[selectedChatId] || createDefaultChatForAgent(selectedChatId);
    return (
      <div className="h-screen">
        <ChatView
          chat={currentChat}
          onBack={handleBackToList}
          onSendMessage={handleSendMessage}
        />
      </div>
    );
  }

  // Otherwise, show the chat list
  return (
    <ChatList
      chats={chatList}
      onChatSelect={handleChatSelect}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    />
  );
}