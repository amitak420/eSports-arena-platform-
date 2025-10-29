import React, { useState, useEffect } from 'react';
import { Tournament } from '../types';

interface TournamentCardProps {
  tournament: Tournament;
  onViewDetail: (tournament: Tournament) => void;
}

const CountdownTimer: React.FC<{startTime: Date}> = ({ startTime }) => {
    const calculateTimeLeft = () => {
        const difference = startTime.getTime() - new Date().getTime();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                hours: Math.floor(difference / (1000 * 60 * 60)),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }
        return timeLeft as {hours?: number, minutes?: number, seconds?: number};
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearTimeout(timer);
    });

    if (!timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) {
        return <span className="text-xs bg-red-500/80 text-white px-2 py-1 rounded font-medium">Live Now</span>;
    }
    
    if(timeLeft.hours > 0) {
        return <span className="text-xs text-gray-400">Starts in {timeLeft.hours}h {timeLeft.minutes}m</span>
    }

    return <span className="text-sm font-mono text-brand-accent font-semibold tracking-wider">{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
}


const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onViewDetail }) => {
  const { game, name, prizePool, entryFee, participants, maxParticipants, mode } = tournament;

  return (
    <div 
      className="tournament-card glass-effect rounded-xl p-4 cursor-pointer" 
      onClick={() => onViewDetail(tournament)}
    >
        <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-secondary to-brand-accent rounded-xl flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md">
              <game.icon className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
                <h4 className="font-bold text-white leading-tight">{name}</h4>
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className="text-xs bg-green-500/20 text-green-300 px-2 py-1 rounded font-medium">{mode}</span>
                    <span className={`text-xs ${entryFee > 0 ? 'bg-blue-500/20 text-blue-300' : 'bg-purple-500/20 text-purple-300'} px-2 py-1 rounded font-medium`}>
                      {entryFee > 0 ? `₹${entryFee}` : 'Free'}
                    </span>
                    <span className="text-xs text-gray-400">{participants}/{maxParticipants}</span>
                </div>
            </div>
            <div className="text-right ml-2">
                <p className="text-xl font-extrabold text-brand-primary">₹{prizePool.toLocaleString()}</p>
                <p className="text-xs text-gray-400 -mt-1">Prize Pool</p>
            </div>
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-brand-primary/20">
            <CountdownTimer startTime={tournament.startTime} />
            <button className="bg-brand-secondary text-white px-5 py-1.5 rounded-full text-sm font-semibold shadow-md hover:bg-brand-accent transition-colors">
              {tournament.startTime.getTime() < Date.now() ? 'Dekho' : 'Join Karlo'}
            </button>
        </div>
    </div>
  );
};

export default TournamentCard;