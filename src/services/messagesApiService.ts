import { BaseApiService } from './baseApiService';

export class MessagesApiService extends BaseApiService {
  private readonly endpoint = '/messages';

  // Get messages for a user
  async getMessages(
    userId: string,
    filters?: {
      page?: number;
      limit?: number;
      unreadOnly?: boolean;
    }
  ): Promise<{ messages: any[]; total?: number }> {
    let url = `${this.endpoint}/${userId}`;

    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const cacheKey = `messages-${userId}-${JSON.stringify(
      filters || {}
    )}`;
    return this.request(url, {}, cacheKey, 30 * 1000); // 30 seconds cache
  }

  // Get conversation between two users
  async getConversation(
    userId1: string,
    userId2: string,
    filters?: {
      page?: number;
      limit?: number;
    }
  ): Promise<{ messages: any[] }> {
    let url = `${this.endpoint}/conversation/${userId1}/${userId2}`;

    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
      if (params.toString()) {
        url += `?${params.toString()}`;
      }
    }

    const cacheKey = `conversation-${userId1}-${userId2}-${JSON.stringify(
      filters || {}
    )}`;
    return this.request(url, {}, cacheKey, 30 * 1000);
  }

  // Send a message
  async sendMessage(messageData: {
    recipient_id: string;
    content: string;
    message_type?: string;
    sender_id?: string;
  }): Promise<{ message: any }> {
    const result = await this.request<{ message: any }>(
      this.endpoint,
      {
        method: 'POST',
        body: JSON.stringify(messageData),
      }
    );

    // Invalidate message caches
    this.clearCachePattern('messages-');
    this.clearCachePattern('conversation-');
    this.clearCachePattern('unread-count-');

    return result;
  }

  // Mark message as read
  async markMessageAsRead(
    messageId: string
  ): Promise<{ success: boolean }> {
    const result = await this.request<{ success: boolean }>(
      `${this.endpoint}/${messageId}/read`,
      {
        method: 'PUT',
      }
    );

    // Invalidate message caches
    this.clearCachePattern('messages-');
    this.clearCachePattern('conversation-');
    this.clearCachePattern('unread-count-');

    return result;
  }

  // Mark multiple messages as read
  async markMessagesAsRead(
    messageIds: string[]
  ): Promise<{ success: boolean }> {
    const result = await this.request<{ success: boolean }>(
      `${this.endpoint}/mark-read`,
      {
        method: 'PUT',
        body: JSON.stringify({ message_ids: messageIds }),
      }
    );

    // Invalidate message caches
    this.clearCachePattern('messages-');
    this.clearCachePattern('conversation-');
    this.clearCachePattern('unread-count-');

    return result;
  }

  // Mark entire conversation as read
  async markConversationAsRead(
    userId: string,
    otherUserId: string
  ): Promise<{ success: boolean }> {
    const result = await this.request<{ success: boolean }>(
      `${this.endpoint}/conversation/${userId}/${otherUserId}/mark-read`,
      {
        method: 'PUT',
      }
    );

    // Invalidate message caches
    this.clearCachePattern('messages-');
    this.clearCachePattern('conversation-');
    this.clearCachePattern('unread-count-');

    return result;
  }

  // Delete a message
  async deleteMessage(
    messageId: string
  ): Promise<{ success: boolean }> {
    const result = await this.request<{ success: boolean }>(
      `${this.endpoint}/${messageId}`,
      {
        method: 'DELETE',
      }
    );

    // Invalidate message caches
    this.clearCachePattern('messages-');
    this.clearCachePattern('conversation-');

    return result;
  }

  // Get unread message count
  async getUnreadCount(userId: string): Promise<{ count: number }> {
    return this.request(
      `${this.endpoint}/${userId}/unread-count`,
      {},
      `unread-count-${userId}`,
      30 * 1000
    );
  }

  // Get message by ID
  async getMessageById(messageId: string): Promise<{ message: any }> {
    return this.request(
      `${this.endpoint}/${messageId}`,
      {},
      `message-${messageId}`,
      2 * 60 * 1000
    );
  }

  // Search messages
  async searchMessages(
    userId: string,
    query: string,
    filters?: {
      senderId?: string;
      dateFrom?: string;
      dateTo?: string;
    }
  ): Promise<{ messages: any[]; total: number }> {
    const params = new URLSearchParams({ q: query, userId });
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value);
        }
      });
    }

    return this.request(`/search/messages?${params}`);
  }

  // Get recent conversations
  async getRecentConversations(
    userId: string,
    limit: number = 20
  ): Promise<{ conversations: any[] }> {
    return this.request(
      `${this.endpoint}/${userId}/conversations?limit=${limit}`,
      {},
      `recent-conversations-${userId}-${limit}`,
      1 * 60 * 1000
    );
  }

  // Send message with attachment
  async sendMessageWithAttachment(
    messageData: {
      recipient_id: string;
      content: string;
      sender_id?: string;
    },
    file: File
  ): Promise<{ message: any }> {
    // Upload the file first
    const { url, path } = await this.uploadFile(
      file,
      'message-attachments'
    );

    // Send message with attachment URL
    const messageWithAttachment = {
      ...messageData,
      message_type: 'attachment',
      attachment_url: url,
      attachment_path: path,
      attachment_name: file.name,
      attachment_size: file.size,
      attachment_type: file.type,
    };

    return this.sendMessage(messageWithAttachment);
  }

  // Delete message attachment
  async deleteMessageAttachment(
    messageId: string,
    attachmentPath: string
  ): Promise<{ success: boolean }> {
    // Delete file from storage
    await this.deleteFile(attachmentPath, 'message-attachments');

    // Update message to remove attachment
    const result = await this.request<{ success: boolean }>(
      `${this.endpoint}/${messageId}/attachment`,
      {
        method: 'DELETE',
      }
    );

    // Invalidate message caches
    this.clearCachePattern('messages-');
    this.clearCachePattern('conversation-');

    return result;
  }

  // Report message
  async reportMessage(
    messageId: string,
    reason: string,
    reporterId: string
  ): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(
      `${this.endpoint}/${messageId}/report`,
      {
        method: 'POST',
        body: JSON.stringify({ reason, reporter_id: reporterId }),
      }
    );
  }

  // Block user (prevent receiving messages from them)
  async blockUser(
    userId: string,
    blockedUserId: string
  ): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(
      `/users/${userId}/block`,
      {
        method: 'POST',
        body: JSON.stringify({ blocked_user_id: blockedUserId }),
      }
    );
  }

  // Unblock user
  async unblockUser(
    userId: string,
    blockedUserId: string
  ): Promise<{ success: boolean }> {
    return this.request<{ success: boolean }>(
      `/users/${userId}/unblock`,
      {
        method: 'POST',
        body: JSON.stringify({ blocked_user_id: blockedUserId }),
      }
    );
  }
}

// Create and export singleton instance
export const messagesApiService = new MessagesApiService();
