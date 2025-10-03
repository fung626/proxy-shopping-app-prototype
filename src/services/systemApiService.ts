import { BaseApiService } from './baseApiService';

export class SystemApiService extends BaseApiService {
  // Database methods
  async getTableStatus(): Promise<{
    tables: Record<string, boolean>;
    allTablesExist: boolean;
  }> {
    return this.request('/tables/status');
  }

  async seedDatabase(): Promise<any> {
    return this.request('/seed', { method: 'POST' });
  }

  async resetDatabase(): Promise<any> {
    return this.request('/reset', { method: 'POST' });
  }

  async backupDatabase(): Promise<{
    success: boolean;
    backup_id: string;
  }> {
    return this.request('/backup', { method: 'POST' });
  }

  async restoreDatabase(
    backupId: string
  ): Promise<{ success: boolean }> {
    return this.request('/restore', {
      method: 'POST',
      body: JSON.stringify({ backup_id: backupId }),
    });
  }

  // Analytics methods
  async getAnalytics(
    type:
      | 'offers'
      | 'requests'
      | 'orders'
      | 'users'
      | 'messages'
      | 'system'
  ): Promise<any> {
    return this.request(
      `/analytics/${type}`,
      {},
      `analytics-${type}`,
      10 * 60 * 1000 // 10 minutes cache
    );
  }

  async getDashboardStats(): Promise<{
    users: { total: number; active: number; new_today: number };
    offers: { total: number; active: number; sold_today: number };
    requests: { total: number; active: number; new_today: number };
    orders: {
      total: number;
      pending: number;
      completed_today: number;
    };
    messages: { total: number; sent_today: number };
    revenue: { total: number; today: number; this_month: number };
  }> {
    return this.request(
      '/analytics/dashboard',
      {},
      'dashboard-stats',
      5 * 60 * 1000 // 5 minutes cache
    );
  }

  async getUserAnalytics(userId?: string): Promise<{
    profile_views: number;
    offers_created: number;
    requests_created: number;
    orders_completed: number;
    rating: number;
    reviews_count: number;
  }> {
    const params = userId ? `?userId=${userId}` : '';
    return this.request(
      `/analytics/user${params}`,
      {},
      `user-analytics-${userId || 'current'}`,
      5 * 60 * 1000
    );
  }

  async getRevenueAnalytics(
    period: 'day' | 'week' | 'month' | 'year' = 'month'
  ): Promise<{
    revenue: Array<{ date: string; amount: number; orders: number }>;
    total: number;
    growth: number;
  }> {
    return this.request(
      `/analytics/revenue?period=${period}`,
      {},
      `revenue-analytics-${period}`,
      30 * 60 * 1000 // 30 minutes cache
    );
  }

  // Search methods
  async globalSearch(
    query: string,
    types?: Array<'offers' | 'requests' | 'users' | 'orders'>
  ): Promise<{
    offers: any[];
    requests: any[];
    users: any[];
    orders: any[];
    total: number;
  }> {
    const params = new URLSearchParams({ q: query });
    if (types && types.length > 0) {
      params.append('types', types.join(','));
    }

    return this.request(`/search/global?${params}`);
  }

  // System settings
  async getSystemSettings(): Promise<{
    settings: Record<string, any>;
  }> {
    return this.request(
      '/system/settings',
      {},
      'system-settings',
      10 * 60 * 1000
    );
  }

  async updateSystemSettings(
    settings: Record<string, any>
  ): Promise<{ success: boolean }> {
    const result = await this.request<{ success: boolean }>(
      '/system/settings',
      {
        method: 'PUT',
        body: JSON.stringify(settings),
      }
    );

    // Invalidate settings cache
    this.clearCache('system-settings');

    return result;
  }

