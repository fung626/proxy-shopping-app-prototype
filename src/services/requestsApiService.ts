import { BaseApiService } from './baseApiService';

export class RequestsApiService extends BaseApiService {
  private readonly endpoint = '/requests';

  // Get all requests
  async getRequests(filters?: {
    category?: string;
    location?: string;
    budgetMin?: number;
    budgetMax?: number;
    urgency?: string;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ requests: any[]; total?: number }> {
    let url = this.endpoint;

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

    const cacheKey = `requests-${JSON.stringify(filters || {})}`;
    return this.request(url, {}, cacheKey, 2 * 60 * 1000); // 2 minutes cache
  }

  // Get request by ID
  async getRequestById(requestId: string): Promise<{ request: any }> {
    return this.request(
      `${this.endpoint}/${requestId}`,
      {},
      `request-${requestId}`,
      5 * 60 * 1000 // 5 minutes cache
    );
  }

  // Create new request
  async createRequest(requestData: any): Promise<{ request: any }> {
    const result = await this.request<{ request: any }>(
      this.endpoint,
      {
        method: 'POST',
        body: JSON.stringify(requestData),
      }
    );

    // Invalidate requests cache
    this.clearCachePattern('requests-');

    return result;
  }

  // Update request
  async updateRequest(
    requestId: string,
    requestData: any
  ): Promise<{ request: any }> {
    const result = await this.request<{ request: any }>(
      `${this.endpoint}/${requestId}`,
      {
        method: 'PUT',
        body: JSON.stringify(requestData),
      }
    );

    // Invalidate related caches
    this.clearCachePattern('requests-');
    this.clearCache(`request-${requestId}`);

    return result;
  }

  // Delete request
  async deleteRequest(
    requestId: string
  ): Promise<{ success: boolean }> {
    const result = await this.request<{ success: boolean }>(
      `${this.endpoint}/${requestId}`,
      {
        method: 'DELETE',
      }
    );

    // Invalidate related caches
    this.clearCachePattern('requests-');
    this.clearCache(`request-${requestId}`);

    return result;
  }

  // Get requests by user
  async getRequestsByUser(
    userId: string
  ): Promise<{ requests: any[] }> {
    return this.request(
      `${this.endpoint}/user/${userId}`,
      {},
      `requests-user-${userId}`,
      2 * 60 * 1000
    );
  }

  // Search requests
  async searchRequests(
    query: string,
    filters?: any
  ): Promise<{ requests: any[]; total: number }> {
    const params = new URLSearchParams({ q: query, ...filters });
    return this.request(`/search/requests?${params}`);
  }

  // Upload request images
  async uploadRequestImages(
    requestId: string,
    files: File[]
  ): Promise<{ urls: string[]; paths: string[] }> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, 'request-images')
    );
    const results = await Promise.all(uploadPromises);

    const urls = results.map((r) => r.url);
    const paths = results.map((r) => r.path);

    // Update request with new image URLs
    await this.updateRequest(requestId, { images: urls });

    return { urls, paths };
  }

  // Update request status
  async updateRequestStatus(
    requestId: string,
    status: 'active' | 'fulfilled' | 'cancelled' | 'expired'
  ): Promise<{ request: any }> {
    return this.updateRequest(requestId, { status });
  }

  // Update request urgency
  async updateRequestUrgency(
    requestId: string,
    urgency: 'low' | 'medium' | 'high' | 'urgent'
  ): Promise<{ request: any }> {
    return this.updateRequest(requestId, { urgency });
  }

  // Update request budget
  async updateRequestBudget(
    requestId: string,
    budget: { min: number; max: number }
  ): Promise<{ request: any }> {
    return this.updateRequest(requestId, { budget });
  }

  // Get urgent requests
  async getUrgentRequests(
    limit: number = 10
  ): Promise<{ requests: any[] }> {
    return this.request(
      `${this.endpoint}/urgent?limit=${limit}`,
      {},
      `urgent-requests-${limit}`,
      1 * 60 * 1000 // 1 minute cache for urgent requests
    );
  }

  // Get requests by category
  async getRequestsByCategory(
    category: string,
    limit?: number
  ): Promise<{ requests: any[] }> {
    const params = new URLSearchParams({ category });
    if (limit) params.append('limit', limit.toString());

    return this.request(
      `${this.endpoint}/category?${params}`,
      {},
      `requests-category-${category}-${limit || 'all'}`,
      2 * 60 * 1000
    );
  }

  // Get requests by location
  async getRequestsByLocation(
    location: string,
    limit?: number
  ): Promise<{ requests: any[] }> {
    const params = new URLSearchParams({ location });
    if (limit) params.append('limit', limit.toString());

    return this.request(
      `${this.endpoint}/location?${params}`,
      {},
      `requests-location-${location}-${limit || 'all'}`,
      2 * 60 * 1000
    );
  }

  // Get matching offers for a request
  async getMatchingOffers(
    requestId: string
  ): Promise<{ offers: any[] }> {
    return this.request(
      `${this.endpoint}/${requestId}/matching-offers`,
      {},
      `matching-offers-${requestId}`,
      5 * 60 * 1000
    );
  }
}

// Create and export singleton instance
export const requestsApiService = new RequestsApiService();
