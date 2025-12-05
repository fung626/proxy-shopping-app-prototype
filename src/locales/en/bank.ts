// Bank Information translations - English
export const bank = {
  // Page title and description
  addBankInfo: 'Add Bank Information',
  description: 'Securely add your bank account details to receive payments',

  // Form labels
  fullName: 'Account Holder Name',
  country: 'Country',
  currency: 'Currency',
  bankName: 'Bank Name',
  accountType: 'Account Type',
  accountNumber: 'Account Number',
  routingNumber: 'Routing Number',
  swiftCode: 'SWIFT/BIC Code',
  iban: 'IBAN (Optional)',
  bankAddress: 'Bank Address',
  streetAddress: 'Street Address',
  city: 'City',
  stateProvince: 'State/Province',
  zipCode: 'ZIP/Postal Code',
  addressCountry: 'Country',

  // Account types
  checkingAccount: 'Checking Account',
  savingsAccount: 'Savings Account',

  // Placeholders
  placeholders: {
    fullName: 'Enter account holder name',
    selectCountry: 'Select country',
    selectCurrency: 'Select currency',
    bankName: 'Enter bank name',
    selectAccountType: 'Select account type',
    accountNumber: 'Enter account number',
    routingNumber: '9-digit routing number',
    swiftCode: 'Enter SWIFT/BIC code',
    iban: 'Enter IBAN',
    streetAddress: 'Enter street address',
    city: 'Enter city',
    stateProvince: 'Enter state/province',
    zipCode: 'Enter ZIP/postal code',
  },

  // Verification info
  verificationProcess: 'Verification Process',
  securityInfo: 'Your information is encrypted and secure',
  verificationTime: 'Verification takes 1-2 business days',
  paymentsInfo: 'You can receive payments once verified',

  // Actions
  save: 'Save Bank Information',
  saving: 'Saving...',

  // Errors
  errors: {
    accountHolderNameRequired: 'Account holder name is required',
    bankNameRequired: 'Bank name is required',
    accountNumberRequired: 'Account number is required',
    accountNumberMinLength: 'Account number must be at least 8 digits',
    routingNumberRequired: 'Routing number is required',
    routingNumberLength: 'Routing number must be exactly 9 digits',
    swiftCodeRequired: 'SWIFT/BIC code is required for international accounts',
    streetRequired: 'Street address is required',
    cityRequired: 'City is required',
    zipCodeRequired: 'ZIP/postal code is required',
    saveFailed: 'Failed to save bank information. Please try again.',
  },
};
