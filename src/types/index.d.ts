// Authentication types
export type AuthStep =
  | 'signin'
  | 'signup'
  | 'otp'
  | 'preferences'
  | 'forgot-password'
  | 'reset-password';

// App navigation types (moved to types/routing.ts for better organization)
export type AppTab =
  | 'explore'
  | 'messages'
  | 'create'
  | 'orders'
  | 'profile';
export type PageType =
  | 'order'
  | 'info'
  | 'verification'
  | 'security'
  | 'account'
  | 'arbitration'
  | 'explore';

// Re-export routing types for backward compatibility
export type {
  NavigationState,
  PageProps,
  RouteConfig,
  RouteGroup,
  RouteParams,
} from './routing';

// Credit Card types
export interface CreditCard {
  id: string;
  cardNumber: string;
  expiryDate?: string;
  expiryMonth: string;
  expiryYear: string;
  cardholderName: string;
  cardType: 'visa' | 'mastercard' | 'amex' | 'discover' | 'other';
  isDefault: boolean;
  nickname?: string;
}

// Bank Information types
export interface BankInformation {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  routingNumber: string;
  accountType: 'checking' | 'savings';
  country: string;
}

// Authentication form types
export interface SignInCredentials {
  email: string;
  password: string;
  loginType: 'email' | 'phone';
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  nickname: string;
  phone: string;
  email: string;
  gender: string;
  bio: string;
  country: string;
  password: string;
  confirmPassword: string;
  profilePicture?: string;
  languages?: string[];
  agreeToTerms: boolean;
}

export interface UserPreferences {
  categories: string[];
}

// Shopping Offer types
export interface ShoppingOffer {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  currency: string;
  images?: string[];
  agentId: string;
  agentName: string;
  agentRating: number;
  agentReviews: number;
  location: string;
  shoppingLocation: string;
  deliveryOptions: ('pickup' | 'ship')[];
  availableQuantity: number;
  estimatedDelivery: {
    start: number;
    end: number;
    unit: 'days' | 'weeks' | 'months';
  };
  specifications?: string[];
  tags?: string[];
  status: 'active' | 'sold' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Shopping Request types
export interface ShoppingRequest {
  id: string;
  userId: string;
  userName: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
  };
  currency: string;
  images?: string[];
  targetLocation: string;
  preferredShoppingLocation: string;
  quantity: number;
  urgency: 'low' | 'medium' | 'high';
  expectedDelivery: {
    start: number;
    end: number;
    unit: 'days' | 'weeks' | 'months';
  };
  requirements?: string[];
  tags?: string[];
  status:
    | 'active'
    | 'offers_received'
    | 'accepted'
    | 'completed'
    | 'cancelled';
  createdAt: string;
  updatedAt: string;
  deadline?: string;
}
