import { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Plus, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { useLanguage } from '../store/LanguageContext';
import { CreditCard as CreditCardType } from '../types';

interface CreditCardsPageProps {
  onBack: () => void;
  onSave?: (creditCards: CreditCardType[]) => void;
  onNavigateToAddCard?: () => void;
  user?: any;
}

export function CreditCardsPage({ onBack, onSave, onNavigateToAddCard, user }: CreditCardsPageProps) {
  const { t } = useLanguage();
  // Initialize with user's saved credit cards
  const [creditCards, setCreditCards] = useState<CreditCardType[]>(user?.creditCards || []);

  // Update local state when user prop changes (e.g., when cards are added from other pages)
  useEffect(() => {
    if (user?.creditCards) {
      setCreditCards(user.creditCards);
    }
  }, [user?.creditCards]);

  // Debug logging to help track card data
  useEffect(() => {
    console.log('CreditCardsPage - User:', user);
    console.log('CreditCardsPage - User creditCards:', user?.creditCards);
    console.log('CreditCardsPage - Local creditCards state:', creditCards);
  }, [user, creditCards]);

  const [showCardNumbers, setShowCardNumbers] = useState<{[key: string]: boolean}>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\s/g, '');
    return cleaned.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, '**** **** **** $4');
  };

  const getCardIcon = (cardType: CreditCardType['cardType']) => {
    const iconClass = "w-8 h-6 rounded border bg-white flex items-center justify-center text-xs font-bold";
    switch (cardType) {
      case 'visa':
        return <div className={`${iconClass} text-blue-600`}>VISA</div>;
      case 'mastercard':
        return <div className={`${iconClass} text-red-600`}>MC</div>;
      case 'amex':
        return <div className={`${iconClass} text-green-600`}>AMEX</div>;
      case 'discover':
        return <div className={`${iconClass} text-orange-600`}>DISC</div>;
      default:
        return <CreditCard className="w-6 h-6 text-muted-foreground" />;
    }
  };

  const handleAddCard = (cardToAdd: CreditCardType) => {
    // If this is set as default, remove default from others
    if (cardToAdd.isDefault) {
      setCreditCards(prev => prev.map(card => ({ ...card, isDefault: false })));
    }

    setCreditCards(prev => [...prev, cardToAdd]);
  };

  const handleDeleteCard = (cardId: string) => {
    const cardToDelete = creditCards.find(card => card.id === cardId);
    const remainingCards = creditCards.filter(card => card.id !== cardId);
    
    // If deleting the default card and there are others, make the first one default
    if (cardToDelete?.isDefault && remainingCards.length > 0) {
      remainingCards[0].isDefault = true;
    }

    setCreditCards(remainingCards);
    setDeleteConfirmId(null);
  };

  const handleSetDefault = (cardId: string) => {
    setCreditCards(prev => prev.map(card => ({
      ...card,
      isDefault: card.id === cardId
    })));
  };

  const toggleCardNumberVisibility = (cardId: string) => {
    setShowCardNumbers(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (onSave) {
        onSave(creditCards);
      }
      
      onBack();
    } catch (err) {
      setError(t('addCreditCard.errorSaveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 bg-background border-b border-border px-4 py-3">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="mr-3"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">{t('creditCards.title')}</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="mb-6">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <CreditCard className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold mb-2">{t('creditCards.subtitle')}</h2>
          <p className="text-muted-foreground">
            {t('creditCards.description')}
          </p>
        </div>
        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Existing Cards */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">{t('creditCards.title')}</h3>
            <Button
              onClick={() => onNavigateToAddCard?.()}
              size="sm"
              className="flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>{t('creditCards.addNewCard')}</span>
            </Button>
          </div>

          {creditCards.length === 0 ? (
            <div className="p-6 bg-muted/50 rounded-lg text-center">
              <CreditCard className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">{t('creditCards.noCards')}</p>
              <Button onClick={() => onNavigateToAddCard?.()}>
                {t('creditCards.addNewCard')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {creditCards.map((card) => (
                <div key={card.id} className="p-6 bg-muted/50 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getCardIcon(card.cardType)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-foreground">
                            {card.nickname || `${card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1)} Card`}
                          </span>
                          {card.isDefault && (
                            <Badge variant="default" className="text-xs">{t('creditCards.default')}</Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-muted-foreground">
                            {showCardNumbers[card.id] ? card.cardNumber : maskCardNumber(card.cardNumber)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleCardNumberVisibility(card.id)}
                            className="h-6 w-6 p-0"
                          >
                            {showCardNumbers[card.id] ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!card.isDefault && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(card.id)}
                          className="text-xs"
                        >
                          {t('creditCards.setAsDefault')}
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(card.id)}
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div>{t('creditCards.expires')}: {card.expiryMonth}/{card.expiryYear}</div>
                    <div>{t('addCreditCard.cardholderName')}: {card.cardholderName}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={!!deleteConfirmId} onOpenChange={() => setDeleteConfirmId(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('creditCards.confirmDelete')}</DialogTitle>
              <DialogDescription>
                {t('creditCards.confirmDeleteMessage')}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="space-x-2">
              <Button variant="outline" onClick={() => setDeleteConfirmId(null)}>
                {t('common.cancel')}
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => deleteConfirmId && handleDeleteCard(deleteConfirmId)}
              >
                {t('creditCards.deleteCard')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Payment Security Info */}
        <div className="p-4 bg-muted/50 rounded-lg my-6">
          <h4 className="font-medium mb-2">{t('addCreditCard.paymentSecurity')}</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span>{t('addCreditCard.security1')}</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span>{t('addCreditCard.security2')}</span>
            </li>
            <li className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
              <span>{t('addCreditCard.security3')}</span>
            </li>
          </ul>
        </div>

        {/* Save Button */}
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="w-full"
        >
          {isSaving ? t('creditCards.saving') : t('creditCards.saveChanges')}
        </Button>
      </div>
    </div>
  );
}