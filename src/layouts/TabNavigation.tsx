import { useLanguage } from '@/store/LanguageContext';
import {
  CirclePlus,
  Home,
  MessageCircle,
  Package,
  User,
} from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function TabNavigation({
  activeTab,
  onTabChange,
}: TabNavigationProps) {
  const { t } = useLanguage();

  const tabs = [
    { id: 'explore', label: t('nav.explore'), icon: Home },
    { id: 'create', label: t('nav.create'), icon: CirclePlus },
    { id: 'messages', label: t('nav.messages'), icon: MessageCircle },
    { id: 'orders', label: t('nav.orders'), icon: Package },
    { id: 'profile', label: t('nav.profile'), icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="flex justify-around items-center max-w-md mx-auto py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center space-y-1 px-4 py-2 transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
