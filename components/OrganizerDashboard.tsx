import React, { useState } from 'react';
import { Page, useAppContext } from '../App';
import { getTournaments } from '../services/mockFirebase';
import { Tournament } from '../types';
import { PlusIcon, DollarSignIcon, UsersIcon, TrophyIcon, ShieldCheckIcon } from './icons/UIIcons';

interface OrganizerDashboardProps {
  setCurrentPage: (page: Page) => void;
}

const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
  <div className="glass-effect rounded-xl p-4 flex items-center space-x-3">
    <div className="text-brand-accent w-8 h-8 flex-shrink-0">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-white">{value}</p>
      <p className="text-xs text-gray-400 font-medium">{label}</p>
    </div>
  </div>
);

const TournamentRow: React.FC<{ tournament: Tournament }> = ({ tournament }) => (
  <div className="flex justify-between items-center py-3 border-b border-brand-primary/10 last:border-b-0">
    <div>
      <p className="font-semibold text-white">{tournament.name}</p>
      <p className="text-xs text-gray-400">{tournament.game.name} • {tournament.startTime.toLocaleDateString()}</p>
    </div>
    <div className="text-right">
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
        tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300' :
        tournament.status === 'ongoing' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
      }`}>
        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
      </span>
      <p className="text-sm text-gray-300">{tournament.participants}/{tournament.maxParticipants}</p>
    </div>
  </div>
);

const OrganizerDashboard: React.FC<OrganizerDashboardProps> = ({ setCurrentPage }) => {
  const { currentUser } = useAppContext();
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'ongoing' | 'completed'>('all');

  if (!currentUser || currentUser.role !== 'organizer') {
    return <div className="p-4 text-center text-white">Access Denied.</div>;
  }

  const organizerTournaments = getTournaments().filter(t => t.organizerName === currentUser.name);
  const filteredTournaments = filter === 'all' ? organizerTournaments : organizerTournaments.filter(t => t.status === filter);
  
  const totalPrize = organizerTournaments.reduce((sum, t) => sum + t.prizePool, 0);
  const totalPlayers = organizerTournaments.reduce((sum, t) => sum + t.participants, 0);

  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Organizer Dashboard</h1>
        <p className="text-gray-400">Welcome back, {currentUser.name}!</p>
      </div>

      {/* Create Tournament CTA */}
      <button
        onClick={() => setCurrentPage('create-wizard')}
        className="w-full bg-gradient-to-r from-brand-primary to-brand-accent text-white py-4 px-8 rounded-xl font-semibold text-lg neon-glow flex items-center justify-center gap-2"
      >
        <PlusIcon className="w-6 h-6" />
        Create New Tournament
      </button>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard value={organizerTournaments.length.toString()} label="Tournaments Hosted" icon={<TrophyIcon className="w-full h-full"/>} />
        <StatCard value={totalPlayers.toLocaleString()} label="Total Players" icon={<UsersIcon className="w-full h-full"/>} />
        <StatCard value={`₹${totalPrize.toLocaleString()}`} label="Total Prize Pool" icon={<DollarSignIcon className="w-full h-full"/>} />
      </div>

      {/* Subscription Status */}
      <div className="glass-effect rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-lg">Your Plan: <span className="text-brand-primary">{currentUser.subscription?.planId.split('-')[1] || 'Free'} Tier</span></h3>
            <p className="text-sm text-gray-300">Upgrade to lower your platform fees and unlock more features.</p>
          </div>
          <button onClick={() => setCurrentPage('subscriptions')} className="w-full sm:w-auto bg-brand-secondary text-white py-2.5 px-6 rounded-lg font-semibold neon-glow flex-shrink-0">
            View Plans
          </button>
      </div>

      {/* Manage Tournaments */}
      <div className="glass-effect rounded-2xl p-5">
        <h3 className="font-bold text-white mb-3 text-lg">Manage Tournaments</h3>
        <div className="flex gap-2 mb-3 border-b border-brand-primary/10 pb-3 overflow-x-auto">
          {(['all', 'upcoming', 'ongoing', 'completed'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1 text-sm rounded-full whitespace-nowrap ${filter === f ? 'bg-brand-primary text-white' : 'bg-brand-bg/50 text-gray-300'}`}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="space-y-1 max-h-64 overflow-y-auto pr-2">
            {filteredTournaments.length > 0 ? (
                filteredTournaments.map(t => <TournamentRow key={t.id} tournament={t} />)
            ) : (
                <p className="text-center text-sm text-gray-500 py-6">No tournaments found for this filter.</p>
            )}
        </div>
      </div>
       {/* Payouts Section */}
        <div className="glass-effect rounded-2xl p-5">
            <h3 className="font-bold text-white text-lg mb-2">Payouts & Escrow</h3>
            <div className="bg-brand-bg/50 rounded-xl p-4 flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-300">Available Balance</p>
                    <p className="text-3xl font-bold text-green-400">₹{currentUser.wallet.balance.toLocaleString()}</p>
                </div>
                <button className="bg-green-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold neon-glow">
                    Withdraw Funds
                </button>
            </div>
        </div>
    </div>
  );
};

export default OrganizerDashboard;
