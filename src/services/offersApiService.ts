import { BaseApiService } from './baseApiService';

export class OffersApiService extends BaseApiService {
  private readonly endpoint = '/offers';

  // Get all offers
  async getOffers(filters?: {
    category?: string;
    location?: string;
    priceMin?: number;
    priceMax?: number;
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{ offers: any[]; total?: number }> {
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

    const cacheKey = `offers-${JSON.stringify(filters || {})}`;
    return this.request(url, {}, cacheKey, 2 * 60 * 1000); // 2 minutes cache
  }

  // Get offer by ID
  async getOfferById(offerId: string): Promise<{ offer: any }> {
    return this.request(
      `${this.endpoint}/${offerId}`,
      {},
      `offer-${offerId}`,
      5 * 60 * 1000 // 5 minutes cache
    );
  }

  // Create new offer
  async createOffer(offerData: any): Promise<{ offer: any }> {
    const result = await this.request<{ offer: any }>(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(offerData),
    });

    // Invalidate offers cache
    this.clearCachePattern('offers-');

    return result;
  }

  // Update offer
  async updateOffer(
    offerId: string,
    offerData: any
  ): Promise<{ offer: any }> {
    const result = await this.request<{ offer: any }>(
      `${this.endpoint}/${offerId}`,
      {
        method: 'PUT',
        body: JSON.stringify(offerData),
      }
    );

    // Invalidate related caches
    this.clearCachePattern('offers-');
    this.clearCache(`offer-${offerId}`);

    return result;
  }

  // Delete offer
  async deleteOffer(offerId: string): Promise<{ success: boolean }> {
    const result = await this.request<{ success: boolean }>(
      `${this.endpoint}/${offerId}`,
      {
        method: 'DELETE',
      }
    );

    // Invalidate related caches
    this.clearCachePattern('offers-');
    this.clearCache(`offer-${offerId}`);

    return result;
  }

  // Get offers by agent
  async getOffersByAgent(
    agentId: string
  ): Promise<{ offers: any[] }> {
    return this.request(
      `${this.endpoint}/agent/${agentId}`,
      {},
      `offers-agent-${agentId}`,
      2 * 60 * 1000
    );
  }

  // Search offers
  async searchOffers(
    query: string,
    filters?: any
  ): Promise<{ offers: any[]; total: number }> {
    const params = new URLSearchParams({ q: query, ...filters });
    return this.request(`/search/offers?${params}`);
  }

  // Upload offer images
  async uploadOfferImages(
    offerId: string,
    files: File[]
  ): Promise<{ urls: string[]; paths: string[] }> {
    const uploadPromises = files.map((file) =>
      this.uploadFile(file, 'offer-images')
    );
    const results = await Promise.all(uploadPromises);

    const urls = results.map((r) => r.url);
    const paths = results.map((r) => r.path);

    // Update offer with new image URLs
    await this.updateOffer(offerId, { images: urls });

    return { urls, paths };
  }

  // Update offer status
  async updateOfferStatus(
    offerId: string,
    status: 'active' | 'inactive' | 'sold' | 'expired'
  ): Promise<{ offer: any }> {
    return this.updateOffer(offerId, { status });
  }

  // Update offer quantity
  async updateOfferQuantity(
    offerId: string,
    quantity: number
  ): Promise<{ offer: any }> {
    return this.updateOffer(offerId, {
      available_quantity: quantity,
    });
  }

  // Get featured offers
  async getFeaturedOffers(
    limit: number = 10
  ): Promise<{ offers: any[] }> {
    return this.request(
      `${this.endpoint}/featured?limit=${limit}`,
      {},
      `featured-offers-${limit}`,
      5 * 60 * 1000
    );
  }

  // Get offers by category
  async getOffersByCategory(
    category: string,
    limit?: number
  ): Promise<{ offers: any[] }> {
    const params = new URLSearchParams({ category });
    if (limit) params.append('limit', limit.toString());

    return this.request(
      `${this.endpoint}/category?${params}`,
      {},
      `offers-category-${category}-${limit || 'all'}`,
      2 * 60 * 1000
    );
  }
}

// Create and export singleton instance
export const offersApiService = new OffersApiService();
