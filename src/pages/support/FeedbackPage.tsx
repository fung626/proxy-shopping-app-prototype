import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/store/LanguageContext';
import { ArrowLeft, MessageCircle, Star, User } from 'lucide-react';
import { useState } from 'react';

interface FeedbackPageProps {
  request: {
    id: string;
    title: string;
    role: string;
    agent?: string;
    client?: string;
    status: string;
  };
  onBack: () => void;
  onSubmitFeedback: (feedback: {
    rating: number;
    comment: string;
    recipientType: 'agent' | 'client';
    recipientName: string;
  }) => void;
}

export function FeedbackPage({
  request,
  onBack,
  onSubmitFeedback,
}: FeedbackPageProps) {
  const { t } = useLanguage();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Determine who the current user is giving feedback about
  const isClient = request.role === 'client';
  const recipientType = isClient ? 'agent' : 'client';
  const recipientName = isClient ? request.agent : request.client;

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleStarHover = (starRating: number) => {
    setHoverRating(starRating);
  };

  const handleStarLeave = () => {
    setHoverRating(0);
  };

  const handleSubmit = async () => {
    if (rating === 0 || !comment.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmitFeedback({
        rating,
        comment: comment.trim(),
        recipientType,
        recipientName: recipientName || 'Unknown',
      });
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return t('feedback.ratingPoor');
      case 2:
        return t('feedback.ratingFair');
      case 3:
        return t('feedback.ratingGood');
      case 4:
        return t('feedback.ratingVeryGood');
      case 5:
        return t('feedback.ratingExcellent');
      default:
        return t('feedback.selectRating');
    }
  };

  const currentRating = hoverRating || rating;

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
                {t('feedback.title')}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t('feedback.subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Request Info */}
        <div className="p-4 bg-muted/30 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">
              {request.title}
            </h3>
            <Badge variant="outline" className="text-xs">
              {request.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">
              {t('feedback.rateYour')} {recipientType}:{' '}
              <span className="font-medium text-foreground">
                {recipientName}
              </span>
            </span>
          </div>
        </div>

        {/* Rating Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            {t('feedback.overallRating')}
          </h3>

          <div className="p-6 bg-muted/30 rounded-lg text-center">
            <div className="flex justify-center space-x-1 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 transition-colors ${
                      star <= currentRating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-muted-foreground'
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-sm font-medium text-foreground">
              {getRatingText(currentRating)}
            </p>
            {currentRating > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                {currentRating} {t('feedback.outOfStars')}
              </p>
            )}
          </div>
        </div>

        {/* Comment Section */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">
            {t('feedback.yourComments')}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{t('feedback.shareDetails')}</span>
            </div>

            <Textarea
              placeholder={t('feedback.commentPlaceholder', {
                name: recipientName,
              })}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={500}
            />

            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>{t('feedback.feedbackHelps')}</span>
              <span>{comment.length}/500</span>
            </div>
          </div>
        </div>

        {/* Feedback Guidelines */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            {t('feedback.guidelines')}
          </h4>
          <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
            <li>• {t('feedback.guideline1')}</li>
            <li>• {t('feedback.guideline2')}</li>
            <li>• {t('feedback.guideline3')}</li>
            <li>• {t('feedback.guideline4')}</li>
          </ul>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={rating === 0 || isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting
              ? t('feedback.submitting')
              : t('feedback.submitFeedback')}
          </Button>

          {rating === 0 && (
            <p className="text-sm text-muted-foreground text-center mt-2">
              {t('feedback.selectRatingToContinue')}
            </p>
          )}
        </div>

        {/* Skip Option */}
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground"
          >
            {t('feedback.skipForNow')}
          </Button>
        </div>
      </div>
    </div>
  );
}
