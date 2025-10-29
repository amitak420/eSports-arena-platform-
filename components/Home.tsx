import React from 'react';
import { Page, useAppContext } from '../App';
import { MOCK_TOURNAMENTS } from '../constants';
import { Tournament } from '../types';
import { getTournaments } from '../services/mockFirebase';

interface HomeProps {
  setCurrentPage: (page: Page) => void;
  viewTournamentDetail: (tournament: Tournament) => void;
}

const Home: React.FC<HomeProps> = ({ setCurrentPage, viewTournamentDetail }) => {
  const allTournaments = getTournaments();
  const featuredTournaments = allTournaments.filter(t => t.isRecommended).slice(0, 2);
  const { currentUser } = useAppContext();

  return (
    <div id="home" className="p-4 space-y-8">
      {/* Hero Section */}
      <div className="text-center pt-8 pb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 animate-fadeIn">
          Host or Join <span className="text-brand-primary">Esports Tournaments</span> 🎮
        </h1>
        <p className="text-gray-300 max-w-xl mx-auto mb-8">
          India ka sabse awesome platform, jahan daily action hota hai. Apni team banao aur jeetna shuru karo!
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          {currentUser?.role === 'organizer' && (
            <button
              // FIX: Changed 'create' to 'create-wizard' to match the correct page name.
              onClick={() => setCurrentPage('create-wizard')}
              className="w-full sm:w-auto bg-gradient-to-r from-brand-primary to-brand-accent text-white py-3 px-8 rounded-full font-semibold text-lg neon-glow"
            >
              Apna Match Shuru Karo
            </button>
          )}
           <button
            onClick={() => setCurrentPage('tournaments')}
            className="w-full sm:w-auto bg-white/10 border border-brand-primary/50 text-white py-3 px-8 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors"
          >
            Tournament Join Karlo
          </button>
        </div>
      </div>

      {/* Featured Tournaments Section */}
      {featuredTournaments.length > 0 && (
        <div>
            <h3 className="text-white text-xl font-bold mb-3 px-2">Featured Tournaments 🔥</h3>
            <div className="space-y-4">
                {featuredTournaments.map(t => (
                   <div key={t.id} className="tournament-card glass-effect rounded-xl p-4 cursor-pointer" onClick={() => viewTournamentDetail(t)}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h4 className="font-bold text-white">{t.name}</h4>
                                <p className="text-sm text-gray-400">{t.game.name} • {t.mode}</p>
                            </div>
                            <p className="text-lg font-bold text-brand-primary">₹{t.prizePool.toLocaleString()}</p>
                        </div>
                   </div>
                ))}
            </div>
        </div>
      )}

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-4">
            <div className="glass-effect rounded-xl p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-brand-primary">12K+</p>
                <p className="text-xs text-gray-400 font-medium">Active Players</p>
            </div>
            <div className="glass-effect rounded-xl p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-green-400">₹2L+</p>
                <p className="text-xs text-gray-400 font-medium">Prizes Awarded</p>
            </div>
            <div className="glass-effect rounded-xl p-4 text-center">
                <p className="text-2xl md:text-3xl font-bold text-brand-accent">150+</p>
                <p className="text-xs text-gray-400 font-medium">Daily Matches</p>
            </div>
        </div>
    </div>
  );
};

export default Home;
