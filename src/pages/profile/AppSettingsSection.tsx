import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/store/LanguageContext';
import { useTheme } from '@/store/ThemeContext';
import { Bell, Moon, Sun } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

interface AppSettingsSectionProps {
  notifications: boolean;
  onNotificationsChange: (value: boolean) => void;
}

export function AppSettingsSection({
  notifications,
  onNotificationsChange,
}: AppSettingsSectionProps) {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground px-4">
        {t('profile.appSettings')}
      </h3>

      <div className="space-y-1">
        <LanguageSelector />

        <div className="flex justify-between items-center px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              <Bell className="h-5 w-5 text-muted-foreground" />
            </div>
            <span className="font-normal">
              {t('profile.notifications')}
            </span>
          </div>
          <Switch
            checked={notifications}
            onCheckedChange={onNotificationsChange}
          />
        </div>

        <div className="flex justify-between items-center px-4 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-5 h-5 flex items-center justify-center">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <span className="font-normal">
              {t('profile.darkMode')}
            </span>
          </div>
          <Switch
            checked={theme === 'dark'}
            onCheckedChange={toggleTheme}
          />
        </div>
      </div>
    </div>
  );
}
