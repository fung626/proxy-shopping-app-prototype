import { useState } from 'react';
import { ArrowLeft, Upload, Building, FileText, Shield, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../store/LanguageContext';

interface BusinessVerificationPageProps {
  onBack: () => void;
  onComplete: () => void;
}

export function BusinessVerificationPage({ onBack, onComplete }: BusinessVerificationPageProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    registrationNumber: '',
    taxId: '',
    address: '',
    description: '',
    website: '',
    employees: ''
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

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">{t('businessVerification.businessInformation')}</h2>
              <p className="text-muted-foreground">{t('businessVerification.tellUsAboutBusiness')}</p>
            </div>

            <div>
              <Label htmlFor="businessName">{t('businessVerification.businessName')} *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => updateFormData('businessName', e.target.value)}
                placeholder={t('businessVerification.enterBusinessName')}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="businessType">{t('businessVerification.businessType')} *</Label>
              <select
                id="businessType"
                value={formData.businessType}
                onChange={(e) => updateFormData('businessType', e.target.value)}
                className="mt-1 w-full p-2 border border-border rounded-md bg-input-background"
                required
              >
                <option value="">{t('businessVerification.selectBusinessType')}</option>
                <option value="corporation">{t('businessVerification.corporation')}</option>
                <option value="llc">{t('businessVerification.llc')}</option>
                <option value="partnership">{t('businessVerification.partnership')}</option>
                <option value="sole-proprietorship">{t('businessVerification.soleProprietorship')}</option>
                <option value="non-profit">{t('businessVerification.nonProfit')}</option>
              </select>
            </div>

            <div>
              <Label htmlFor="employees">{t('businessVerification.numberOfEmployees')}</Label>
              <select
                id="employees"
                value={formData.employees}
                onChange={(e) => updateFormData('employees', e.target.value)}
                className="mt-1 w-full p-2 border border-border rounded-md bg-input-background"
              >
                <option value="">{t('businessVerification.selectRange')}</option>
                <option value="1-10">{t('businessVerification.employees1to10')}</option>
                <option value="11-50">{t('businessVerification.employees11to50')}</option>
                <option value="51-200">{t('businessVerification.employees51to200')}</option>
                <option value="201-1000">{t('businessVerification.employees201to1000')}</option>
                <option value="1000+">{t('businessVerification.employees1000Plus')}</option>
              </select>
            </div>

            <div>
              <Label htmlFor="description">{t('businessVerification.businessDescription')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder={t('businessVerification.describeBusinessIndustry')}
                className="mt-1 min-h-[80px]"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">{t('businessVerification.legalInformation')}</h2>
              <p className="text-muted-foreground">{t('businessVerification.provideRegistrationDetails')}</p>
            </div>

            <div>
              <Label htmlFor="registrationNumber">{t('businessVerification.registrationNumber')} *</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => updateFormData('registrationNumber', e.target.value)}
                placeholder={t('businessVerification.enterRegistrationNumber')}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="taxId">{t('businessVerification.taxId')} *</Label>
              <Input
                id="taxId"
                value={formData.taxId}
                onChange={(e) => updateFormData('taxId', e.target.value)}
                placeholder={t('businessVerification.enterTaxId')}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address">{t('businessVerification.businessAddress')} *</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateFormData('address', e.target.value)}
                placeholder={t('businessVerification.enterCompleteAddress')}
                required
                className="mt-1 min-h-[80px]"
              />
            </div>

            <div>
              <Label htmlFor="website">{t('businessVerification.businessWebsite')}</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => updateFormData('website', e.target.value)}
                placeholder={t('businessVerification.websitePlaceholder')}
                className="mt-1"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">{t('businessVerification.documentUpload')}</h2>
              <p className="text-muted-foreground">{t('businessVerification.uploadRequiredDocuments')}</p>
            </div>

            {/* Document Upload Areas */}
            <div className="space-y-4">
              <div>
                <Label>{t('businessVerification.registrationCertificate')} *</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('businessVerification.uploadRegistrationCertificate')}
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    {t('common.chooseFile')}
                  </Button>
                </div>
              </div>

              <div>
                <Label>{t('businessVerification.taxRegistrationDocument')}</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('businessVerification.uploadTaxDocument')}
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    {t('common.chooseFile')}
                  </Button>
                </div>
              </div>

              <div>
                <Label>{t('businessVerification.proofOfAddress')}</Label>
                <div className="mt-1 border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground mb-2">
                    {t('businessVerification.uploadProofOfAddress')}
                  </p>
                  <Button type="button" variant="outline" size="sm">
                    {t('common.chooseFile')}
                  </Button>
                </div>
              </div>
            </div>

            {/* Verification Benefits */}
            <Card className="p-4 bg-muted/50">
              <h3 className="font-medium text-foreground mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-primary" />
                {t('businessVerification.verificationBenefits')}
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{t('businessVerification.enterpriseSuppliers')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{t('businessVerification.higherLimits')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{t('businessVerification.extendedPaymentTerms')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span>{t('businessVerification.prioritySupport')}</span>
                </li>
              </ul>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.businessName && formData.businessType;
      case 2:
        return formData.registrationNumber && formData.taxId && formData.address;
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
          <h1 className="text-lg font-semibold text-foreground">{t('businessVerification.title')}</h1>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="px-4 pb-4 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-muted-foreground">{t('common.stepOf', { current: step, total: totalSteps })}</span>
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
            {step === totalSteps ? t('businessVerification.submitForReview') : t('common.next')}
          </Button>
        </div>
      </div>
    </div>
  );
}