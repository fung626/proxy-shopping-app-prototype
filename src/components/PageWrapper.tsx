import { NavBar } from '@/components/NavBar';
import { ReactNode } from 'react';
import { NavBarLarge } from './NavBarLarge';

interface PageWrapperProps {
  title?: string;
  subTitle?: string;
  children: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: ReactNode;
  className?: string;
  contentClassName?: string;
  showNavBar?: boolean;
  showLargeNavBar?: boolean;
}

export function PageWrapper({
  title,
  subTitle,
  children,
  showBack = true,
  onBack,
  rightAction,
  className = 'min-h-screen bg-gray-50',
  contentClassName = 'flex items-center justify-center px-4 py-8',
  showNavBar = true,
  showLargeNavBar = false,
}: PageWrapperProps) {
  return (
    <div className={className}>
      {showNavBar && (
        <NavBar
          title={title}
          showBack={showBack}
          onBack={onBack}
          rightAction={rightAction}
        />
      )}
      {showLargeNavBar && (
        <NavBarLarge
          title={title}
          subtitle={subTitle}
          showBack={showBack}
          onBack={onBack}
          rightActions={[rightAction]}
        />
      )}
      <div className={contentClassName}>{children}</div>
    </div>
  );
}
