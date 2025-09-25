import { useState } from 'react';
import { Star, Calendar, User, X, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from './ui/sheet';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';

interface AgentFeedback {
  id: string;
  rating: number;
  comment: string;
  clientName: string;
  createdDate: string;
  requestType: string;
  isVerified: boolean;
}

interface AgentFeedbackModalProps {
  agentName: string;
  agentId: string;
  overallRating: number;
  completedOrders: number;
  recentFeedback: AgentFeedback[];
  trigger: React.ReactNode;
}

export function AgentFeedbackModal({
  agentName,
  agentId,
  overallRating,
  completedOrders,
  recentFeedback,
  trigger
}: AgentFeedbackModalProps) {
  const [open, setOpen] = useState(false);

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
        return 'Poor';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Very Good';
      case 5:
        return 'Excellent';
      default:
        return 'No Rating';
    }
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    recentFeedback.forEach(feedback => {
      distribution[feedback.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const totalReviews = recentFeedback.length;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-lg">
        <div className="flex flex-col h-full">
          {/* Drag Handle */}
          <div className="flex justify-center py-2">
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full"></div>
          </div>
          
          <div className="flex-shrink-0 border-b border-border">
            <SheetHeader className="text-left pt-0">
              <SheetTitle>{agentName}'s Reviews</SheetTitle>
              <SheetDescription>
                View ratings and reviews from previous clients for {agentName}
              </SheetDescription>
            </SheetHeader>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6 pb-6">
            {/* Overall Rating Summary */}
            <div className="text-center space-y-3">
              <div className="text-3xl font-bold text-foreground">{overallRating}</div>
              <div className="flex justify-center">
                {renderStars(Math.round(overallRating))}
              </div>
              <div className="text-sm text-muted-foreground">
                {getRatingText(Math.round(overallRating))} • Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
              </div>
              <div className="text-xs text-muted-foreground">
                {completedOrders} completed orders
              </div>
            </div>

            {/* Rating Distribution */}
            {totalReviews > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium text-foreground">Rating Breakdown</h4>
                <div className="space-y-2">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count = ratingDistribution[rating as keyof typeof ratingDistribution];
                    const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                    return (
                      <div key={rating} className="flex items-center space-x-3 text-sm">
                        <span className="w-3 text-right">{rating}</span>
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        <div className="flex-1 bg-muted rounded-full h-2">
                          <div
                            className="bg-yellow-400 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-muted-foreground">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            {/* Recent Reviews */}
            <div className="space-y-4">
              <h4 className="font-medium text-foreground">Recent Reviews</h4>
              
              {recentFeedback.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-muted-foreground text-sm">No reviews yet</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentFeedback.slice(0, 5).map((feedback) => (
                    <div key={feedback.id} className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-sm">{feedback.clientName}</span>
                              {feedback.isVerified && (
                                <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                                  Verified
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>{feedback.createdDate}</span>
                              <span>•</span>
                              <span>{feedback.requestType}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {renderStars(feedback.rating)}
                        </div>
                      </div>
                      
                      {feedback.comment && (
                        <p className="text-sm text-foreground leading-relaxed pl-11">
                          "{feedback.comment}"
                        </p>
                      )}
                    </div>
                  ))}
                  
                  {recentFeedback.length > 5 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm" className="text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View all {recentFeedback.length} reviews
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="p-3 bg-muted/30 rounded-lg mb-1">
              <h4 className="font-medium text-sm text-foreground mb-2">Trust & Safety</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• All reviews are from verified completed orders</li>
                <li>• Reviews cannot be edited after submission</li>
                <li>• Fake reviews are automatically detected and removed</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}