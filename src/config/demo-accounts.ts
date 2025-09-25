import { DemoAccount, CreditCard } from '../types';

// Demo accounts for testing different verification states
export const DEMO_ACCOUNTS: Record<string, DemoAccount> = {
  'e1@gmail.com': {
    name: 'Allison Gonzalez',
    email: 'e1@gmail.com',
    capabilities: { canBeClient: true, canBeAgent: true },
    bio: 'Technology enthusiast and business professional specializing in office equipment procurement.',
    country: 'United States',
    preferences: { categories: ['Electronics', 'Office Supplies'] },
    verificationStatus: {
      email: true,
      phone: false,
      identity: false,
      business: false
    },
    creditCards: [
      {
        id: 'card_1',
        cardNumber: '4532 1234 5678 9012',
        expiryMonth: '12',
        expiryYear: '2028',
        cardholderName: 'Allison Gonzalez',
        cardType: 'visa',
        isDefault: true,
        nickname: 'Main Card'
      },
      {
        id: 'card_2',
        cardNumber: '5555 4444 3333 1111',
        expiryMonth: '06',
        expiryYear: '2027',
        cardholderName: 'Allison Gonzalez',
        cardType: 'mastercard',
        isDefault: false,
        nickname: 'Business Card'
      }
    ]
  },
  'e2@gmail.com': {
    name: "Ethan O'Neill",
    email: 'e2@gmail.com',
    capabilities: { canBeClient: true, canBeAgent: true },
    phone: '852 98776542',
    bio: 'Construction project manager with 10+ years experience in sourcing industrial materials.',
    country: 'Hong Kong',
    preferences: { categories: ['Construction', 'Industrial'] },
    verificationStatus: {
      email: true,
      phone: true,
      identity: false,
      business: false
    },
    creditCards: [
      {
        id: 'card_3',
        cardNumber: '3782 822463 10005',
        expiryMonth: '09',
        expiryYear: '2026',
        cardholderName: "Ethan O'Neill",
        cardType: 'amex',
        isDefault: true
      }
    ]
  },
  'e3@gmail.com': {
    name: 'Kenna Dejesus',
    email: 'e3@gmail.com',
    capabilities: { canBeClient: true, canBeAgent: true },
    phone: '852 68777542',
    bio: 'Healthcare procurement specialist focused on medical devices and technology solutions.',
    country: 'Singapore',
    preferences: { categories: ['Healthcare', 'Technology'] },
    verificationStatus: {
      email: true,
      phone: true,
      identity: true,
      business: false
    },
    creditCards: [
      {
        id: 'card_4',
        cardNumber: '4111 1111 1111 1111',
        expiryMonth: '03',
        expiryYear: '2029',
        cardholderName: 'Kenna Dejesus',
        cardType: 'visa',
        isDefault: true,
        nickname: 'Personal Visa'
      },
      {
        id: 'card_5',
        cardNumber: '6011 1111 1111 1117',
        expiryMonth: '11',
        expiryYear: '2025',
        cardholderName: 'Kenna Dejesus',
        cardType: 'discover',
        isDefault: false,
        nickname: 'Discover Card'
      }
    ]
  },
  'e4@gmail.com': {
    name: 'Rio Mays',
    email: 'e4@gmail.com',
    capabilities: { canBeClient: true, canBeAgent: true },
    phone: '852 38777542',
    bio: 'Senior logistics coordinator with expertise in global supply chain management and manufacturing.',
    country: 'Japan',
    preferences: { categories: ['Manufacturing', 'Logistics'] },
    verificationStatus: {
      email: true,
      phone: true,
      identity: true,
      business: true
    },
    creditCards: [
      {
        id: 'card_6',
        cardNumber: '5105 1051 0510 5100',
        expiryMonth: '08',
        expiryYear: '2027',
        cardholderName: 'Rio Mays',
        cardType: 'mastercard',
        isDefault: true,
        nickname: 'Work MasterCard'
      }
    ]
  }
};