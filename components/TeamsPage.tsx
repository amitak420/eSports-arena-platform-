import React, { useState } from 'react';
import { useAppContext } from '../App';
import { MOCK_TEAMS, MOCK_TEAM_LEADERBOARD } from '../constants';
import { User, Team, TeamLeaderboardEntry } from '../types';
import { UsersIcon, PlusIcon, TrophyIcon, GoldMedalIcon, SilverMedalIcon, BronzeMedalIcon } from './icons/UIIcons';

const TeamCard: React.FC<{team: Team, onJoin: () => void}> = ({ team, onJoin }) => (
    <div className="glass-effect rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300 text-lg mr-4">
                {team.tag}
            </div>
            <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-100">{team.name}</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">{team.members.length} members</p>
            </div>
        </div>
        <button onClick={onJoin} className="bg-indigo-600 text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-md hover:bg-indigo-700 transition-colors">
            Join
        </button>
    </div>
);

const NoTeamView: React.FC = () => {
    const { updateCurrentUser, currentUser } = useAppContext();
    
    const handleJoin = (teamId: number) => {
        alert(`Request sent to join team!`);
        // In a real app, this would be an async request.
        // For demo, we can't actually change teams this way yet.
    };

    const handleCreate = () => {
        const teamName = prompt("Enter your new team's name:");
        if (teamName) {
            alert(`Team "${teamName}" created! You are the captain.`);
            // In a real app, this would create a new team and update the user.
        }
    };

    return (
        <div className="space-y-6">
            <div className="glass-effect rounded-2xl p-6 text-center">
                <UsersIcon className="w-12 h-12 mx-auto text-indigo-400 mb-2"/>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">You're Not on a Team Yet</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">Join a squad or create your own to start competing together!</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={handleCreate} className="bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform">
                        Create a Team
                    </button>
                    <button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform">
                        Browse Teams
                    </button>
                </div>
            </div>
            <div>
                <h3 className="text-white text-xl font-bold mb-3 px-2">Open Teams</h3>
                <div className="space-y-3">
                    {MOCK_TEAMS.map(team => <TeamCard key={team.id} team={team} onJoin={() => handleJoin(team.id)} />)}
                </div>
            </div>
        </div>
    );
};

const MemberRow: React.FC<{member: {name: string, role: 'captain' | 'member'}, isCaptainView: boolean, onKick: () => void}> = ({ member, isCaptainView, onKick }) => (
    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50/50 dark:hover:bg-gray-900/30">
        <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm ring-1 ring-white/50 mr-3">
                {member.name[0]}
            </div>
            <div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{member.name}</p>
                <p className={`text-xs font-semibold ${member.role === 'captain' ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-500 dark:text-gray-400'}`}>
                    {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </p>
            </div>
        </div>
        {isCaptainView && member.role !== 'captain' && (
            <button onClick={onKick} className="text-sm text-red-500 dark:text-red-400 font-semibold hover:underline">
                Kick
            </button>
        )}
    </div>
);

const TeamLeaderboardRow: React.FC<{entry: TeamLeaderboardEntry}> = ({ entry }) => {
    const getMedal = (rank: number) => {
        if (rank === 1) return <GoldMedalIcon className="w-6 h-6" />;
        if (rank === 2) return <SilverMedalIcon className="w-6 h-6" />;
        if (rank === 3) return <BronzeMedalIcon className="w-6 h-6" />;
        return <span className="text-gray-500 dark:text-gray-400 font-semibold text-sm">#{entry.rank}</span>;
    };
    return (
        <div className="flex items-center p-3 rounded-xl">
             <div className="w-10 text-center flex-shrink-0">{getMedal(entry.rank)}</div>
             <div className="flex items-center mx-3 flex-1">
                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300 mr-3">
                    {entry.team.tag}
                </div>
                <p className="font-bold text-gray-800 dark:text-gray-100">{entry.team.name}</p>
            </div>
            <div className="text-right">
                <p className="font-extrabold text-lg text-indigo-600 dark:text-indigo-400">
                    {entry.metric === 'Earnings' ? `₹${entry.value.toLocaleString()}` : entry.value.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 -mt-1">{entry.metric}</p>
            </div>
        </div>
    );
};

const MyTeamView: React.FC<{team: Team}> = ({ team }) => {
    const { currentUser } = useAppContext();
    const [activeTab, setActiveTab] = useState<'roster' | 'leaderboard'>('roster');
    const isCaptain = currentUser?.teamRole === 'captain';

    return (
        <div className="space-y-4">
            <div className="glass-effect rounded-2xl p-5 text-center">
                <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300 text-3xl mx-auto shadow-lg">
                    {team.tag}
                </div>
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white mt-3">{team.name}</h2>
                <div className="grid grid-cols-3 gap-4 mt-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">#{team.stats.rank}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Rank</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">{team.stats.wins}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Wins</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">₹{team.stats.earnings.toLocaleString()}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Earnings</p>
                    </div>
                </div>
            </div>

            <div className="glass-effect p-1 rounded-full flex space-x-1">
                <button onClick={() => setActiveTab('roster')} className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'roster' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                    Roster
                </button>
                <button onClick={() => setActiveTab('leaderboard')} className={`w-1/2 px-4 py-2 rounded-full text-sm font-semibold transition-colors ${activeTab === 'leaderboard' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 dark:text-gray-300'}`}>
                    Leaderboard
                </button>
            </div>

            <div className="glass-effect rounded-2xl p-3">
                {activeTab === 'roster' ? (
                    <div>
                        <div className="flex justify-between items-center p-2">
                             <h3 className="font-bold text-gray-800 dark:text-gray-100">Members ({team.members.length})</h3>
                             {isCaptain && <button onClick={() => alert("Invite link copied!")} className="flex items-center gap-1 bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 px-3 py-1.5 rounded-lg font-semibold text-sm"><PlusIcon className="w-4 h-4" /> Invite</button>}
                        </div>
                        <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                            {team.members.map(member => (
                                <MemberRow key={member.name} member={member} isCaptainView={isCaptain} onKick={() => alert(`Kicked ${member.name}!`)} />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div>
                         <div className="p-2 flex items-center gap-2">
                            <TrophyIcon className="w-5 h-5 text-gray-600 dark:text-gray-300"/>
                            <h3 className="font-bold text-gray-800 dark:text-gray-100">Team Rankings</h3>
                         </div>
                         <div className="divide-y divide-gray-200/50 dark:divide-gray-700/50">
                            {MOCK_TEAM_LEADERBOARD.filter(e => e.metric === 'Earnings').slice(0, 5).map(entry => (
                                <TeamLeaderboardRow key={entry.rank + entry.team.name} entry={entry} />
                            ))}
                         </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const TeamsPage: React.FC = () => {
  const { currentUser } = useAppContext();
  
  const userTeam = MOCK_TEAMS.find(team => team.id === currentUser?.teamId);

  return (
    <div className="p-4">
      {currentUser && userTeam ? <MyTeamView team={userTeam} /> : <NoTeamView />}
    </div>
  );
};

export default TeamsPage;
