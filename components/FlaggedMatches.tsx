import React, { useState } from 'react';
import { getFlaggedMatches } from '../services/antiCheatService';
import { AdminFlag } from '../types';

const FlaggedMatchCard: React.FC<{ flag: AdminFlag }> = ({ flag }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-red-400';
    if (score >= 75) return 'text-orange-400';
    return 'text-yellow-400';
  };

  return (
    <div className="bg-brand-bg/50 rounded-lg p-4 border border-brand-primary/20">
      <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div>
          <p className="font-bold text-white">{flag.playerName}</p>
          <p className="text-xs text-gray-400">Match ID: {flag.matchId}</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${getScoreColor(flag.suspicionScore)}`}>{flag.suspicionScore}</p>
          <p className="text-xs text-gray-400">Suspicion Score</p>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-brand-primary/10">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Reasons for Flag:</h4>
          <ul className="list-disc list-inside text-xs text-red-300 space-y-1">
            {flag.reasons.map((reason, i) => <li key={i}>{reason}</li>)}
          </ul>
          <h4 className="text-sm font-semibold text-gray-300 mt-4 mb-2">Evidence:</h4>
          <img src={flag.evidence?.[0].url} alt="Match Evidence" className="rounded-md" />
          <div className="flex gap-4 mt-4">
            <button className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold">Approve Result</button>
            <button className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold">Ban Player</button>
          </div>
        </div>
      )}
    </div>
  );
};


const FlaggedMatches: React.FC = () => {
  const flaggedMatches = getFlaggedMatches();

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Flagged Matches Review</h2>
      {flaggedMatches.length > 0 ? (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {flaggedMatches.map(flag => (
            <FlaggedMatchCard key={flag.matchId} flag={flag} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <p className="font-semibold">No matches are currently flagged.</p>
          <p className="text-sm">The anti-cheat system is watching...</p>
        </div>
      )}
    </div>
  );
};

export default FlaggedMatches;
