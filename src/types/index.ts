// Authentication types
export type AuthStep = 'signin' | 'signup' | 'otp' | 'preferences' | 'forgot-password' | 'reset-password';

// App navigation types
export type AppTab = 'explore' | 'messages' | 'create' | 'orders' | 'profile';
export type PageType = 'order' | 'info' | 'verification' | 'security' | 'account' | 'arbitration' | 'explore';

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

// User types
export interface User {
  name: string;
  email: string;
  capabilities?: {
    canBeClient: boolean;
    canBeAgent: boolean;
  };
  nickname?: string;
  gender?: string;
  phone?: string;
  country?: string;
  bio?: string;
  avatar?: string;
  dateOfBirth?: string;
  website?: string;
  company?: string;
  jobTitle?: string;
  languages?: string[];
  preferences?: {
    categories: string[];
  };
  verificationStatus?: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    business: boolean;
    bank?: boolean;
  };
  creditCards?: CreditCard[];
  bankInformation?: BankInformation;
  transactionPasswordEnabled?: boolean;
  transactionPasswordSet?: boolean;
  biometricAuthEnabled?: boolean;
}

// Demo accounts type
export interface DemoAccount extends User {
  name: string;
  email: string;
  phone?: string;
  preferences: {
    categories: string[];
  };
  verificationStatus: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    business: boolean;
    bank?: boolean;
  };
  creditCards?: CreditCard[];
  bankInformation?: BankInformation;
  transactionPasswordEnabled?: boolean;
  transactionPasswordSet?: boolean;
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
  estimatedDelivery: string;
  specifications?: string[];
  tags?: string[];
  status: 'active' | 'sold' | 'inactive';
  createdAt: string;
  updatedAt: string;
}