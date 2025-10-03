// Configuration management for Supabase integration
export interface AppConfig {
  supabase: {
    url: string;
    anonKey: string;
    serviceRoleKey?: string;
  };
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  features: {
    realtime: boolean;
    analytics: boolean;
    debug: boolean;
  };
  app: {
    name: string;
    version: string;
  };
}

class ConfigManager {
  private config: AppConfig;

  constructor() {
    this.config = this.loadConfig();
  }

  private loadConfig(): AppConfig {
    return {
      supabase: {
        url:
          import.meta.env.VITE_SUPABASE_URL ||
          'https://qmgrwxwtvddzidzrlrrn.supabase.co',
        anonKey:
          import.meta.env.VITE_SUPABASE_ANON_KEY ||
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtZ3J3eHd0dmRkemlkenJscnJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyMzg2MDEsImV4cCI6MjA3NDgxNDYwMX0.EIGr0earms18iYrWKawVViFGUg1zd6Lnmxn0DB5_A9w',
        serviceRoleKey: import.meta.env
          .VITE_SUPABASE_SERVICE_ROLE_KEY,
      },
      api: {
        baseUrl:
          import.meta.env.VITE_API_BASE_URL ||
          'https://qmgrwxwtvddzidzrlrrn.supabase.co/functions/v1/make-server-5cd23fe8',
        timeout: parseInt(
          import.meta.env.VITE_API_TIMEOUT || '10000'
        ),
        retryAttempts: parseInt(
          import.meta.env.VITE_API_RETRY_ATTEMPTS || '3'
        ),
      },
      features: {
        realtime: import.meta.env.VITE_ENABLE_REALTIME === 'true',
        analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
        debug:
          import.meta.env.VITE_ENABLE_DEBUG === 'true' ||
          import.meta.env.NODE_ENV === 'development',
      },
      app: {
        name: import.meta.env.VITE_APP_NAME || 'ProxyShop Mobile',
        version: import.meta.env.VITE_APP_VERSION || '2.0.0',
      },
    };
  }

  // Get full config
  getConfig(): AppConfig {
    return this.config;
  }

  // Get specific config sections
  getSupabaseConfig() {
    return this.config.supabase;
  }

  getApiConfig() {
    return this.config.api;
  }

  getFeatureFlags() {
    return this.config.features;
  }

  getAppInfo() {
    return this.config.app;
  }

  // Check if feature is enabled
  isFeatureEnabled(feature: keyof AppConfig['features']): boolean {
    return this.config.features[feature];
  }

  // Development helpers
  isDevelopment(): boolean {
    return (
      import.meta.env.NODE_ENV === 'development' ||
      this.config.features.debug
    );
  }

  isProduction(): boolean {
    return import.meta.env.NODE_ENV === 'production';
  }

  // Log configuration (for debugging)
  logConfig(): void {
    if (this.isDevelopment()) {
      console.log('App Configuration:', {
        ...this.config,
        supabase: {
          ...this.config.supabase,
          anonKey:
            this.config.supabase.anonKey.substring(0, 20) + '...',
          serviceRoleKey: this.config.supabase.serviceRoleKey
            ? '***'
            : undefined,
        },
      });
    }
  }

  // Validate configuration
  validateConfig(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.supabase.url) {
      errors.push('Supabase URL is required');
    }

    if (!this.config.supabase.anonKey) {
      errors.push('Supabase anon key is required');
    }

    if (!this.config.api.baseUrl) {
      errors.push('API base URL is required');
    }

    // Validate URL formats
    try {
      new URL(this.config.supabase.url);
    } catch {
      errors.push('Invalid Supabase URL format');
    }

    try {
      new URL(this.config.api.baseUrl);
    } catch {
      errors.push('Invalid API base URL format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Create and export singleton instance
export const configManager = new ConfigManager();

// Export config for direct access
export const config = configManager.getConfig();
