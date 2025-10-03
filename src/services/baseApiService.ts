import { supabase } from '@/supabase/client';
import { projectId, publicAnonKey } from '@/supabase/info';

export class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message);
    this.name = 'ApiError';
  }

  get isNetworkError(): boolean {
    return this.status === 0;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  get isClientError(): boolean {
    return this.status >= 400 && this.status < 500;
  }
}

export abstract class BaseApiService {
  protected baseUrl: string;
  protected defaultHeaders: Record<string, string>;
  protected cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  constructor() {
    // Use environment variable if available
    this.baseUrl =
      import.meta.env.VITE_API_BASE_URL ||
      `https://${projectId}.supabase.co/functions/v1/make-server-5cd23fe8`;
    this.defaultHeaders = {
      Authorization: `Bearer ${
        import.meta.env.VITE_SUPABASE_ANON_KEY || publicAnonKey
      }`,
      'Content-Type': 'application/json',
    };
  }

  protected async request<T>(
    endpoint: string,
    options: RequestInit = {},
    cacheKey?: string,
    cacheTTL: number = 5 * 60 * 1000 // 5 minutes
  ): Promise<T> {
    // Check cache first
    if (cacheKey && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() - cached.timestamp < cached.ttl) {
        return cached.data;
      }
      this.cache.delete(cacheKey);
    }

    const url = `${this.baseUrl}${endpoint}`;
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage =
            errorData.error || errorData.message || errorMessage;
        } catch {
          // Use default error message if JSON parsing fails
        }
        throw new ApiError(errorMessage, response.status);
      }

      const data = await response.json();

      // Cache successful GET requests
      if (
        cacheKey &&
        options.method !== 'POST' &&
        options.method !== 'PUT' &&
        options.method !== 'DELETE'
      ) {
        this.cache.set(cacheKey, {
          data,
          timestamp: Date.now(),
          ttl: cacheTTL,
        });
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }

      // Network or other errors
      if (
        error instanceof TypeError &&
        error.message.includes('fetch')
      ) {
        throw new ApiError(
          'Network connection failed. Please check your internet connection.',
          0
        );
      }

      throw new ApiError(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred',
        500
      );
    }
  }

  // Direct Supabase methods for better integration
  protected async getSupabaseUser(): Promise<any> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) throw new ApiError(error.message, 400);
    return user;
  }

  protected async getSupabaseSession(): Promise<any> {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw new ApiError(error.message, 400);
    return session;
  }

  // Cache management
  protected clearCache(key: string): void {
    this.cache.delete(key);
  }

  protected clearCachePattern(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(pattern)) {
        this.cache.delete(key);
      }
    }
  }

  protected clearAllCache(): void {
    this.cache.clear();
  }

  protected getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }

  // File upload helper
  protected async uploadFile(
    file: File,
    bucket: string = 'uploads'
  ): Promise<{ url: string; path: string }> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${fileExt}`;
    const filePath = `${bucket}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file);

    if (error) {
      throw new ApiError(`File upload failed: ${error.message}`, 400);
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return { url: publicUrl, path: filePath };
  }

  // Delete file helper
  protected async deleteFile(
    path: string,
    bucket: string = 'uploads'
  ): Promise<{ success: boolean }> {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);

    if (error) {
      throw new ApiError(
        `File deletion failed: ${error.message}`,
        400
      );
    }

    return { success: true };
  }

  // Retry mechanism for failed requests
  protected async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries) {
          throw lastError;
        }

        // Don't retry for certain error types
        if (
          error instanceof ApiError &&
          error.status >= 400 &&
          error.status < 500
        ) {
          throw error;
        }

        // Wait before retrying
        await new Promise((resolve) =>
          setTimeout(resolve, delay * attempt)
        );
      }
    }

    throw lastError!;
  }

  // Batch operations
  protected async batchRequest(
    requests: Array<{
      endpoint: string;
      options?: RequestInit;
      cacheKey?: string;
    }>
  ): Promise<any[]> {
    const promises = requests.map(({ endpoint, options, cacheKey }) =>
      this.request(endpoint, options, cacheKey).catch((error) => ({
        error,
      }))
    );

    return Promise.all(promises);
  }

  // Health check
  async healthCheck(): Promise<{
    status: string;
    timestamp: string;
  }> {
    return this.request('/health');
  }
}
