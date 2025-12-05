// Bank Information translations - Japanese
export const bank = {
  // Page title and description
  addBankInfo: '銀行情報を追加',
  description: '支払いを受け取るために銀行口座の詳細を安全に追加してください',

  // Form labels
  fullName: '口座名義人',
  country: '国',
  currency: '通貨',
  bankName: '銀行名',
  accountType: '口座種別',
  accountNumber: '口座番号',
  routingNumber: 'ルーティング番号',
  swiftCode: 'SWIFT/BICコード',
  iban: 'IBAN（任意）',
  bankAddress: '銀行住所',
  streetAddress: '住所',
  city: '市区町村',
  stateProvince: '都道府県',
  zipCode: '郵便番号',
  addressCountry: '国',

  // Account types
  checkingAccount: '普通預金',
  savingsAccount: '貯蓄預金',

  // Placeholders
  placeholders: {
    fullName: '口座名義人を入力',
    selectCountry: '国を選択',
    selectCurrency: '通貨を選択',
    bankName: '銀行名を入力',
    selectAccountType: '口座種別を選択',
    accountNumber: '口座番号を入力',
    routingNumber: '9桁のルーティング番号',
    swiftCode: 'SWIFT/BICコードを入力',
    iban: 'IBANを入力',
    streetAddress: '住所を入力',
    city: '市区町村を入力',
    stateProvince: '都道府県を入力',
    zipCode: '郵便番号を入力',
  },

  // Verification info
  verificationProcess: '確認プロセス',
  securityInfo: 'あなたの情報は暗号化され安全です',
  verificationTime: '確認には1〜2営業日かかります',
  paymentsInfo: '確認後、支払いを受け取ることができます',

  // Actions
  save: '銀行情報を保存',
  saving: '保存中...',

  // Errors
  errors: {
    accountHolderNameRequired: '口座名義人は必須です',
    bankNameRequired: '銀行名は必須です',
    accountNumberRequired: '口座番号は必須です',
    accountNumberMinLength: '口座番号は8桁以上である必要があります',
    routingNumberRequired: 'ルーティング番号は必須です',
    routingNumberLength: 'ルーティング番号は正確に9桁である必要があります',
    swiftCodeRequired: '国際口座にはSWIFT/BICコードが必要です',
    streetRequired: '住所は必須です',
    cityRequired: '市区町村は必須です',
    zipCodeRequired: '郵便番号は必須です',
    saveFailed: '銀行情報の保存に失敗しました。もう一度お試しください。',
  },
};
