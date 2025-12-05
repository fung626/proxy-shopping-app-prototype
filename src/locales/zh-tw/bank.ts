// Bank Information translations - Traditional Chinese
export const bank = {
  // Page title and description
  addBankInfo: '新增銀行資訊',
  description: '安全地新增您的銀行帳戶詳細資訊以接收付款',

  // Form labels
  fullName: '帳戶持有人姓名',
  country: '國家',
  currency: '貨幣',
  bankName: '銀行名稱',
  accountType: '帳戶類型',
  accountNumber: '帳號',
  routingNumber: '路由號碼',
  swiftCode: 'SWIFT/BIC代碼',
  iban: 'IBAN（選填）',
  bankAddress: '銀行地址',
  streetAddress: '街道地址',
  city: '城市',
  stateProvince: '省/州',
  zipCode: '郵遞區號',
  addressCountry: '國家',

  // Account types
  checkingAccount: '支票帳戶',
  savingsAccount: '儲蓄帳戶',

  // Placeholders
  placeholders: {
    fullName: '輸入帳戶持有人姓名',
    selectCountry: '選擇國家',
    selectCurrency: '選擇貨幣',
    bankName: '輸入銀行名稱',
    selectAccountType: '選擇帳戶類型',
    accountNumber: '輸入帳號',
    routingNumber: '9位路由號碼',
    swiftCode: '輸入SWIFT/BIC代碼',
    iban: '輸入IBAN',
    streetAddress: '輸入街道地址',
    city: '輸入城市',
    stateProvince: '輸入省/州',
    zipCode: '輸入郵遞區號',
  },

  // Verification info
  verificationProcess: '驗證流程',
  securityInfo: '您的資訊已加密且安全',
  verificationTime: '驗證需要1-2個工作日',
  paymentsInfo: '驗證後即可接收付款',

  // Actions
  save: '儲存銀行資訊',
  saving: '儲存中...',

  // Errors
  errors: {
    accountHolderNameRequired: '帳戶持有人姓名為必填項',
    bankNameRequired: '銀行名稱為必填項',
    accountNumberRequired: '帳號為必填項',
    accountNumberMinLength: '帳號必須至少8位數字',
    routingNumberRequired: '路由號碼為必填項',
    routingNumberLength: '路由號碼必須正好9位數字',
    swiftCodeRequired: '國際帳戶需要SWIFT/BIC代碼',
    streetRequired: '街道地址為必填項',
    cityRequired: '城市為必填項',
    zipCodeRequired: '郵遞區號為必填項',
    saveFailed: '儲存銀行資訊失敗。請重試。',
  },
};
