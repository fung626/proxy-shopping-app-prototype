import { Button } from '@/components/ui/button';
import { useLanguage } from '@/store/LanguageContext';
import { User as UserIcon } from 'lucide-react';

interface ProfileHeaderProps {
  userName?: string;
  userEmail?: string;
}

export function ProfileHeader({
  userName,
  userEmail,
}: ProfileHeaderProps) {
  return (
    <div className="p-6 mx-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <UserIcon className="h-8 w-8 text-red-600" />
          </div>
        </div>
        <div className="flex-1">
          <div className="text-xl font-semibold text-foreground mb-1">
            {userName || 'User'}
          </div>
          <div className="text-sm text-muted-foreground">
            {userEmail || 'user@example.com'}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SignInPromptProps {
  onSignIn: () => void;
}

export function SignInPrompt({ onSignIn }: SignInPromptProps) {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <UserIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {t('profile.signInPrompt')}
      </h3>
      <p className="text-muted-foreground mb-6 px-4">
        {t('profile.signInDescription')}
      </p>
      <Button onClick={() => onSignIn()} className="px-8">
        {t('profile.signIn')}
      </Button>
    </div>
  );
}
