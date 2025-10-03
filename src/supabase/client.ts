import { createClient } from '@supabase/supabase-js';
import { projectId, publicAnonKey } from './info';

// Use environment variables if available, fallback to info.tsx
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  `https://${projectId}.supabase.co`;
const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || publicAnonKey;

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: false, // Disable auto refresh to prevent hanging
    detectSessionInUrl: false,
    flowType: 'pkce',
  },
  global: {
    headers: {
      'x-application-name': 'mobile-proxy-shopping',
    },
    fetch: (url, options) => {
      // Add timeout to all Supabase requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      return fetch(url, {
        ...options,
        signal: controller.signal,
      }).finally(() => {
        clearTimeout(timeoutId);
      });
    },
  },
  db: {
    schema: 'public',
  },
  // Remove realtime to reduce complexity
});

// Type definitions for our database tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          nickname?: string;
          gender?: string;
          phone?: string;
          country?: string;
          bio?: string;
          avatar?: string;
          date_of_birth?: string;
          website?: string;
          company?: string;
          job_title?: string;
          languages?: string[];
          preferences?: {
            categories: string[];
          };
          verification_status?: {
            email: boolean;
            phone: boolean;
            identity: boolean;
            business: boolean;
            bank?: boolean;
          };
          credit_cards?: any[];
          bank_information?: any;
          transaction_password_enabled?: boolean;
          transaction_password_set?: boolean;
          biometric_auth_enabled?: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          nickname?: string;
          gender?: string;
          phone?: string;
          country?: string;
          bio?: string;
          avatar?: string;
          date_of_birth?: string;
          website?: string;
          company?: string;
          job_title?: string;
          languages?: string[];
          preferences?: {
            categories: string[];
          };
          verification_status?: {
            email: boolean;
            phone: boolean;
            identity: boolean;
            business: boolean;
            bank?: boolean;
          };
          credit_cards?: any[];
          bank_information?: any;
          transaction_password_enabled?: boolean;
          transaction_password_set?: boolean;
          biometric_auth_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          nickname?: string;
          gender?: string;
          phone?: string;
          country?: string;
          bio?: string;
          avatar?: string;
          date_of_birth?: string;
          website?: string;
          company?: string;
          job_title?: string;
          languages?: string[];
          preferences?: {
            categories: string[];
          };
          verification_status?: {
            email: boolean;
            phone: boolean;
            identity: boolean;
            business: boolean;
            bank?: boolean;
          };
          credit_cards?: any[];
          bank_information?: any;
          transaction_password_enabled?: boolean;
          transaction_password_set?: boolean;
          biometric_auth_enabled?: boolean;
          updated_at?: string;
        };
      };
      shopping_offers: {
        Row: {
          id: string;
          title: string;
          description: string;
          category: string;
          price: number;
          currency: string;
          images?: string[];
          agent_id: string;
          agent_name: string;
          agent_rating: number;
          agent_reviews: number;
          location: string;
          shopping_location: string;
          delivery_options: string[];
          available_quantity: number;
          estimated_delivery: {
            start: number;
            end: number;
            unit: string;
          };
          specifications?: string[];
          tags?: string[];
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          category: string;
          price: number;
          currency: string;
          images?: string[];
          agent_id: string;
          agent_name: string;
          agent_rating: number;
          agent_reviews: number;
          location: string;
          shopping_location: string;
          delivery_options: string[];
          available_quantity: number;
          estimated_delivery: {
            start: number;
            end: number;
            unit: string;
          };
          specifications?: string[];
          tags?: string[];
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          category?: string;
          price?: number;
          currency?: string;
          images?: string[];
          agent_id?: string;
          agent_name?: string;
          agent_rating?: number;
          agent_reviews?: number;
          location?: string;
          shopping_location?: string;
          delivery_options?: string[];
          available_quantity?: number;
          estimated_delivery?: {
            start: number;
            end: number;
            unit: string;
          };
          specifications?: string[];
          tags?: string[];
          status?: string;
          updated_at?: string;
        };
      };
      shopping_requests: {
        Row: {
          id: string;
          user_id: string;
          user_name: string;
          title: string;
          description: string;
          category: string;
          budget: {
            min: number;
            max: number;
          };
          currency: string;
          images?: string[];
          target_location: string;
          preferred_shopping_location: string;
          quantity: number;
          urgency: string;
          expected_delivery: {
            start: number;
            end: number;
            unit: string;
          };
          requirements?: string[];
          tags?: string[];
          status: string;
          deadline?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          user_name: string;
          title: string;
          description: string;
          category: string;
          budget: {
            min: number;
            max: number;
          };
          currency: string;
          images?: string[];
          target_location: string;
          preferred_shopping_location: string;
          quantity: number;
          urgency: string;
          expected_delivery: {
            start: number;
            end: number;
            unit: string;
          };
          requirements?: string[];
          tags?: string[];
          status?: string;
          deadline?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          user_name?: string;
          title?: string;
          description?: string;
          category?: string;
          budget?: {
            min: number;
            max: number;
          };
          currency?: string;
          images?: string[];
          target_location?: string;
          preferred_shopping_location?: string;
          quantity?: number;
          urgency?: string;
          expected_delivery?: {
            start: number;
            end: number;
            unit: string;
          };
          requirements?: string[];
          tags?: string[];
          status?: string;
          deadline?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          client_id: string;
          agent_id: string;
          request_id?: string;
          offer_id?: string;
          title: string;
          description: string;
          amount: number;
          currency: string;
          status: string;
          payment_status: string;
          shipping_details?: any;
          tracking_number?: string;
          notes?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          agent_id: string;
          request_id?: string;
          offer_id?: string;
          title: string;
          description: string;
          amount: number;
          currency: string;
          status?: string;
          payment_status?: string;
          shipping_details?: any;
          tracking_number?: string;
          notes?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          agent_id?: string;
          request_id?: string;
          offer_id?: string;
          title?: string;
          description?: string;
          amount?: number;
          currency?: string;
          status?: string;
          payment_status?: string;
          shipping_details?: any;
          tracking_number?: string;
          notes?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          message_type: string;
          read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          sender_id: string;
          recipient_id: string;
          content: string;
          message_type?: string;
          read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          sender_id?: string;
          recipient_id?: string;
          content?: string;
          message_type?: string;
          read?: boolean;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
