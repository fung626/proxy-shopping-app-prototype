import { ArrowLeft, Star, User, MessageCircle, Calendar } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { useLanguage } from '../store/LanguageContext';

interface Feedback {
  id: string;
  rating: number;
  comment: string;
  recipientType: 'agent' | 'client';
  recipientName: string;
  authorName: string;
  authorType: 'agent' | 'client';
  createdDate: string;
}

interface ViewFeedbackPageProps {
  request: {
    id: string;
    title: string;
    role: string;
    agent?: string;
    client?: string;
    status: string;
  };
  feedback: Feedback[];
  onBack: () => void;
}

export function ViewFeedbackPage({ request, feedback, onBack }: ViewFeedbackPageProps) {
  const { t } = useLanguage();

  const renderStars = (rating: number) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-muted-foreground'
            }`}
          />
        ))}
      </div>
    );
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1:
        return t('feedback.poor');
      case 2:
        return t('feedback.fair');
      case 3:
        return t('feedback.good');
      case 4:
        return t('feedback.veryGood');
      case 5:
        return t('feedback.excellent');
      default:
        return t('feedback.noRating');
    }
  };

  const getAverageRating = () => {
    if (feedback.length === 0) return 0;
    const total = feedback.reduce((sum, f) => sum + f.rating, 0);
    return total / feedback.length;
  };

  const averageRating = getAverageRating();

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
              <h1 className="text-lg font-semibold">{t('feedback.title')}</h1>
              <p className="text-sm text-muted-foreground">
                {feedback.length} {feedback.length === 1 ? t('feedback.review') : t('feedback.reviews')}
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
            <h3 className="font-semibold text-foreground">{request.title}</h3>
            <Badge variant="outline" className="text-xs">
              {request.status}
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t('feedback.agent')}: <span className="font-medium text-foreground">{request.agent || t('feedback.notAssigned')}</span>
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {t('feedback.client')}: <span className="font-medium text-foreground">{request.client || t('feedback.unknown')}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Overall Rating Summary */}
        {feedback.length > 0 && (
          <div className="p-4 bg-muted/30 rounded-lg">
            <h3 className="font-semibold text-foreground mb-3">{t('feedback.overallRating')}</h3>
            <div className="flex items-center space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-foreground">{averageRating.toFixed(1)}</div>
                <div className="flex justify-center mb-1">
                  {renderStars(Math.round(averageRating))}
                </div>
                <div className="text-xs text-muted-foreground">
                  {getRatingText(Math.round(averageRating))}
                </div>
              </div>
              <Separator orientation="vertical" className="h-16" />
              <div className="flex-1">
                <div className="text-sm text-muted-foreground">
                  {t('feedback.basedOn')} {feedback.length} {feedback.length === 1 ? t('feedback.review') : t('feedback.reviews')}
                </div>
                <div className="mt-2 space-y-1">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = feedback.filter(f => f.rating === rating).length;
                    const percentage = feedback.length > 0 ? (count / feedback.length) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center space-x-2 text-xs">
                        <span className="w-3">{rating}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-muted-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Individual Feedback */}
        <div className="space-y-4">
          <h3 className="font-semibold text-foreground">{t('feedback.reviews')}</h3>
          
          {feedback.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">{t('feedback.noFeedback')}</h3>
              <p className="text-muted-foreground">
                {t('feedback.noFeedbackDescription')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {feedback.map((feedbackItem) => (
                <div key={feedbackItem.id} className="p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium text-foreground">{feedbackItem.authorName}</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {feedbackItem.authorType} → {feedbackItem.recipientType}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 mb-1">
                        {renderStars(feedbackItem.rating)}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{feedbackItem.createdDate}</span>
                      </div>
                    </div>
                  </div>
                  
                  {feedbackItem.comment && (
                    <div className="text-sm text-foreground leading-relaxed">
                      "{feedbackItem.comment}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Guidelines */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">{t('feedback.aboutReviews')}</h4>
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {t('feedback.aboutReviewsDescription')}
          </p>
        </div>
      </div>
    </div>
  );
}