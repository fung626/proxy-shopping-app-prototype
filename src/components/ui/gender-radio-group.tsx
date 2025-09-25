import { RadioGroup, RadioGroupItem } from './radio-group';
import { Label } from './label';
import { useLanguage } from '../../store/LanguageContext';

interface GenderRadioGroupProps {
  value: string;
  onValueChange: (value: string) => void;
  variant?: 'default' | 'compact';
  className?: string;
}

export function GenderRadioGroup({ 
  value, 
  onValueChange, 
  variant = 'default',
  className = '' 
}: GenderRadioGroupProps) {
  const { t } = useLanguage();

  const genderOptions = [
    { value: 'male', labelKey: 'auth.male' },
    { value: 'female', labelKey: 'auth.female' },
    { value: 'other', labelKey: 'auth.other' },
    { value: 'prefer-not-to-say', labelKey: 'auth.preferNotToSay' }
  ];

  const containerClassName = variant === 'compact' ? 'flex space-x-6' : 'grid grid-cols-2 gap-3';
  const labelClassName = variant === 'compact' ? '' : 'text-sm font-normal cursor-pointer';

  return (
    <RadioGroup 
      value={value} 
      onValueChange={onValueChange}
      className={`${containerClassName} ${className}`}
    >
      {genderOptions.map((option) => (
        <div key={option.value} className="flex items-center space-x-2">
          <RadioGroupItem value={option.value} id={option.value} />
          <Label 
            htmlFor={option.value} 
            className={labelClassName}
          >
            {t(option.labelKey)}
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}