  // Notifications
  async sendSystemNotification(
    userId: string,
    notification: {
      title: string;
      message: string;
      type: 'info' | 'warning' | 'error' | 'success';
      action_url?: string;
    }
  ): Promise<{ success: boolean }> {
    return this.request('/notifications/send', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, ...notification }),
    });
  }

  async broadcastNotification(
    notification: {
      title: string;
      message: string;
      type: 'info' | 'warning' | 'error' | 'success';
      action_url?: string;
    },
    filters?: {
      user_types?: string[];
      locations?: string[];
      active_only?: boolean;
    }
  ): Promise<{ success: boolean; sent_count: number }> {
    return this.request('/notifications/broadcast', {
      method: 'POST',
      body: JSON.stringify({ ...notification, filters }),
    });
  }

  // System health and monitoring
  async getSystemHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'down';
    database: 'connected' | 'disconnected';
    storage: 'available' | 'unavailable';
    api_response_time: number;
    uptime: number;
    memory_usage: number;
    disk_usage: number;
  }> {
    return this.request('/system/health');
  }

  async getSystemLogs(
    level: 'error' | 'warn' | 'info' | 'debug' = 'error',
    limit: number = 100
  ): Promise<{
    logs: Array<{
      timestamp: string;
      level: string;
      message: string;
      meta?: any;
    }>;
  }> {
    return this.request(
      `/system/logs?level=${level}&limit=${limit}`,
      {},
      `system-logs-${level}-${limit}`,
      1 * 60 * 1000 // 1 minute cache
    );
  }

  // Cache management
  async clearSystemCache(
    cacheType?: 'all' | 'api' | 'database' | 'files'
  ): Promise<{ success: boolean }> {
    const params = cacheType ? `?type=${cacheType}` : '';
    return this.request(`/system/cache/clear${params}`, {
      method: 'POST',
    });
  }

  async getSystemCacheStats(): Promise<{
    api_cache: { size: number; hit_rate: number };
    database_cache: { size: number; hit_rate: number };
    file_cache: { size: number; used_space: number };
  }> {
    return this.request(
      '/system/cache/stats',
      {},
      'cache-stats',
      30 * 1000 // 30 seconds cache
    );
  }

  // User management (admin functions)
  async suspendUser(
    userId: string,
    reason: string,
    duration?: number
  ): Promise<{ success: boolean }> {
    return this.request('/admin/users/suspend', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId, reason, duration }),
    });
  }

  async unsuspendUser(userId: string): Promise<{ success: boolean }> {
    return this.request('/admin/users/unsuspend', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async verifyUser(
    userId: string,
    verificationType: string
  ): Promise<{ success: boolean }> {
    return this.request('/admin/users/verify', {
      method: 'POST',
      body: JSON.stringify({
        user_id: userId,
        verification_type: verificationType,
      }),
    });
  }

  // Content moderation
  async flagContent(
    contentType: 'offer' | 'request' | 'message' | 'user',
    contentId: string,
    reason: string,
    reporterId?: string
  ): Promise<{ success: boolean }> {
    return this.request('/admin/content/flag', {
      method: 'POST',
      body: JSON.stringify({
        content_type: contentType,
        content_id: contentId,
        reason,
        reporter_id: reporterId,
      }),
    });
  }

  async getFlaggedContent(
    contentType?: 'offer' | 'request' | 'message' | 'user',
    status?: 'pending' | 'reviewed' | 'resolved'
  ): Promise<{ flagged_content: any[] }> {
    const params = new URLSearchParams();
    if (contentType) params.append('content_type', contentType);
    if (status) params.append('status', status);

    return this.request(
      `/admin/content/flagged?${params}`,
      {},
      `flagged-content-${contentType || 'all'}-${status || 'all'}`,
      2 * 60 * 1000
    );
  }

  async resolveFlag(
    flagId: string,
    action: 'approve' | 'remove' | 'warn'
  ): Promise<{ success: boolean }> {
    return this.request('/admin/content/resolve-flag', {
      method: 'POST',
      body: JSON.stringify({ flag_id: flagId, action }),
    });
  }
}

// Create and export singleton instance
export const systemApiService = new SystemApiService();
