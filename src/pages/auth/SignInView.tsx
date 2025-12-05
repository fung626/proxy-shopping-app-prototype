import { Button } from '@/components/ui/button';
import { useLanguage } from '@/store/LanguageContext';
import { MessageCircle } from 'lucide-react';
import { FC } from 'react';
import { useNavigate } from 'react-router-dom';

interface SignInViewProps {
  title: string;
  description: string;
  signInPrompt: string;
  signInDescription: string;
  signInButtonText: string;
}

const SignInView: FC<SignInViewProps> = ({
  title,
  description,
  signInPrompt,
  signInDescription,
  signInButtonText,
}) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  return (
    <div className="flex-1 bg-background pb-[74px]">
      <div className="bg-card px-4 pt-12 pb-6">
        <h1 className="text-3xl font-semibold text-foreground">
          {t(title)}
        </h1>
        <p className="text-muted-foreground mt-1">{t(description)}</p>
      </div>
      <div className="px-4 py-8">
        <div className="text-center py-12">
          <MessageCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {t(signInPrompt)}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t(signInDescription)}
          </p>
          <Button
            onClick={() => navigate('/auth/signin')}
            className="px-8"
          >
            {t(signInButtonText)}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignInView;
