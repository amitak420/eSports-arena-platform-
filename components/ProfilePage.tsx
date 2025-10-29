import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../App';
// FIX: Added MOCK_TEAMS import
import { GAMES, MOCK_TEAMS } from '../constants';
import { CameraIcon, UsersIcon } from './icons/UIIcons';

const PerformanceItem: React.FC<{title: string, time: string, rank: string, rankBg: string}> = ({title, time, rank, rankBg}) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-200/80 dark:border-gray-700/80 last:border-b-0">
        <div>
            <p className="font-semibold text-gray-700 dark:text-gray-200">{title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{time}</p>
        </div>
        <span className={`${rankBg} px-3 py-1 rounded-full text-sm font-semibold`}>{rank}</span>
    </div>
);


const ProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUser } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  
  const [editedName, setEditedName] = useState('');
  const [editedAvatar, setEditedAvatar] = useState<string | null | undefined>(null);
  const [editedGames, setEditedGames] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setEditedName(currentUser.name);
      setEditedAvatar(currentUser.avatarUrl);
      // FIX: Use optional chaining as favoriteGames is an optional property
      setEditedGames(currentUser.favoriteGames || []);
    }
  }, [currentUser]);
  
  const handleEdit = () => {
    if (currentUser) {
        setEditedName(currentUser.name);
        setEditedAvatar(currentUser.avatarUrl);
        // FIX: Use optional chaining as favoriteGames is an optional property
        setEditedGames(currentUser.favoriteGames || []);
    }
    setIsEditing(true);
  };
  
  const handleCancel = () => {
    setIsEditing(false);
  };
  
  const handleSave = () => {
    if (currentUser) {
        // FIX: Update new user properties
        updateCurrentUser({
            name: editedName,
            avatarUrl: editedAvatar,
            favoriteGames: editedGames,
        });
    }
    setIsEditing(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedAvatar(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  const handleGameToggle = (gameId: string) => {
    setEditedGames(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId)
        : [...prev, gameId]
    );
  };
  
  if (!currentUser) {
    return (
        <div className="p-4 text-center text-white">
            <p>You need to be logged in to view your profile.</p>
        </div>
    );
  }

  // FIX: Use optional chaining for favoriteGames and teamId
  const favoriteGameDetails = GAMES.filter(g => currentUser.favoriteGames?.includes(g.id));
  const userTeam = MOCK_TEAMS.find(t => t.id === currentUser.teamId);

  return (
    <div className="p-4 space-y-6">
        <div className="glass-effect rounded-2xl p-5">
            <div className="flex justify-between items-start">
                <div className="flex items-center">
                    <div className="relative">
                        <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                        {(isEditing ? editedAvatar : currentUser.avatarUrl) ? (
                            <img src={(isEditing ? editedAvatar : currentUser.avatarUrl)!} alt="Profile" className="w-20 h-20 rounded-full object-cover mr-4 shadow-lg ring-2 ring-white/50 dark:ring-gray-900/50" />
                        ) : (
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold mr-4 shadow-lg ring-2 ring-white/50 dark:ring-gray-900/50">
                                <span>{(isEditing ? editedName : currentUser.name)[0].toUpperCase()}</span>
                            </div>
                        )}
                        {isEditing && (
                            <button onClick={triggerFileSelect} className="absolute bottom-0 right-3 bg-white/80 dark:bg-gray-200 rounded-full p-1.5 shadow-md hover:bg-white dark:hover:bg-gray-300 transition-transform transform hover:scale-110">
                                <CameraIcon className="w-5 h-5 text-indigo-600" />
                            </button>
                        )}
                    </div>
                    <div>
                        {isEditing ? (
                             <input 
                                type="text" 
                                value={editedName} 
                                onChange={(e) => setEditedName(e.target.value)} 
                                className="text-2xl font-bold text-gray-800 dark:text-white bg-transparent border-b-2 border-indigo-300 dark:border-indigo-500 focus:outline-none w-full"
                              />
                        ) : (
                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{currentUser.name}</h2>
                        )}
                        <p className="text-gray-600 dark:text-gray-400">Level 5 • Pro Player</p>
                        <div className="flex items-center mt-1.5">
                            <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 px-2 py-1 rounded-full font-medium">Verified Player</span>
                        </div>
                    </div>
                </div>
                {!isEditing && (
                    <button onClick={handleEdit} className="bg-indigo-100 dark:bg-gray-700 text-indigo-600 dark:text-indigo-300 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-indigo-200 dark:hover:bg-gray-600 transition-colors flex-shrink-0">
                        Edit
                    </button>
                )}
            </div>

            <div className="grid grid-cols-3 gap-4 mt-5">
                <div className="text-center">
                    <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">23</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Matches</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-green-600 dark:text-green-400">8</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Wins</p>
                </div>
                <div className="text-center">
                    <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">₹3.5K</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">Earnings</p>
                </div>
            </div>
        </div>

        {userTeam && (
            <div className="glass-effect rounded-2xl p-5">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg">My Team</h3>
                        <div className="flex items-center space-x-2 mt-1">
                            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center font-bold text-indigo-600 dark:text-indigo-300">
                                {userTeam.tag}
                            </div>
                            <span className="font-semibold text-gray-700 dark:text-gray-200">{userTeam.name}</span>
                        </div>
                    </div>
                    <UsersIcon className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                </div>
            </div>
        )}

        <div className="glass-effect rounded-2xl p-5">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-3 text-lg">Favorite Games</h3>
            {isEditing ? (
                <div className="space-y-3">
                    {GAMES.map(game => (
                        <label key={game.id} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50/50 dark:bg-gray-900/30 cursor-pointer hover:bg-gray-100/50 dark:hover:bg-gray-700/50 transition-colors">
                        <input 
                            type="checkbox"
                            checked={editedGames.includes(game.id)}
                            onChange={() => handleGameToggle(game.id)}
                            className="form-checkbox h-5 w-5 text-indigo-600 bg-gray-200 dark:bg-gray-600 rounded border-gray-300 dark:border-gray-500 focus:ring-indigo-500"
                        />
                        <game.icon className="w-6 h-6 flex-shrink-0" />
                        <span className="font-medium text-gray-700 dark:text-gray-200">{game.name}</span>
                        </label>
                    ))}
                </div>
            ) : (
                (currentUser.favoriteGames && currentUser.favoriteGames.length > 0) ? (
                <div className="flex flex-wrap gap-2">
                    {favoriteGameDetails.map(game => (
                    <div key={game.id} className="flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-200 px-3 py-1.5 rounded-full font-medium">
                        <game.icon className="w-5 h-5" />
                        <span>{game.name}</span>
                    </div>
                    ))}
                </div>
                ) : (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No favorite games selected. Edit your profile to add some!</p>
                )
            )}
        </div>

        {isEditing && (
        <div className="flex gap-4">
            <button onClick={handleSave} className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3.5 rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform">
                Save Changes
            </button>
            <button onClick={handleCancel} className="w-full glass-effect py-3.5 rounded-xl font-semibold text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-gray-700/80 transition-colors">
                Cancel
            </button>
        </div>
        )}

        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-2xl p-5 shadow-lg">
            <div className="flex justify-between items-center">
                <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">Wallet Balance</p>
                    <p className="text-3xl font-bold text-gray-800 dark:text-white">₹850</p>
                </div>
                <button className="bg-white dark:bg-gray-700 px-5 py-2.5 rounded-lg text-sm font-semibold text-indigo-600 dark:text-indigo-300 shadow-md hover:bg-indigo-50 dark:hover:bg-gray-600 transition-colors">
                    Withdraw 💰
                </button>
            </div>
        </div>

        <div className="glass-effect rounded-2xl p-5">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 mb-2 text-lg">Recent Performance</h3>
            <div className="space-y-1">
                <PerformanceItem title="BGMI Weekly" time="2 days ago" rank="#2 🥈" rankBg="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"/>
                <PerformanceItem title="Free Fire Solo" time="5 days ago" rank="#1 🏆" rankBg="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300"/>
                <PerformanceItem title="COD Showdown" time="1 week ago" rank="#5" rankBg="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"/>
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;
