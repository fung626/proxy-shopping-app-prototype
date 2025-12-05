// Bank Information translations - Korean
export const bank = {
  // Page title and description
  addBankInfo: '은행 정보 추가',
  description: '결제를 받기 위해 은행 계좌 정보를 안전하게 추가하세요',

  // Form labels
  fullName: '예금주명',
  country: '국가',
  currency: '통화',
  bankName: '은행명',
  accountType: '계좌 유형',
  accountNumber: '계좌 번호',
  routingNumber: '라우팅 번호',
  swiftCode: 'SWIFT/BIC 코드',
  iban: 'IBAN (선택사항)',
  bankAddress: '은행 주소',
  streetAddress: '도로명 주소',
  city: '시/군/구',
  stateProvince: '시/도',
  zipCode: '우편번호',
  addressCountry: '국가',

  // Account types
  checkingAccount: '당좌예금',
  savingsAccount: '저축예금',

  // Placeholders
  placeholders: {
    fullName: '예금주명 입력',
    selectCountry: '국가 선택',
    selectCurrency: '통화 선택',
    bankName: '은행명 입력',
    selectAccountType: '계좌 유형 선택',
    accountNumber: '계좌 번호 입력',
    routingNumber: '9자리 라우팅 번호',
    swiftCode: 'SWIFT/BIC 코드 입력',
    iban: 'IBAN 입력',
    streetAddress: '도로명 주소 입력',
    city: '시/군/구 입력',
    stateProvince: '시/도 입력',
    zipCode: '우편번호 입력',
  },

  // Verification info
  verificationProcess: '인증 절차',
  securityInfo: '귀하의 정보는 암호화되어 안전합니다',
  verificationTime: '인증은 1-2 영업일이 소요됩니다',
  paymentsInfo: '인증 후 결제를 받을 수 있습니다',

  // Actions
  save: '은행 정보 저장',
  saving: '저장 중...',

  // Errors
  errors: {
    accountHolderNameRequired: '예금주명은 필수입니다',
    bankNameRequired: '은행명은 필수입니다',
    accountNumberRequired: '계좌 번호는 필수입니다',
    accountNumberMinLength: '계좌 번호는 최소 8자리여야 합니다',
    routingNumberRequired: '라우팅 번호는 필수입니다',
    routingNumberLength: '라우팅 번호는 정확히 9자리여야 합니다',
    swiftCodeRequired: '국제 계좌에는 SWIFT/BIC 코드가 필요합니다',
    streetRequired: '도로명 주소는 필수입니다',
    cityRequired: '시/군/구는 필수입니다',
    zipCodeRequired: '우편번호는 필수입니다',
    saveFailed: '은행 정보 저장에 실패했습니다. 다시 시도해주세요.',
  },
};
