import type { User } from '@supabase/supabase-js';

export interface SupabaseUser extends User {
  name?: string;
  nickname?: string;
  email?: string;
  country_code?: string;
  phone?: string;
  country?: string;
  bio?: string;
  avatar?: string;
  gender?: string;
  date_of_birth?: string;
  website?: string;
  company?: string;
  job_title?: string;
  languages?: string[];
  preferences?: {
    categories?: string[];
  };
  verification_status?: string;
  credit_cards?: any;
  rating: number;
  reviews: number;
  since: string;
  verified: boolean;
  image: string;
  success_rate: number;
  total_orders: number;
  completed_orders?: number;
  response_time?: string;
  transaction_password_enabled?: boolean;
  transaction_password_set?: boolean;
  biometric_enabled?: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  phone?: string;
  countryCode?: string;
  gender?: string;
  bio?: string;
  country?: string;
  languages?: string[];
  avatar?: File | null;
  agreeToTerms?: boolean;
  preferences: string[];
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  name?: string;
  nickname?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  country?: string;
  website?: string;
  company?: string;
  job_title?: string;
  languages?: string[];
  preferences?: {
    categories?: string[];
  };
}
