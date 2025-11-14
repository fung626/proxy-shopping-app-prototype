# Chat System Setup Guide

This guide will help you set up the real-time chat system using Supabase.

## 1. Database Setup

### Run the SQL Schema

1. Open your Supabase project dashboard
2. Go to the SQL Editor
3. Open the file `src/supabase/chat-schema.sql`
4. Copy and paste the entire content into the SQL Editor
5. Click "Run" to execute the schema

This will create:

- `conversations` table
- `conversation_participants` table
- `messages` table
- Indexes for performance
- Triggers for auto-updating conversation metadata
- Row Level Security (RLS) policies
- Helper function `get_or_create_conversation()`

### Enable Realtime

1. In Supabase Dashboard, go to Database → Replication
2. Enable replication for these tables:
   - `conversations`
   - `messages`
   - `conversation_participants`

## 2. File Structure

```
src/
├── supabase/
│   └── chat-schema.sql           # Database schema
├── types/
│   └── chat.ts                   # TypeScript types
├── services/
│   └── chatSupabaseService.ts    # Chat service with all API methods
└── pages/
    └── tabs/
        └── MessagesTab.tsx       # Chat UI (to be updated)
```

## 3. Service API

### ChatSupabaseService Methods

#### Get or Create Conversation

```typescript
const conversation =
  await chatSupabaseService.getOrCreateConversation({
    participant_user_id: 'user-uuid',
    request_id: 'optional-request-uuid',
    offer_id: 'optional-offer-uuid',
  });
```

#### Get All Conversations

```typescript
const conversations = await chatSupabaseService.getMyConversations();
```

#### Get Messages

```typescript
const messages = await chatSupabaseService.getMessages(
  conversationId,
  50
);
```

#### Send Message

```typescript
const message = await chatSupabaseService.sendMessage({
  conversation_id: conversationId,
  content: 'Hello!',
  message_type: 'text',
});
```

#### Real-time Subscriptions

```typescript
// Subscribe to new messages
const channel = chatSupabaseService.subscribeToMessages(
  conversationId,
  (message) => {
    console.log('New message:', message);
  }
);

// Subscribe to conversation updates
const convChannel = chatSupabaseService.subscribeToConversations(
  (conversation) => {
    console.log('Conversation updated:', conversation);
  }
);

// Cleanup
chatSupabaseService.unsubscribeFromMessages(conversationId);
chatSupabaseService.unsubscribeAll();
```

#### Mark as Read

```typescript
await chatSupabaseService.markAsRead({
  conversation_id: conversationId,
});
```

#### Other Actions

```typescript
// Toggle pin
await chatSupabaseService.togglePin(conversationId);

// Archive conversation
await chatSupabaseService.archiveConversation(conversationId);

// Delete message
await chatSupabaseService.deleteMessage(messageId);

// Edit message
await chatSupabaseService.editMessage(messageId, 'Updated content');
```

## 4. Usage in MessagesTab

The MessagesTab component needs to be updated to:

1. **Replace mock data** with real Supabase data
2. **Load conversations** on mount
3. **Subscribe to real-time updates**
4. **Handle sending messages** through the service
5. **Mark conversations as read** when viewing

Example pattern:

```typescript
const [conversations, setConversations] = useState<
  ConversationWithParticipants[]
>([]);
const [messages, setMessages] = useState<MessageWithSender[]>([]);

useEffect(() => {
  // Load conversations
  const loadConversations = async () => {
    const data = await chatSupabaseService.getMyConversations();
    setConversations(data);
  };
  loadConversations();

  // Subscribe to updates
  const channel = chatSupabaseService.subscribeToConversations(
    (conv) => {
      // Update conversations list
    }
  );

  return () => {
    supabase.removeChannel(channel);
  };
}, []);
```

## 5. Features Included

✅ **Core Chat Features**

- Create conversations between users
- Send text, image, location, and document messages
- Real-time message updates
- Unread count tracking
- Last message preview

✅ **Advanced Features**

- Pin conversations
- Archive conversations
- Mark as read
- Edit messages
- Delete messages (soft delete)
- Pagination support
- Message status tracking

✅ **Security**

- Row Level Security (RLS) policies
- Users can only see their own conversations
- Users can only send messages in their conversations
- Authentication required for all operations

✅ **Performance**

- Database indexes for fast queries
- Automatic triggers for metadata updates
- Efficient query structure with joins

## 6. Next Steps

1. ✅ Schema created
2. ✅ Types defined
3. ✅ Service implemented
4. 🔄 Update MessagesTab to use real data (in progress)
5. ⏳ Add real-time subscriptions to UI
6. ⏳ Test with real users

## 7. Testing

To test the chat system:

1. Create two user accounts
2. Have one user initiate a chat (e.g., from an offer/request page)
3. Send messages back and forth
4. Test real-time updates by opening two browser windows
5. Test pin, archive, and mark as read features

## 8. Troubleshooting

**Messages not appearing in real-time?**

- Ensure Realtime is enabled in Supabase Dashboard
- Check browser console for WebSocket errors
- Verify RLS policies are correct

**Can't create conversations?**

- Verify both user IDs exist in the users table
- Check RLS policies allow INSERT on conversations
- Look for errors in browser console

**Performance issues?**

- Ensure database indexes are created
- Consider pagination for large message lists
- Check query performance in Supabase Dashboard
