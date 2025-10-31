import React, { useState, useEffect } from 'react';
import { GAMES } from '../constants';
import TournamentCard from './TournamentCard';
import { Page } from '../App';
import { Tournament } from '../types';
import { getTournamentsStream } from '../services/firestoreService';

interface TournamentListPageProps {
  setCurrentPage: (page: Page) => void;
  viewTournamentDetail: (tournament: Tournament) => void;
}

const TournamentListPage: React.FC<TournamentListPageProps> = ({ viewTournamentDetail }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Subscribe to the real-time tournament stream from Firestore
    const unsubscribe = getTournamentsStream((fetchedTournaments) => {
      // Sort tournaments by start time
      const sorted = fetchedTournaments.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      setTournaments(sorted);
      setLoading(false);
    });

    // Unsubscribe when the component unmounts to prevent memory leaks
    return () => unsubscribe();
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

        {loading ? (
            <div className="text-center py-10 text-white">
                <p>Loading Tournaments...</p>
            </div>
        ) : (
            <div className="space-y-3">
                {tournaments.map(tournament => (
                    <TournamentCard key={tournament.id} tournament={tournament} onViewDetail={viewTournamentDetail} />
                ))}
            </div>
        )}
    </div>
  );
};

export default TournamentListPage;