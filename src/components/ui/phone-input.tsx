import React from 'react';
import { Input, AuthInput } from './input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';

export interface PhoneInputProps {
  phoneValue: string;
  countryCode: string;
  onPhoneChange: (value: string) => void;
  onCountryCodeChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  variant?: 'default' | 'auth';
  className?: string;
  id?: string;
}

// Common country codes
const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸🇨🇦' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+55', country: 'BR', flag: '🇧🇷' },
  { code: '+52', country: 'MX', flag: '🇲🇽' },
];

export function PhoneInput({
  phoneValue,
  countryCode,
  onPhoneChange,
  onCountryCodeChange,
  placeholder = '(555) 123-4567',
  required = false,
  disabled = false,
  variant = 'default',
  className,
  id = 'phone',
}: PhoneInputProps) {
  const InputComponent = variant === 'auth' ? AuthInput : Input;
  
  // Height and styling based on variant
  const selectHeight = variant === 'auth' ? '!h-12' : '!h-11';
  const selectBg = variant === 'auth' ? 'bg-muted/20' : 'bg-input-background';
  const selectBorder = variant === 'auth' ? 'border-muted' : 'border-input';

  return (
    <div className={`flex space-x-2 ${className || ''}`}>
      <Select value={countryCode} onValueChange={onCountryCodeChange} disabled={disabled}>
        <SelectTrigger className={`w-20 ${selectHeight} ${selectBg} ${selectBorder}`}>
          <SelectValue>
            <span className="text-sm">{countryCode}</span>
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {COUNTRY_CODES.map((country, index) => (
            <SelectItem key={index} value={country.code}>
              <div className="flex items-center space-x-2">
                <span>{country.flag}</span>
                <span>{country.code}</span>
                <span className="text-xs text-muted-foreground">{country.country}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <InputComponent
        id={id}
        type="tel"
        value={phoneValue}
        onChange={(e) => onPhoneChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className="flex-1"
      />
    </div>
  );
}