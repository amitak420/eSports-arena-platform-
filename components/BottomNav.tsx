import React from 'react';
import { Page } from '../App';
import { HomeIcon, TournamentIcon, PlusIcon, UserIcon, UsersIcon, AICoachIcon } from './icons/UIIcons';

interface BottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

// FIX: Changed icon prop type to React.ReactElement<any> to fix type errors with React.cloneElement.
const NavItem: React.FC<{
  icon: React.ReactElement<any>;
  label: string;
  isActive: boolean;
  onClick: () => void;
  page: Page;
}> = ({ icon, label, isActive, onClick, page }) => (
  <button
    onClick={onClick}
    className={`nav-item flex flex-col items-center p-2 transition-all duration-200 flex-1 ${
      isActive ? 'text-brand-primary font-bold' : 'text-gray-400 hover:text-brand-primary'
    }`}
    data-page={page}
  >
    {React.cloneElement(icon, { className: `w-6 h-6 mb-0.5 ${isActive ? 'stroke-2' : ''}` })}
    <span className="text-xs">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, setCurrentPage }) => {
  const mainPages: Page[] = ['home', 'tournaments', 'chat', 'teams', 'profile'];
  const isActive = (page: Page) => {
    if (page === 'tournaments' && (currentPage === 'tournament-detail' || currentPage === 'join-flow')) {
        return true;
    }
    return mainPages.includes(currentPage) ? currentPage === page : false;
  }

  return (
    <nav className="fixed bottom-0 w-full glass-effect z-50 border-t border-brand-primary/20">
        <div className="flex justify-around py-1.5">
            <NavItem
              icon={<HomeIcon />}
              label="Home"
              isActive={isActive('home')}
              onClick={() => setCurrentPage('home')}
              page='home'
            />
            <NavItem
              icon={<TournamentIcon />}
              label="Tournaments"
              isActive={isActive('tournaments')}
              onClick={() => setCurrentPage('tournaments')}
              page='tournaments'
            />
             <NavItem
              icon={<AICoachIcon />}
              label="AI Coach"
              isActive={isActive('chat')}
              onClick={() => setCurrentPage('chat')}
              page='chat'
            />
            <NavItem
              icon={<UsersIcon />}
              label="Teams"
              isActive={isActive('teams')}
              onClick={() => setCurrentPage('teams')}
              page='teams'
            />
            <NavItem
              icon={<UserIcon />}
              label="Profile"
              isActive={isActive('profile')}
              onClick={() => setCurrentPage('profile')}
              page='profile'
            />
        </div>
    </nav>
  );
};

export default BottomNav;
