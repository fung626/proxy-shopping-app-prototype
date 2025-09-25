import { useState } from "react";
import {
  ArrowLeft,
  Mail,
  Phone,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { PhoneInput } from "../../components/ui/phone-input";
import { useLanguage } from "../../store/LanguageContext";

interface ForgotPasswordFormProps {
  onBack: () => void;
  onResetComplete: (
    contact: string,
    method: "email" | "phone",
  ) => void;
}

export function ForgotPasswordForm({
  onBack,
  onResetComplete,
}: ForgotPasswordFormProps) {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+1");
  const [activeTab, setActiveTab] = useState<"email" | "phone">(
    "email",
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const contact =
        activeTab === "email"
          ? email
          : `${countryCode} ${phone}`;
      onResetComplete(contact, activeTab);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center p-4 pt-12">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold ml-4">
          {t('auth.resetPassword')}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 py-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === "email" ? (
                <Mail className="h-8 w-8 text-primary" />
              ) : (
                <Phone className="h-8 w-8 text-primary" />
              )}
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {t('auth.forgotPasswordTitle')}
            </h2>
            <p className="text-muted-foreground">
              {t('auth.resetPasswordDescription')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "email" && (
              <div>
                <Label htmlFor="email">{t('auth.emailAddress')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('auth.enterEmailAddress')}
                  required={activeTab === "email"}
                  className="mt-1"
                />
              </div>
            )}

            {activeTab === "phone" && (
              <div>
                <Label htmlFor="phone">{t('auth.phone')}</Label>
                <div className="mt-1">
                  <PhoneInput
                    phoneValue={phone}
                    countryCode={countryCode}
                    onPhoneChange={setPhone}
                    onCountryCodeChange={setCountryCode}
                    required={activeTab === "phone"}
                    variant="default"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                type="button"
                variant="link"
                onClick={() =>
                  setActiveTab(
                    activeTab === "email" ? "phone" : "email",
                  )
                }
                className="p-0 h-auto text-sm font-medium text-muted-foreground"
              >
                {activeTab === "email"
                  ? t('auth.viaPhoneNo')
                  : t('auth.viaEmail')}
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                (activeTab === "email" ? !email : !phone)
              }
            >
              {isLoading
                ? t('auth.sending')
                : t('auth.sendVerificationCode')}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}