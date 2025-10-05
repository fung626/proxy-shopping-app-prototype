import { COUNTRIES } from '@/config/countries';
import { useLanguage } from '@/store/LanguageContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './select';

interface CountrySelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function CountrySelect({
  value,
  onValueChange,
  placeholder = 'Select a country',
  className,
  disabled,
}: CountrySelectProps) {
  const { t } = useLanguage();
  return (
    <Select
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {COUNTRIES.map((country) => (
          <SelectItem key={country.id} value={country.id}>
            {t(country.translationKey)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
