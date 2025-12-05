// Bank Information translations - Chinese Simplified
export const bank = {
  // Page title and description
  addBankInfo: '添加银行信息',
  description: '安全地添加您的银行账户详细信息以接收付款',

  // Form labels
  fullName: '账户持有人姓名',
  country: '国家',
  currency: '货币',
  bankName: '银行名称',
  accountType: '账户类型',
  accountNumber: '账号',
  routingNumber: '路由号码',
  swiftCode: 'SWIFT/BIC代码',
  iban: 'IBAN（可选）',
  bankAddress: '银行地址',
  streetAddress: '街道地址',
  city: '城市',
  stateProvince: '省/州',
  zipCode: '邮政编码',
  addressCountry: '国家',

  // Account types
  checkingAccount: '支票账户',
  savingsAccount: '储蓄账户',

  // Placeholders
  placeholders: {
    fullName: '输入账户持有人姓名',
    selectCountry: '选择国家',
    selectCurrency: '选择货币',
    bankName: '输入银行名称',
    selectAccountType: '选择账户类型',
    accountNumber: '输入账号',
    routingNumber: '9位路由号码',
    swiftCode: '输入SWIFT/BIC代码',
    iban: '输入IBAN',
    streetAddress: '输入街道地址',
    city: '输入城市',
    stateProvince: '输入省/州',
    zipCode: '输入邮政编码',
  },

  // Verification info
  verificationProcess: '验证流程',
  securityInfo: '您的信息已加密且安全',
  verificationTime: '验证需要1-2个工作日',
  paymentsInfo: '验证后即可接收付款',

  // Actions
  save: '保存银行信息',
  saving: '保存中...',

  // Errors
  errors: {
    accountHolderNameRequired: '账户持有人姓名为必填项',
    bankNameRequired: '银行名称为必填项',
    accountNumberRequired: '账号为必填项',
    accountNumberMinLength: '账号必须至少8位数字',
    routingNumberRequired: '路由号码为必填项',
    routingNumberLength: '路由号码必须正好9位数字',
    swiftCodeRequired: '国际账户需要SWIFT/BIC代码',
    streetRequired: '街道地址为必填项',
    cityRequired: '城市为必填项',
    zipCodeRequired: '邮政编码为必填项',
    saveFailed: '保存银行信息失败。请重试。',
  },
};
