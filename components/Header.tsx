import React, { useState } from 'react';
// FIX: Removed useTheme as it's not exported from App.
import { useAppContext } from '../App';
import { AppNameLogo, UserIcon, SunIcon, MoonIcon, BellIcon } from './icons/UIIcons';
import NotificationsPanel from './NotificationsPanel';

interface HeaderProps {
    user: {name: string, role: string} | null;
    onUserButtonClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onUserButtonClick }) => {
  const { notifications, markAllNotificationsAsRead } = useAppContext();
  const [isNotificationsOpen, setNotificationsOpen] = useState(false);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
    setNotificationsOpen(prev => !prev);
  }

  const handleMarkAllRead = () => {
    markAllNotificationsAsRead();
  }

  return (
    <header className="fixed top-0 w-full glass-effect shadow-lg z-50">
        <div className="flex justify-between items-center px-4 py-3">
            <div className="flex items-center space-x-3">
                <AppNameLogo className="w-8 h-8 text-brand-primary" />
                <h1 className="text-xl font-bold text-white">eSports Arena</h1>
            </div>
            <div className="flex items-center space-x-2">
                 {/* FIX: Removed theme toggle button as useTheme is not available */}
                <button onClick={toggleNotifications} className="relative w-10 h-10 bg-white/10 text-brand-primary rounded-full flex items-center justify-center">
                    <BellIcon className="w-6 h-6" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-brand-bg"></span>
                    )}
                </button>
                <button onClick={onUserButtonClick} className="w-10 h-10 bg-brand-secondary text-white rounded-full flex items-center justify-center">
                    {user ? (
                        <span className="text-lg font-bold">{user.name[0].toUpperCase()}</span>
                    ) : (
                        <UserIcon className="w-6 h-6" />
                    )}
                </button>
            </div>
        </div>
        {isNotificationsOpen && (
            <NotificationsPanel 
                notifications={notifications}
                onClose={() => setNotificationsOpen(false)}
                onMarkAllRead={handleMarkAllRead}
            />
        )}
    </header>
  );
};

export default Header;
