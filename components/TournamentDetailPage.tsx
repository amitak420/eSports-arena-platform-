import React, { useState } from 'react';
import { Page, useAppContext } from '../App';
import { Tournament } from '../types';
import { BackIcon } from './icons/UIIcons';

interface TournamentDetailPageProps {
  tournament: Tournament;
  setCurrentPage: (page: Page) => void;
  isJoinFlow?: boolean;
}

const DetailRow: React.FC<{label: string, value: string | number}> = ({ label, value }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200/80 dark:border-gray-700/80">
        <span className="text-gray-600 dark:text-gray-400">{label}</span>
        <span className="font-semibold text-gray-800 dark:text-gray-100 text-right">{value}</span>
    </div>
);

const JoinFlow: React.FC<{tournament: Tournament, setCurrentPage: (page: Page) => void}> = ({ tournament, setCurrentPage }) => {
    const [ign, setIgn] = useState('');
    const { addNotification, currentUser, updateCurrentUser } = useAppContext();
    
    const processJoin = () => {
        if (!ign.trim()) {
            alert("Please enter your In-Game Name (IGN).");
            return;
        }

        // Add to user's joined tournaments
        if (currentUser && !currentUser.joinedTournaments.includes(tournament.id)) {
            updateCurrentUser({
                joinedTournaments: [...currentUser.joinedTournaments, tournament.id]
            });
        }

        // Add notifications
        addNotification({
            message: `Successfully joined "${tournament.name}"!`,
            tournamentId: tournament.id,
        });
        
        const timeToStart = Math.round((tournament.startTime.getTime() - Date.now()) / 60000);
        if (timeToStart > 0) {
           addNotification({
                message: `Reminder: "${tournament.name}" starts in ${timeToStart} minutes.`,
                tournamentId: tournament.id,
            });
        }
        
        alert(`Success! You've joined the tournament with IGN: ${ign}\nPayment simulation completed.`);
        setCurrentPage('tournaments');
    }
    return (
        <div className="mt-4">
             <div className="mb-4">
                <label htmlFor="ignInput" className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">In-Game Name (IGN)</label>
                <input 
                    id="ignInput"
                    type="text" 
                    value={ign}
                    onChange={(e) => setIgn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/80 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 text-gray-800 dark:text-white" 
                    placeholder="Enter your game username" 
                    required 
                />
            </div>
             <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 text-indigo-800 dark:bg-indigo-900/30 dark:border-indigo-700/50 dark:text-indigo-200">
                <div className="flex justify-between text-sm mb-1"><span>Entry Fee:</span><span className="font-semibold">₹{tournament.entryFee}</span></div>
                <div className="flex justify-between text-sm"><span>Platform Fee:</span><span className="font-semibold">₹{Math.round(tournament.entryFee * 0.1)}</span></div>
                <hr className="my-2 border-indigo-200 dark:border-indigo-700/50"/>
                <div className="flex justify-between font-bold"><span>Total Payable:</span><span>₹{tournament.entryFee + Math.round(tournament.entryFee * 0.1)}</span></div>
            </div>
            <div className="space-y-3">
                <button onClick={processJoin} className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform">
                    Pay & Join Tournament
                </button>
                <button onClick={() => setCurrentPage('tournament-detail')} className="w-full glass-effect py-3 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/80 transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    )
}

const TournamentDetailPage: React.FC<TournamentDetailPageProps> = ({ tournament, setCurrentPage, isJoinFlow = false }) => {
  const { currentUser } = useAppContext();
  
  if (!tournament) {
    return (
      <div className="p-4 text-white">
        Tournament not found. <button onClick={() => setCurrentPage('tournaments')} className="underline">Go back</button>.
      </div>
    );
  }

  const isAlreadyJoined = currentUser?.joinedTournaments.includes(tournament.id);

  return (
    <div className="p-4">
        <div className="glass-effect rounded-2xl p-5 mb-4">
            <div className="flex items-center mb-4">
                <button onClick={() => isJoinFlow ? setCurrentPage('tournament-detail') : setCurrentPage('tournaments')} className="mr-3 text-gray-600 dark:text-gray-300 p-1">
                    <BackIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white truncate">{isJoinFlow ? 'Confirm Your Entry' : tournament.name}</h2>
            </div>
            
            {!isJoinFlow ? (
                <>
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-5 text-white mb-6 shadow-lg">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <p className="text-sm opacity-80">Prize Pool</p>
                                <span className="text-3xl font-bold">₹{tournament.prizePool.toLocaleString()}</span>
                            </div>
                            <span className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-medium">{tournament.mode} Battle</span>
                        </div>
                        <p className="text-sm opacity-90 mt-1">Winner takes ₹{Math.round(tournament.prizePool * 0.5).toLocaleString()}!</p>
                    </div>

                    <div className="space-y-1 mb-6">
                        <DetailRow label="Entry Fee" value={tournament.entryFee > 0 ? `₹${tournament.entryFee}` : 'Free'} />
                        <DetailRow label="Participants" value={`${tournament.participants} / ${tournament.maxParticipants}`} />
                        <DetailRow label="Date & Time" value={tournament.startTime.toLocaleString([], {weekday: 'short', hour: '2-digit', minute:'2-digit'})} />
                        <DetailRow label="Game Map" value="Erangel (Default)" />
                    </div>

                    <div className="mb-6">
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-lg">Tournament Rules</h3>
                        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1.5 list-disc list-inside bg-gray-50/50 dark:bg-gray-900/30 p-4 rounded-lg">
                            <li>Room ID and Password shared 15 mins before start.</li>
                            <li>Emulators and cheating are strictly forbidden.</li>
                            <li>Players must join on time or face disqualification.</li>
                            <li>A final screenshot of results is required for prize claim.</li>
                        </ul>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <button 
                            onClick={() => setCurrentPage('join-flow')} 
                            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                            disabled={isAlreadyJoined}
                        >
                            {isAlreadyJoined ? 'Already Joined' : 'Join Tournament'}
                        </button>
                        <button className="glass-effect py-3.5 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/80 transition-colors">
                            Share 📤
                        </button>
                    </div>
                </>
            ) : (
                <JoinFlow tournament={tournament} setCurrentPage={setCurrentPage} />
            )}
        </div>
    </div>
  );
};

export default TournamentDetailPage;