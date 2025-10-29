import React, { useState, useMemo } from 'react';
import { MOCK_LEADERBOARD, GAMES } from '../constants';
import { LeaderboardEntry } from '../types';
import { GoldMedalIcon, SilverMedalIcon, BronzeMedalIcon } from './icons/UIIcons';

const FilterButton: React.FC<{label: string, isActive: boolean, onClick: () => void}> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors whitespace-nowrap ${
            isActive
                ? 'bg-indigo-600 text-white shadow-md'
                : 'glass-effect text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/80'
        }`}
    >
        {label}
    </button>
);

const PlayerRow: React.FC<{ entry: LeaderboardEntry }> = ({ entry }) => {
    const { rank, player, metric, value } = entry;

    const getMedal = (rank: number) => {
        if (rank === 1) return <GoldMedalIcon className="w-6 h-6" />;
        if (rank === 2) return <SilverMedalIcon className="w-6 h-6" />;
        if (rank === 3) return <BronzeMedalIcon className="w-6 h-6" />;
        return <span className="text-gray-500 dark:text-gray-400 font-semibold text-sm">#{rank}</span>;
    };
    
    const rankStyling = {
        1: 'bg-yellow-100/80 dark:bg-yellow-900/30 border-yellow-300/80 dark:border-yellow-700/50',
        2: 'bg-gray-200/80 dark:bg-gray-700/50 border-gray-300/80 dark:border-gray-600/50',
        3: 'bg-orange-200/50 dark:bg-orange-900/30 border-orange-300/80 dark:border-orange-700/50'
    }[rank] || 'glass-effect';


    return (
        <div className={`flex items-center p-3 rounded-xl transition-transform transform hover:scale-[1.02] ${rankStyling} ${rank <= 3 ? 'border' : ''}`}>
            <div className="w-10 text-center flex-shrink-0">
                {getMedal(rank)}
            </div>
            <div className="flex items-center mx-3 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-1 ring-white/50 mr-3">
                    {player.name[0]}
                </div>
                <div>
                    <p className="font-bold text-gray-800 dark:text-gray-100">{player.name}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{GAMES.find(g => g.id === entry.gameId)?.name}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">{metric === 'Earnings' ? `₹${Number(value).toLocaleString()}` : value.toLocaleString()}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">{metric}</p>
            </div>
        </div>
    );
};

const LeaderboardPage: React.FC = () => {
    const [selectedGame, setSelectedGame] = useState('all');
    const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'monthly' | 'all-time'>('weekly');

    const filteredLeaderboard = useMemo(() => {
        return MOCK_LEADERBOARD
            .filter(entry => entry.period === selectedPeriod)
            .filter(entry => selectedGame === 'all' || entry.gameId === selectedGame)
            .sort((a, b) => a.rank - b.rank);
    }, [selectedGame, selectedPeriod]);

    return (
        <div className="p-4 space-y-4">
            <div className="glass-effect rounded-2xl p-4 text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-1">Leaderboards 🏆</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300">See who's dominating the arena!</p>
            </div>

            <div className="glass-effect rounded-2xl p-3">
                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 px-1">Game</h3>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    <FilterButton label="All Games" isActive={selectedGame === 'all'} onClick={() => setSelectedGame('all')} />
                    {GAMES.map(game => (
                        <FilterButton key={game.id} label={game.name} isActive={selectedGame === game.id} onClick={() => setSelectedGame(game.id)} />
                    ))}
                </div>
            </div>

            <div className="glass-effect rounded-2xl p-3">
                 <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2 px-1">Time Period</h3>
                <div className="grid grid-cols-3 gap-2">
                    <FilterButton label="Weekly" isActive={selectedPeriod === 'weekly'} onClick={() => setSelectedPeriod('weekly')} />
                    <FilterButton label="Monthly" isActive={selectedPeriod === 'monthly'} onClick={() => setSelectedPeriod('monthly')} />
                    <FilterButton label="All-Time" isActive={selectedPeriod === 'all-time'} onClick={() => setSelectedPeriod('all-time')} />
                </div>
            </div>
            
            <div className="space-y-3">
                {filteredLeaderboard.length > 0 ? (
                    filteredLeaderboard.map(entry => (
                        <PlayerRow key={`${entry.period}-${entry.gameId}-${entry.rank}-${entry.player.name}`} entry={entry} />
                    ))
                ) : (
                    <div className="text-center py-10 glass-effect rounded-2xl">
                        <p className="text-gray-600 dark:text-gray-300 font-semibold">No rankings available.</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Try a different filter or check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaderboardPage;