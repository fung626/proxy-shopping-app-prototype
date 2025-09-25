import { useState } from 'react';
import { SignInForm } from '../pages/auth/SignInForm';
import { SignUpForm } from '../pages/auth/SignUpForm';
import { OTPVerification } from '../pages/auth/OTPVerification';
import { PreferencesSetup } from '../pages/auth/PreferencesSetup';
import { ForgotPasswordForm } from '../pages/auth/ForgotPasswordForm';
import { ResetPasswordForm } from '../pages/auth/ResetPasswordForm';
import { AuthStep, SignInCredentials, SignUpData, UserPreferences } from '../types';
import { DEMO_ACCOUNTS } from '../config/demo-accounts';

interface AuthManagerProps {
  onAuthSuccess: (user: any) => void;
  onClose: () => void;
  onNavigateToTermsOfService: () => void;
}

export function AuthManager({ onAuthSuccess, onClose, onNavigateToTermsOfService }: AuthManagerProps) {
  const [authStep, setAuthStep] = useState<AuthStep>('signin');
  const [tempUserData, setTempUserData] = useState<any>(null);
  const [resetContact, setResetContact] = useState('');
  const [resetMethod, setResetMethod] = useState<'email' | 'phone'>('email');

  const handleSignIn = (credentials: SignInCredentials) => {
    const demoAccount = DEMO_ACCOUNTS[credentials.email];
    if (demoAccount) {
      onAuthSuccess(demoAccount);
      return;
    }
    
    setTempUserData(credentials);
    setAuthStep('otp');
  };

  const handleSignUp = (data: SignUpData) => {
    setTempUserData(data);
    setAuthStep('otp');
  };

  const handleOTPVerify = () => {
    if (tempUserData?.firstName) {
      setAuthStep('preferences');
    } else {
      onAuthSuccess({
        name: 'John Smith',
        email: tempUserData?.email || 'john@example.com'
      });
    }
  };

  const handlePreferencesComplete = (preferences: UserPreferences) => {
    onAuthSuccess({
      name: `${tempUserData?.firstName} ${tempUserData?.lastName}` || 'New User',
      email: tempUserData?.email || 'user@example.com',
      phone: tempUserData?.phone || '',
      nickname: tempUserData?.nickname || '',
      gender: tempUserData?.gender || '',
      bio: tempUserData?.bio || '',
      location: tempUserData?.location || '',
      preferences
    });
  };

  const handleAuthBack = () => {
    if (authStep === 'otp') {
      setAuthStep('signin');
    } else if (authStep === 'preferences') {
      setAuthStep('otp');
    } else if (authStep === 'forgot-password') {
      setAuthStep('signin');
    } else if (authStep === 'reset-password') {
      setAuthStep('forgot-password');
    } else {
      onClose();
    }
  };

  const handleResetComplete = (contact: string, method: 'email' | 'phone') => {
    setResetContact(contact);
    setResetMethod(method);
    setAuthStep('reset-password');
  };

  switch (authStep) {
    case 'signin':
      return (
        <SignInForm 
          onSignIn={handleSignIn}
          onSwitchToSignUp={() => setAuthStep('signup')}
          onForgotPassword={() => setAuthStep('forgot-password')}
          onBack={handleAuthBack}
        />
      );
    case 'signup':
      return (
        <SignUpForm 
          onSignUp={handleSignUp}
          onSwitchToSignIn={() => setAuthStep('signin')}
          onNavigateToTerms={onNavigateToTermsOfService}
        />
      );
    case 'otp':
      return (
        <OTPVerification 
          email={tempUserData?.email || ''}
          loginType={tempUserData?.loginType || 'email'}
          onVerify={handleOTPVerify}
          onBack={handleAuthBack}
          isSignUp={!!tempUserData?.firstName}
        />
      );
    case 'preferences':
      return (
        <PreferencesSetup 
          onComplete={handlePreferencesComplete}
          onBack={handleAuthBack}
        />
      );
    case 'forgot-password':
      return (
        <ForgotPasswordForm 
          onBack={handleAuthBack}
          onResetComplete={handleResetComplete}
        />
      );
    case 'reset-password':
      return (
        <ResetPasswordForm 
          onBack={handleAuthBack}
          onResetSuccess={() => setAuthStep('signin')}
          contact={resetContact}
          method={resetMethod}
        />
      );
    default:
      return (
        <SignInForm 
          onSignIn={handleSignIn}
          onSwitchToSignUp={() => setAuthStep('signup')}
          onForgotPassword={() => setAuthStep('forgot-password')}
          onBack={handleAuthBack}
        />
      );
  }
}