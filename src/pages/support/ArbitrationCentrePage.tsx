import { ImageWithFallback } from '@/components/figma/ImageWithFallback';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/store/LanguageContext';
import { User } from '@/types';
import {
  AlertTriangle,
  ArrowLeft,
  FileText,
  Upload,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ArbitrationCentrePageProps {
  user: User | null;
  request?: any;
  onBack: () => void;
  onSubmit?: (arbitrationData: any) => void;
}

export function ArbitrationCentrePage({
  user,
  request,
  onBack,
  onSubmit,
}: ArbitrationCentrePageProps) {
  const { t } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInfoBox, setShowInfoBox] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    issueType: '',
    severity: 'medium',
    requestId: request?.id || '',
    requestTitle: request?.title || '',
  });

  const issueTypes = [
    { value: 'payment', label: t('arbitration.paymentIssues') },
    { value: 'delivery', label: t('arbitration.deliveryProblems') },
    { value: 'quality', label: t('arbitration.productQuality') },
    {
      value: 'communication',
      label: t('arbitration.communicationIssues'),
    },
    { value: 'breach', label: t('arbitration.contractBreach') },
    { value: 'fraud', label: t('arbitration.fraudulentActivity') },
    { value: 'other', label: t('arbitration.otherDispute') },
  ];

  const severityLevels = [
    {
      value: 'low',
      label: t('arbitration.severityLow'),
      description: t('arbitration.severityLowDesc'),
      color: 'bg-green-100 text-green-800',
    },
    {
      value: 'medium',
      label: t('arbitration.severityMedium'),
      description: t('arbitration.severityMediumDesc'),
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      value: 'high',
      label: t('arbitration.severityHigh'),
      description: t('arbitration.severityHighDesc'),
      color: 'bg-red-100 text-red-800',
    },
  ];

  const handleImageUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setUploadedImages((prev) => [
              ...prev,
              e.target!.result as string,
            ]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (
      !formData.subject.trim() ||
      !formData.description.trim() ||
      !formData.issueType
    ) {
      toast.error(t('arbitration.fillRequiredFields'));
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const arbitrationData = {
        ...formData,
        images: uploadedImages,
        userId: user?.id,
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };

      onSubmit?.(arbitrationData);
      toast.success(t('arbitration.submitSuccess'));

      // Reset form
      setFormData({
        subject: '',
        description: '',
        issueType: '',
        severity: 'medium',
        requestId: request?.id || '',
        requestTitle: request?.title || '',
      });
      setUploadedImages([]);
    } catch (error) {
      toast.error(t('arbitration.submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold">
                {t('arbitration.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('arbitration.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-0 pb-4">
        {/* Info Box */}
        {showInfoBox && (
          <div className="mt-4 mb-4 p-4 bg-muted/50 rounded-xl">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground mb-1">
                    {t('arbitration.processTitle')}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t('arbitration.processDescription')}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground ml-2"
                onClick={() => setShowInfoBox(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Request Information */}
        {request && (
          <div className="mb-6 p-4 bg-muted/30 rounded-xl border border-border/50">
            <h3 className="font-medium text-foreground mb-3">
              {t('arbitration.relatedRequest')}
            </h3>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                {request.images?.[0] ? (
                  <ImageWithFallback
                    src={request.images[0]}
                    alt={request.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-foreground mb-1">
                  {request.title}
                </h4>
                <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                  {request.description}
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {request.id}
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {request.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Arbitration Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('arbitration.issueType')}{' '}
              <span className="text-destructive">
                {t('arbitration.required')}
              </span>
            </label>
            <div className="grid grid-cols-1 gap-2">
              {issueTypes.map((type) => (
                <Button
                  key={type.value}
                  type="button"
                  variant={
                    formData.issueType === type.value
                      ? 'default'
                      : 'outline'
                  }
                  className="h-auto py-3 px-4 text-left justify-start"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      issueType: type.value,
                    })
                  }
                >
                  <div className="text-sm font-medium">
                    {type.label}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Severity Level */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('arbitration.severityLevel')}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {severityLevels.map((level) => (
                <Button
                  key={level.value}
                  type="button"
                  variant={
                    formData.severity === level.value
                      ? 'default'
                      : 'outline'
                  }
                  className="h-auto py-3 px-2 text-left justify-start flex-col items-start"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      severity: level.value,
                    })
                  }
                >
                  <div className="text-sm font-medium w-full">
                    {level.label}
                  </div>
                  <div className="text-xs text-muted-foreground w-full break-words leading-tight">
                    {level.description}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('arbitration.subject')}{' '}
              <span className="text-destructive">
                {t('arbitration.required')}
              </span>
            </label>
            <Input
              value={formData.subject}
              onChange={(e) =>
                setFormData({ ...formData, subject: e.target.value })
              }
              placeholder={t('arbitration.subjectPlaceholder')}
              className="bg-input-background border-border"
              required
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('arbitration.detailedDescription')}{' '}
              <span className="text-destructive">
                {t('arbitration.required')}
              </span>
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              placeholder={t('arbitration.descriptionPlaceholder')}
              className="bg-input-background border-border min-h-[120px]"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              {t('arbitration.descriptionHelper')}
            </p>
          </div>

          {/* Evidence Upload */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              {t('arbitration.supportingEvidence')}
            </label>
            <div className="space-y-3">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="evidence-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="evidence-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <Upload className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">
                      {t('arbitration.uploadEvidence')}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {t('arbitration.evidenceHelper')}
                    </p>
                  </div>
                </label>
              </div>

              {/* Uploaded Images */}
              {uploadedImages.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative">
                      <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                        <ImageWithFallback
                          src={image}
                          alt={`Evidence ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {t('arbitration.evidenceDescription')}
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-2 pb-8">
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                !formData.subject.trim() ||
                !formData.description.trim() ||
                !formData.issueType
              }
              size="lg"
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {t('arbitration.submitting')}
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  {t('arbitration.submitRequest')}
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center mt-3">
              {t('arbitration.submitAgreement')}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
