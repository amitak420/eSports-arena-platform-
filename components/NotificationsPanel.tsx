import React, { useEffect, useRef } from 'react';
import { Notification } from '../types';
import { BellIcon } from './icons/UIIcons';

interface NotificationsPanelProps {
  notifications: Notification[];
  onClose: () => void;
  onMarkAllRead: () => void;
}

const timeSince = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + "y ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + "mo ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + "d ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + "h ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + "m ago";
    return Math.floor(seconds) + "s ago";
}


const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose, onMarkAllRead }) => {
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div ref={panelRef} className="absolute top-16 right-4 w-80 max-w-[90vw] glass-effect rounded-2xl shadow-2xl z-50 overflow-hidden page-animation">
            <div className="p-4 border-b border-gray-200/80 dark:border-gray-700/80 flex justify-between items-center">
                <h3 className="font-bold text-gray-800 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                    <button onClick={onMarkAllRead} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                        Mark all as read
                    </button>
                )}
            </div>
            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map(n => (
                        <div key={n.id} className={`p-4 border-b border-gray-200/50 dark:border-gray-700/50 last:border-b-0 flex items-start gap-3 transition-colors ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}>
                            {!n.read && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0"></div>}
                            <div className={`flex-1 ${!n.read ? '' : 'pl-5'}`}>
                                <p className="text-sm text-gray-800 dark:text-gray-200">{n.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{timeSince(n.timestamp)}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-10">
                        <BellIcon className="w-10 h-10 mx-auto text-gray-400 dark:text-gray-500 mb-2"/>
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">No new notifications</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Join tournaments to get updates!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NotificationsPanel;