import React from 'react';
import { LayoutDashboard, MessageSquareText, Calculator, FileText, HelpCircle, BookOpen } from 'lucide-react';
import { NavTab } from './Header';

interface MobileNavProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs = [
    { id: 'dashboard' as NavTab, label: 'Home', icon: LayoutDashboard },
    { id: 'chat' as NavTab, label: 'Tutor', icon: MessageSquareText },
    { id: 'math' as NavTab, label: 'Math', icon: Calculator },
    { id: 'notes' as NavTab, label: 'Notes', icon: FileText },
    { id: 'quiz' as NavTab, label: 'Quiz', icon: HelpCircle },
    { id: 'materials' as NavTab, label: 'Study', icon: BookOpen },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 px-2 py-1.5 flex items-center justify-around transition-colors">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 min-w-[48px] py-1 px-2 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
            <span className="text-[10px] leading-none whitespace-nowrap">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
