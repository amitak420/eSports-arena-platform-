import React from 'react';
import { Page, useAppContext } from '../App';
import { ShieldCheckIcon, StarIcon, TrophyIcon, WalletIcon } from './icons/UIIcons';
import { hasFairPlayBadge } from '../services/antiCheatService';
import { getTournaments } from '../services/mockFirebase';
import { Tournament } from '../types';

interface PlayerDashboardProps {
  setCurrentPage: (page: Page) => void;
  viewTournamentDetail: (tournament: Tournament) => void;
}

const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode }> = ({ value, label, icon }) => (
  <div className="glass-effect rounded-xl p-4 text-center">
    <div className="text-brand-accent mx-auto w-8 h-8 mb-2">{icon}</div>
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-xs text-gray-400 font-medium">{label}</p>
  </div>
);

const TransactionRow: React.FC<{ tx: { type: string, amount: number, description: string, timestamp: Date } }> = ({ tx }) => (
  <div className="flex justify-between items-center py-2 border-b border-brand-primary/10 last:border-b-0">
    <div>
      <p className="font-semibold text-white capitalize">{tx.description}</p>
      <p className="text-xs text-gray-400">{tx.timestamp.toLocaleDateString()}</p>
    </div>
    <p className={`font-bold ${tx.type === 'payout' || tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'}`}>
      {tx.type === 'payout' || tx.type === 'deposit' ? '+' : '-'}₹{tx.amount.toLocaleString()}
    </p>
  </div>
);

const MiniTournamentCard: React.FC<{ tournament: Tournament, onSelect: () => void }> = ({ tournament, onSelect }) => (
  <div onClick={onSelect} className="glass-effect rounded-xl p-3 flex items-center justify-between cursor-pointer hover:bg-brand-primary/10 transition-colors">
    <div className="flex items-center space-x-3 overflow-hidden">
      <div className="w-10 h-10 bg-brand-bg/80 rounded-lg flex items-center justify-center flex-shrink-0">
        <tournament.game.icon className="w-6 h-6" />
      </div>
      <div className="truncate">
        <p className="font-bold text-white text-sm truncate">{tournament.name}</p>
        <p className="text-xs text-gray-400">{tournament.startTime.toLocaleString([], {weekday: 'short', hour: '2-digit', minute:'2-digit'})}</p>
      </div>
    </div>
    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${
        tournament.status === 'upcoming' ? 'bg-blue-500/20 text-blue-300' :
        tournament.status === 'ongoing' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
      }`}>
        {tournament.status.charAt(0).toUpperCase() + tournament.status.slice(1)}
    </span>
  </div>
);


const PlayerDashboard: React.FC<PlayerDashboardProps> = ({ setCurrentPage, viewTournamentDetail }) => {
  const { currentUser } = useAppContext();
  const isFairPlayer = currentUser ? hasFairPlayBadge(currentUser.name) : false;

  const allTournaments = getTournaments();
  const joinedTournaments = currentUser 
    ? allTournaments.filter(t => currentUser.joinedTournaments.includes(t.id.toString()))
    : [];

  if (!currentUser) {
    return <div className="p-4 text-center text-white">Loading player data...</div>;
  }
  
  const hasAdfree = currentUser.subscription?.planId === 'player-adfree';

  return (
    <div className="p-4 space-y-6">
      {/* Profile Header */}
      <div className="glass-effect rounded-2xl p-5 flex items-center space-x-4">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-secondary to-brand-accent rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg ring-2 ring-brand-primary/50">
          <span>{currentUser.name[0].toUpperCase()}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">{currentUser.name}</h2>
          <p className="text-gray-400">{currentUser.gameId}</p>
          <div className="flex items-center mt-2 space-x-2">
            {isFairPlayer && (
              <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded-full font-medium">
                <ShieldCheckIcon className="w-4 h-4" /> Fair Play
              </span>
            )}
             {hasAdfree && (
              <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded-full font-medium">
                <StarIcon className="w-4 h-4" /> Ad-Free
              </span>
            )}
          </div>
        </div>
      </div>
      
      {/* Key Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard value={currentUser.joinedTournaments.length.toString()} label="Matches Played" icon={<TrophyIcon className="w-full h-full"/>} />
        <StatCard value="12" label="Wins" icon={<TrophyIcon className="w-full h-full"/>} />
        <StatCard value={`₹${currentUser.wallet.balance.toLocaleString()}`} label="Total Winnings" icon={<WalletIcon className="w-full h-full"/>} />
      </div>

      {/* My Tournaments */}
      <div className="glass-effect rounded-2xl p-5">
        <h3 className="font-bold text-white mb-3 text-lg">My Tournaments</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
          {joinedTournaments.length > 0 ? (
            joinedTournaments.map(t => <MiniTournamentCard key={t.id} tournament={t} onSelect={() => viewTournamentDetail(t)} />)
          ) : (
            <div className="text-center py-6">
              <p className="text-sm text-gray-400">You haven't joined any tournaments yet.</p>
              <button onClick={() => setCurrentPage('tournaments')} className="mt-2 text-brand-primary font-semibold hover:underline">Explore Now!</button>
            </div>
          )}
        </div>
      </div>

      {/* Wallet */}
      <div className="glass-effect rounded-2xl p-5">
        <h3 className="font-bold text-white mb-3 text-lg">Wallet</h3>
        <div className="bg-brand-bg/50 rounded-xl p-4 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-300">Current Balance</p>
            <p className="text-3xl font-bold text-brand-primary">₹{currentUser.wallet.balance.toLocaleString()}</p>
          </div>
          <button className="bg-brand-secondary text-white px-5 py-2.5 rounded-lg text-sm font-semibold neon-glow">
            Withdraw 💰
          </button>
        </div>
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Recent Transactions</h4>
          <div className="space-y-1 max-h-40 overflow-y-auto pr-2">
            {currentUser.wallet.transactions.length > 0 ? (
                currentUser.wallet.transactions.map(tx => <TransactionRow key={tx.id} tx={tx} />)
            ) : (
                <p className="text-center text-sm text-gray-500 py-4">No recent transactions.</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Ad-Free Subscription CTA */}
      {!hasAdfree && (
        <div className="glass-effect rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-white text-lg">Go Ad-Free!</h3>
            <p className="text-sm text-gray-300">Get an uninterrupted experience and an exclusive profile badge.</p>
          </div>
          <button onClick={() => setCurrentPage('subscriptions')} className="w-full sm:w-auto bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-2.5 px-6 rounded-lg font-semibold neon-glow flex-shrink-0">
            Upgrade Now
          </button>
        </div>
      )}

    </div>
  );
};

export default PlayerDashboard;