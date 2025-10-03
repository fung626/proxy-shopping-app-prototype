import { OverlayLoading } from '@/components/OverlayLoading';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/store/LanguageContext';
import { useTheme } from '@/store/ThemeContext';
import {
  Bell,
  Check,
  CreditCard,
  FileText,
  Fingerprint,
  Globe,
  HelpCircle,
  Lock,
  LogOut,
  Moon,
  Settings,
  Shield,
  Sun,
  User as UserIcon,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function ProfileTab() {
  const { loading, user, logout, redirectToAuth } = useAuth();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [languageSheetOpen, setLanguageSheetOpen] = useState(false);

  if (!user) {
    return (
      <div className="flex-1 bg-background pb-20 relative">
        <OverlayLoading isLoading={true} />
        <div className="py-4 space-y-6">
          {/* Sign In Prompt */}
          <div className="text-center py-12">
            <UserIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {t('profile.signInPrompt')}
            </h3>
            <p className="text-muted-foreground mb-6 px-4">
              {t('profile.signInDescription')}
            </p>
            <Button onClick={() => redirectToAuth()} className="px-8">
              {t('profile.signIn')}
            </Button>
          </div>

          {/* App Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground px-4">
              {t('profile.appSettings')}
            </h3>

            <div className="space-y-1">
              <Sheet
                open={languageSheetOpen}
                onOpenChange={setLanguageSheetOpen}
              >
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-4 py-4 h-auto profile-row-button"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-5 h-5 flex items-center justify-center">
                        <Globe className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="font-normal">
                        {t('profile.translation')}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">
                        {language === 'en'
                          ? t('profile.english')
                          : language === 'zh-cn'
                          ? t('profile.simplifiedChinese')
                          : language === 'zh-tw'
                          ? t('profile.traditionalChinese')
                          : language === 'ja'
                          ? t('profile.japanese')
                          : language === 'ko'
                          ? t('profile.korean')
                          : t('profile.english')}
                      </span>
                      <svg
                        className="h-5 w-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-2xl">
                  <SheetHeader className="text-left">
                    <SheetTitle>
                      {t('profile.selectLanguage')}
                    </SheetTitle>
                    <SheetDescription>
                      {t('profile.languageDescription')}
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-between px-4 py-4 h-auto rounded-none"
                      onClick={() => {
                        setLanguage('en');
                        setLanguageSheetOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🇺🇸</span>
                        <div className="text-left">
                          <div className="font-medium">
                            {t('profile.english')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            English
                          </div>
                        </div>
                      </div>
                      {language === 'en' && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between px-4 py-4 h-auto rounded-none"
                      onClick={() => {
                        setLanguage('zh-cn');
                        setLanguageSheetOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🇨🇳</span>
                        <div className="text-left">
                          <div className="font-medium">
                            {t('profile.simplifiedChinese')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            中国大陆
                          </div>
                        </div>
                      </div>
                      {language === 'zh-cn' && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between px-4 py-4 h-auto rounded-none"
                      onClick={() => {
                        setLanguage('zh-tw');
                        setLanguageSheetOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🇹🇼</span>
                        <div className="text-left">
                          <div className="font-medium">
                            {t('profile.traditionalChinese')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            台灣
                          </div>
                        </div>
                      </div>
                      {language === 'zh-tw' && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between px-4 py-4 h-auto rounded-none"
                      onClick={() => {
                        setLanguage('ja');
                        setLanguageSheetOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🇯🇵</span>
                        <div className="text-left">
                          <div className="font-medium">
                            {t('profile.japanese')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            日本
                          </div>
                        </div>
                      </div>
                      {language === 'ja' && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      className="w-full justify-between px-4 py-4 h-auto rounded-none"
                      onClick={() => {
                        setLanguage('ko');
                        setLanguageSheetOpen(false);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">🇰🇷</span>
                        <div className="text-left">
                          <div className="font-medium">
                            {t('profile.korean')}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            대한민국
                          </div>
                        </div>
                      </div>
                      {language === 'ko' && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

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
                  onCheckedChange={setNotifications}
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

          {/* Help & Support - Available to all users */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground px-4">
              {t('profile.helpSupport')}
            </h3>

            <div className="space-y-1">
              <Button
                variant="ghost"
                className="w-full justify-between px-4 py-4 h-auto profile-row-button"
                onClick={() => navigate('/info/support')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-normal">
                    {t('profile.helpCenter')}
                  </span>
                </div>
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between px-4 py-4 h-auto profile-row-button"
                onClick={() => navigate('/info/about-us')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-normal">
                    {t('profile.aboutUs')}
                  </span>
                </div>
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between px-4 py-4 h-auto profile-row-button"
                onClick={() => navigate('/info/privacy')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-normal">
                    {t('profile.privacy')}
                  </span>
                </div>
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-between px-4 py-4 h-auto profile-row-button"
                onClick={() => navigate('/info/terms')}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <span className="font-normal">
                    {t('profile.terms')}
                  </span>
                </div>
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const verificationStatus = user.verificationStatus || {
    email: false,
    phone: false,
    identity: false,
    business: false,
  };

  const verificationCount = Object.values(verificationStatus).filter(
    Boolean
  ).length;

  return (
    <div className="flex-1 bg-background pb-20 relative">
      <OverlayLoading isLoading={loading} />
      <div className="py-4 space-y-6">
        {/* User Profile Header */}
        <div className="p-6 mx-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xl font-semibold text-foreground mb-1">
                {user.name || 'User'}
              </div>
              <div className="text-sm text-muted-foreground">
                {user.email || 'user@example.com'}
              </div>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground px-4">
            {t('profile.appSettings')}
          </h3>

          <div className="space-y-1">
            <Sheet
              open={languageSheetOpen}
              onOpenChange={setLanguageSheetOpen}
            >
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between px-4 py-4 h-auto profile-row-button"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <Globe className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="font-normal">
                      {t('profile.translation')}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">
                      {language === 'en'
                        ? t('profile.english')
                        : language === 'zh-cn'
                        ? t('profile.simplifiedChinese')
                        : language === 'zh-tw'
                        ? t('profile.traditionalChinese')
                        : language === 'ja'
                        ? t('profile.japanese')
                        : language === 'ko'
                        ? t('profile.korean')
                        : t('profile.english')}
                    </span>
                    <svg
                      className="h-5 w-5 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="rounded-t-2xl">
                <SheetHeader className="text-left">
                  <SheetTitle>
                    {t('profile.selectLanguage')}
                  </SheetTitle>
                  <SheetDescription>
                    {t('profile.languageDescription')}
                  </SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-between px-4 py-4 h-auto rounded-none"
                    onClick={() => {
                      setLanguage('en');
                      setLanguageSheetOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🇺🇸</span>
                      <div className="text-left">
                        <div className="font-medium">
                          {t('profile.english')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          English
                        </div>
                      </div>
                    </div>
                    {language === 'en' && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-between px-4 py-4 h-auto rounded-none"
                    onClick={() => {
                      setLanguage('zh-cn');
                      setLanguageSheetOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🇨🇳</span>
                      <div className="text-left">
                        <div className="font-medium">
                          {t('profile.simplifiedChinese')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          中国大陆
                        </div>
                      </div>
                    </div>
                    {language === 'zh-cn' && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-between px-4 py-4 h-auto rounded-none"
                    onClick={() => {
                      setLanguage('zh-tw');
                      setLanguageSheetOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🇹🇼</span>
                      <div className="text-left">
                        <div className="font-medium">
                          {t('profile.traditionalChinese')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          台灣
                        </div>
                      </div>
                    </div>
                    {language === 'zh-tw' && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-between px-4 py-4 h-auto rounded-none"
                    onClick={() => {
                      setLanguage('ja');
                      setLanguageSheetOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🇯🇵</span>
                      <div className="text-left">
                        <div className="font-medium">
                          {t('profile.japanese')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          日本
                        </div>
                      </div>
                    </div>
                    {language === 'ja' && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    className="w-full justify-between px-4 py-4 h-auto rounded-none"
                    onClick={() => {
                      setLanguage('ko');
                      setLanguageSheetOpen(false);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">🇰🇷</span>
                      <div className="text-left">
                        <div className="font-medium">
                          {t('profile.korean')}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          대한민국
                        </div>
                      </div>
                    </div>
                    {language === 'ko' && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                  </Button>
                </div>
              </SheetContent>
            </Sheet>

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
                onCheckedChange={setNotifications}
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

        {/* Account Settings */}
        <div className="space-y-4">
          <div className="px-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-semibold text-foreground">
                {t('profile.account')}
              </h3>
              <Badge
                variant={
                  verificationCount >= 2 ? 'default' : 'secondary'
                }
              >
                {verificationCount}/4{' '}
                {t('profile.verified').toLowerCase()}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {t('profile.accountDescription')}
            </p>
          </div>

          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/profile/edit-account')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-normal">
                  {t('profile.editProfile')}
                </span>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>

            {/* Email Verification */}
            <Button
              variant="ghost"
              className="w-full px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/profile/email-verification')}
            >
              <div className="grid grid-cols-[1fr_80px] gap-2 w-full items-center">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        verificationStatus.email
                          ? 'bg-green-500'
                          : 'bg-muted-foreground'
                      }`}
                    >
                      {verificationStatus.email ? (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-normal truncate">
                      {t('profile.emailVerification')}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight">
                      {verificationStatus.email
                        ? t('profile.emailVerificationDesc')
                        : t('profile.emailVerificationDescPending')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-1">
                  <div className="text-right">
                    {verificationStatus.email ? (
                      <Badge
                        variant="default"
                        className="text-xs whitespace-nowrap"
                      >
                        {t('profile.verified')}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-xs whitespace-nowrap"
                      >
                        {t('profile.pending')}
                      </Badge>
                    )}
                  </div>
                  <svg
                    className="h-4 w-4 text-muted-foreground flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Button>

            {/* Phone Verification */}
            <Button
              variant="ghost"
              className="w-full px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/profile/phone-verification')}
            >
              <div className="grid grid-cols-[1fr_80px] gap-2 w-full items-center">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        verificationStatus.phone
                          ? 'bg-green-500'
                          : 'bg-muted-foreground'
                      }`}
                    >
                      {verificationStatus.phone ? (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-normal truncate">
                      {t('profile.phoneVerification')}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight">
                      {verificationStatus.phone
                        ? t('profile.phoneVerificationDesc')
                        : t('profile.phoneVerificationDescPending')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-1">
                  <div className="text-right">
                    {verificationStatus.phone ? (
                      <Badge
                        variant="default"
                        className="text-xs whitespace-nowrap"
                      >
                        {t('profile.verified')}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-xs whitespace-nowrap"
                      >
                        {t('profile.pending')}
                      </Badge>
                    )}
                  </div>
                  <svg
                    className="h-4 w-4 text-muted-foreground flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Button>

            {/* Identity Verification */}
            <Button
              variant="ghost"
              className="w-full px-4 py-4 h-auto profile-row-button"
              onClick={() =>
                navigate('/profile/identity-verification')
              }
            >
              <div className="grid grid-cols-[1fr_80px] gap-2 w-full items-center">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        verificationStatus.identity
                          ? 'bg-green-500'
                          : 'bg-muted-foreground'
                      }`}
                    >
                      {verificationStatus.identity ? (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-normal truncate">
                      {t('profile.identityVerification')}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight">
                      {verificationStatus.identity
                        ? t('profile.identityVerificationDesc')
                        : t(
                            'profile.identityVerificationDescPending'
                          )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-1">
                  <div className="text-right">
                    {verificationStatus.identity ? (
                      <Badge
                        variant="default"
                        className="text-xs whitespace-nowrap"
                      >
                        {t('profile.verified')}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-xs whitespace-nowrap"
                      >
                        {t('profile.pending')}
                      </Badge>
                    )}
                  </div>
                  <svg
                    className="h-4 w-4 text-muted-foreground flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Button>

            {/* Business Verification */}
            <Button
              variant="ghost"
              className="w-full px-4 py-4 h-auto profile-row-button"
              onClick={() =>
                navigate('/profile/business-verification')
              }
            >
              <div className="grid grid-cols-[1fr_80px] gap-2 w-full items-center">
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                    <div
                      className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        verificationStatus.business
                          ? 'bg-green-500'
                          : 'bg-muted-foreground'
                      }`}
                    >
                      {verificationStatus.business ? (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-2 h-2 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-normal truncate">
                      {t('profile.businessVerification')}
                    </div>
                    <div className="text-xs text-muted-foreground leading-tight">
                      {verificationStatus.business
                        ? t('profile.businessVerificationDesc')
                        : t(
                            'profile.businessVerificationDescPending'
                          )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end space-x-1">
                  <div className="text-right">
                    {verificationStatus.business ? (
                      <Badge
                        variant="default"
                        className="text-xs whitespace-nowrap"
                      >
                        {t('profile.verified')}
                      </Badge>
                    ) : (
                      <Badge
                        variant="secondary"
                        className="text-xs whitespace-nowrap"
                      >
                        {t('profile.pending')}
                      </Badge>
                    )}
                  </div>
                  <svg
                    className="h-4 w-4 text-muted-foreground flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </Button>
          </div>
        </div>

        {/* Payment Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground px-4">
            {t('profile.paymentSettings')}
          </h3>

          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/profile/bank-information')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg
                    className="h-5 w-5 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
                <span className="font-normal">
                  {t('profile.bankInformation')}
                </span>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/profile/credit-cards')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-normal">
                  {t('profile.creditCards')}
                </span>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() =>
                navigate('/profile/transaction-password')
              }
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-normal">
                    {t('profile.transactionPassword')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.transactionPasswordEnabled
                      ? t('profile.transactionPasswordEnabled')
                      : t('profile.transactionPasswordDisabled')}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user?.transactionPasswordEnabled && (
                  <Badge variant="default" className="text-xs">
                    {t('profile.enabled')}
                  </Badge>
                )}
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/profile/biometric-auth')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <Fingerprint className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 text-left">
                  <div className="font-normal">
                    {t('profile.biometricAuth')}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {user?.biometricAuthEnabled
                      ? t('profile.biometricAuthEnabled')
                      : t('profile.biometricAuthDisabled')}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {user?.biometricAuthEnabled && (
                  <Badge variant="default" className="text-xs">
                    {t('profile.enabled')}
                  </Badge>
                )}
                <svg
                  className="h-5 w-5 text-muted-foreground"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Button>
          </div>
        </div>

        {/* Security Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground px-4">
            {t('profile.securitySettings')}
          </h3>

          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/profile/change-password')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-normal">
                  {t('profile.changePassword')}
                </span>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/profile/two-factor-auth')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-normal">
                  {t('profile.twoFactor')}
                </span>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Help & Support */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground px-4">
            {t('profile.helpSupport')}
          </h3>

          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/info/support')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-normal">
                  {t('profile.helpCenter')}
                </span>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/info/about-us')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-normal">
                  {t('profile.aboutUs')}
                </span>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/info/privacy')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-normal">
                  {t('profile.privacy')}
                </span>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-between px-4 py-4 h-auto profile-row-button"
              onClick={() => navigate('/info/terms')}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <span className="font-normal">
                  {t('profile.terms')}
                </span>
              </div>
              <svg
                className="h-5 w-5 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Button>
          </div>
        </div>

        {/* Sign Out */}
        <div className="space-y-4">
          <div className="space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-4 h-auto profile-row-button text-red-600 hover:bg-red-50"
              onClick={logout}
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 flex items-center justify-center">
                  <LogOut className="h-5 w-5 text-red-600" />
                </div>
                <span className="font-normal">
                  {t('profile.signOut')}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
