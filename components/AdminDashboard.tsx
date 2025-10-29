import React, { useState } from 'react';
import { Page, useAppContext } from '../App';
import { getTournaments } from '../services/mockFirebase';
import FlaggedMatches from './FlaggedMatches';
import { DollarSignIcon, UsersIcon, ShieldAlertIcon } from './icons/UIIcons';

interface AdminDashboardProps {
  setCurrentPage: (page: Page) => void;
}

const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode, colorClass: string }> = ({ value, label, icon, colorClass }) => (
  <div className="glass-effect rounded-xl p-4 flex items-center space-x-3">
    <div className={`${colorClass} w-10 h-10 flex-shrink-0 rounded-lg flex items-center justify-center`}>{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{label}</p>
    </div>
  </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ setCurrentPage }) => {
  const { currentUser } = useAppContext();
  const [viewingFlags, setViewingFlags] = useState(true); // Default to showing flagged matches

  if (!currentUser || currentUser.role !== 'admin') {
    return <div className="p-4 text-center text-white">Access Denied. You are not an administrator.</div>;
  }
  
  const allTournaments = getTournaments();
  const totalGmv = allTournaments.reduce((sum, t) => sum + (t.participants * t.entryFee), 0);
  const activePlayers = new Set(allTournaments.map(t => t.organizerName)).size; // Mocking this stat

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Admin Control Panel</h1>
        <p className="text-gray-400">Platform Overview</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard value={`₹${(totalGmv / 1000).toFixed(1)}K`} label="Total GMV" icon={<DollarSignIcon className="w-6 h-6 text-white"/>} colorClass="bg-green-500/80" />
        <StatCard value={activePlayers.toString()} label="Active Organizers" icon={<UsersIcon className="w-6 h-6 text-white"/>} colorClass="bg-blue-500/80" />
        <StatCard value="1.2%" label="Fraud Rate" icon={<ShieldAlertIcon className="w-6 h-6 text-white"/>} colorClass="bg-red-500/80" />
      </div>

      {/* Main Content Area */}
      <div className="glass-effect rounded-2xl p-1">
        <div className="flex border-b border-brand-primary/20">
            <button 
                onClick={() => setViewingFlags(true)} 
                className={`flex-1 py-3 text-center font-semibold ${viewingFlags ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-400'}`}
            >
                Flagged Match Review
            </button>
            <button 
                onClick={() => setViewingFlags(false)} 
                className={`flex-1 py-3 text-center font-semibold ${!viewingFlags ? 'text-brand-primary border-b-2 border-brand-primary' : 'text-gray-400'}`}
            >
                Organizer Payouts
            </button>
        </div>
        <div className="p-4">
            {viewingFlags ? (
                <FlaggedMatches />
            ) : (
                <div className="text-center py-10 text-gray-400">
                    <p>Organizer Payouts queue is empty.</p>
                </div>
            )}
        </div>
      </div>

    </div>
  );
};

export default AdminDashboard;
