import React, { useState, useEffect } from 'react';
import { GAMES } from '../constants';
import TournamentCard from './TournamentCard';
import { Page } from '../App';
import { Tournament } from '../types';
import { getTournaments } from '../services/mockFirebase';

interface TournamentListPageProps {
  setCurrentPage: (page: Page) => void;
  viewTournamentDetail: (tournament: Tournament) => void;
}

const TournamentListPage: React.FC<TournamentListPageProps> = ({ viewTournamentDetail }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    // Fetch tournaments from our mock local storage service
    setTournaments(getTournaments());
  }, []);


  return (
    <div className="p-4">
        <h2 className="text-white text-2xl font-bold mb-4">Tournaments</h2>
        
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            <button className="bg-brand-secondary text-white px-4 py-2 rounded-full text-sm whitespace-nowrap">All Games</button>
            {GAMES.map(game => (
                <button key={game.id} className="glass-effect px-4 py-2 rounded-full text-sm whitespace-nowrap text-brand-text">{game.name}</button>
            ))}
        </div>

        <div className="space-y-3">
            {tournaments.map(tournament => (
                <TournamentCard key={tournament.id} tournament={tournament} onViewDetail={viewTournamentDetail} />
            ))}
        </div>
    </div>
  );
};

export default TournamentListPage;