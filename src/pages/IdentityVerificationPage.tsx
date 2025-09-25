import { useState } from 'react';
import { ArrowLeft, Upload, Camera, FileText, Shield, CheckCircle, IdCard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../store/LanguageContext';

interface IdentityVerificationPageProps {
  onBack: () => void;
  onComplete: () => void;
}

export function IdentityVerificationPage({ onBack, onComplete }: IdentityVerificationPageProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [documentType, setDocumentType] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    documentNumber: '',
    expiryDate: '',
    issuingCountry: ''
  });

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onBack();
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const documentTypes = [
    { id: 'passport', name: t('document.passport'), description: t('document.passportDescription') },
    { id: 'drivers-license', name: t('document.driversLicense'), description: t('document.driversLicenseDescription') },
    { id: 'national-id', name: t('document.nationalId'), description: t('document.nationalIdDescription') },
    { id: 'military-id', name: t('document.militaryId'), description: t('document.militaryIdDescription') }
  ];

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <IdCard className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">{t('identityVerification.title')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('identityVerification.description')}
              </p>
            </div>

            <div className="space-y-3">
              {documentTypes.map((doc) => (
                <Card 
                  key={doc.id} 
                  className={`p-4 cursor-pointer transition-all ${
                    documentType === doc.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => setDocumentType(doc.id)}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      documentType === doc.id 
                        ? 'border-primary bg-primary' 
                        : 'border-muted-foreground'
                    }`}>
                      {documentType === doc.id && (
                        <div className="w-full h-full rounded-full bg-white scale-50"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{doc.name}</h3>
                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Security Note */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div className="text-xs">
                  <div className="font-medium text-blue-900 mb-1">{t('security.dataSecure')}</div>
                  <ul className="text-blue-700 space-y-0.5">
                    <li>• {t('security.encrypted')}</li>
                    <li>• {t('security.noStorage')}</li>
                    <li>• {t('security.essentialOnly')}</li>
                    <li>• {t('security.deleteAnytime')}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">{t('document.information')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('document.enterInformation', { 
                  document: documentTypes.find(d => d.id === documentType)?.name?.toLowerCase() || t('document.document')
                })}
              </p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">{t('form.firstName')} *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateFormData('firstName', e.target.value)}
                    placeholder={t('form.firstNamePlaceholder')}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">{t('form.lastName')} *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateFormData('lastName', e.target.value)}
                    placeholder={t('form.lastNamePlaceholder')}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dateOfBirth">{t('form.dateOfBirth')} *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateFormData('dateOfBirth', e.target.value)}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="documentNumber">{t('document.number')} *</Label>
                <Input
                  id="documentNumber"
                  value={formData.documentNumber}
                  onChange={(e) => updateFormData('documentNumber', e.target.value)}
                  placeholder={t('document.numberPlaceholder')}
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiryDate">{t('document.expiryDate')} *</Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => updateFormData('expiryDate', e.target.value)}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="issuingCountry">{t('document.issuingCountry')} *</Label>
                  <select
                    id="issuingCountry"
                    value={formData.issuingCountry}
                    onChange={(e) => updateFormData('issuingCountry', e.target.value)}
                    className="mt-1 w-full p-2 border border-border rounded-md bg-input-background"
                    required
                  >
                    <option value="">{t('form.selectCountry')}</option>
                    <option value="US">{t('country.us')}</option>
                    <option value="CA">{t('country.canada')}</option>
                    <option value="GB">{t('country.uk')}</option>
                    <option value="AU">{t('country.australia')}</option>
                    <option value="DE">{t('country.germany')}</option>
                    <option value="FR">{t('country.france')}</option>
                    <option value="JP">{t('country.japan')}</option>
                    <option value="CN">{t('country.china')}</option>
                    <option value="other">{t('country.other')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Camera className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold text-foreground mb-3">{t('document.uploadPhotos')}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {t('document.uploadDescription', { 
                  document: documentTypes.find(d => d.id === documentType)?.name?.toLowerCase() || t('document.document')
                })}
              </p>
            </div>

            {/* Photo Guidelines */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <h4 className="font-medium text-foreground mb-2">{t('identityVerification.guidelines')}</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• {t('identityVerification.guideline1')}</li>
                <li>• {t('document.goodLighting')}</li>
                <li>• {t('identityVerification.guideline2')}</li>
                <li>• {t('identityVerification.guideline3')}</li>
                <li>• {t('document.darkBackground')}</li>
              </ul>
            </div>

            {/* Document Upload Areas */}
            <div className="space-y-4">
              <div>
                <Label>{t('document.frontSide')} *</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('document.frontSideDescription')}
                  </p>
                  <div className="flex space-x-2 justify-center">
                    <Button type="button" variant="outline" size="sm">
                      <Camera className="h-4 w-4 mr-2" />
                      {t('common.takePhoto')}
                    </Button>
                    <Button type="button" variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      {t('common.uploadFile')}
                    </Button>
                  </div>
                </div>
              </div>

              {documentType !== 'passport' && (
                <div>
                  <Label>{t('document.backSide')} *</Label>
                  <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Camera className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground mb-2">
                      {t('document.backSideDescription')}
                    </p>
                    <div className="flex space-x-2 justify-center">
                      <Button type="button" variant="outline" size="sm">
                        <Camera className="h-4 w-4 mr-2" />
                        {t('common.takePhoto')}
                      </Button>
                      <Button type="button" variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('common.uploadFile')}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Verification Benefits */}
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-medium text-blue-900 mb-3 flex items-center">
                <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
                {t('identityVerification.benefits')}
              </h3>
              <ul className="space-y-2 text-sm text-blue-700">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-blue-500" />
                  <span>{t('identityVerification.benefit3')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-blue-500" />
                  <span>{t('verification.verifiedSuppliers')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-blue-500" />
                  <span>{t('verification.fasterDispute')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-blue-500" />
                  <span>{t('identityVerification.benefit1')}</span>
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return documentType !== '';
      case 2:
        return formData.firstName && formData.lastName && formData.dateOfBirth && 
               formData.documentNumber && formData.expiryDate && formData.issuingCountry;
      case 3:
        return true; // For demo purposes
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="px-4 py-4 safe-area-inset-top">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={handleBack} className="mr-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">{t('identityVerification.title')}</h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-4 pb-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{t('common.step')} {step} {t('common.of')} {totalSteps}</span>
          <Badge variant="secondary">{Math.round((step / totalSteps) * 100)}% {t('common.complete')}</Badge>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-24">
        <div className="max-w-md mx-auto pt-6">
          {renderStepContent()}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t safe-area-inset-bottom">
        <div className="max-w-md mx-auto flex space-x-3">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex-1"
          >
{step === 1 ? t('common.cancel') : t('common.back')}
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1"
          >
{step === totalSteps ? t('identityVerification.submit') : t('common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
}