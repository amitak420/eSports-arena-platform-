


import React from 'react';
// FIX: Import 'Page' from '../App' instead of non-existent 'View' to resolve module export error.
import { Page } from '../App';
import { DashboardIcon, BrainCircuitIcon, TrophyIcon, UsersIcon, CogIcon, LogoutIcon, GrindArenaLogo } from './icons/UIIcons';

interface SidebarProps {
  // FIX: Use 'Page' type for props.
  currentView: Page;
  setCurrentView: (view: Page) => void;
}

const NavItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center w-full px-4 py-3 text-left transition-colors duration-200 rounded-lg ${
      isActive
        ? 'bg-brand-primary text-white font-semibold shadow-lg'
        : 'text-brand-text-secondary hover:bg-brand-surface hover:text-brand-text-main'
    }`}
  >
    {icon}
    <span className="ml-4">{label}</span>
  </button>
);

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView }) => {
  return (
    <aside className="w-64 bg-brand-surface border-r border-brand-border flex flex-col p-4">
      <div className="flex items-center mb-10 px-2">
        <GrindArenaLogo className="w-10 h-10" />
        <h1 className="text-2xl font-bold ml-2 text-white">eSports Arena</h1>
      </div>
      <nav className="flex flex-col space-y-2">
        <NavItem
          icon={<DashboardIcon className="w-6 h-6" />}
          label="Dashboard"
          // FIX: Update view name from 'dashboard' to 'home' to match Page type.
          isActive={currentView === 'home'}
          onClick={() => setCurrentView('home')}
        />
        <NavItem
          icon={<BrainCircuitIcon className="w-6 h-6" />}
          label="AI Strategy Coach"
          // FIX: Update view name from 'coach' to 'chat' to match Page type.
          isActive={currentView === 'chat'}
          onClick={() => setCurrentView('chat')}
        />
        <NavItem
          icon={<TrophyIcon className="w-6 h-6" />}
          label="Leaderboards"
          isActive={currentView === 'leaderboards'}
          onClick={() => setCurrentView('leaderboards')}
        />
        <NavItem
          icon={<UsersIcon className="w-6 h-6" />}
          label="My Teams"
          isActive={false}
          onClick={() => {}}
        />
      </nav>
      <div className="mt-auto">
        <div className="flex flex-col space-y-2">
            <NavItem
              icon={<CogIcon className="w-6 h-6" />}
              label="Settings"
              isActive={false}
              onClick={() => {}}
            />
            <NavItem
              icon={<LogoutIcon className="w-6 h-6" />}
              label="Logout"
              isActive={false}
              onClick={() => {}}
            />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;