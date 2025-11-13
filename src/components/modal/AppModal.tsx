import { useLanguage } from '@/store/LanguageContext';
import { useEffect } from 'react';
import { Button } from '../ui/button';
import ModalWrapper from './ModalWrapper';
import { CloseModalHandler } from './type';

type AppModalProps = {
  title?: string;
  content: string;
  cancelBtn?: boolean;
  cancelBtnTitle?: string;
  confirmBtnTitle?: string;
  closeModal: CloseModalHandler;
};

const AppModal = ({
  title,
  content,
  cancelBtn = true,
  cancelBtnTitle,
  confirmBtnTitle,
  closeModal,
}: AppModalProps) => {
  const { t } = useLanguage();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal?.({ action: 'CLOSE' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);

  return (
    <ModalWrapper
      closeModal={() => closeModal?.({ action: 'CLOSE' })}
    >
      <div className="bg-background rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">
          {t(title || 'common.alert')}
        </h2>
        <p className="text-sm text-muted-foreground">{t(content)}</p>
        <div className="flex justify-end mt-6">
          {cancelBtn && (
            <Button
              variant="ghost"
              className="mr-2"
              onClick={() => closeModal?.({ action: 'CLOSE' })}
            >
              {cancelBtnTitle
                ? t(cancelBtnTitle)
                : t('common.cancel')}
            </Button>
          )}
          <Button onClick={() => closeModal?.()}>
            {confirmBtnTitle ? t(confirmBtnTitle) : t('common.ok')}
          </Button>
        </div>
      </div>
    </ModalWrapper>
  );
};

export default AppModal;
