import { MatchData, AdminFlag } from '../types';
import { getAllMatches, getMatchesByPlayer } from './mockFirebase';

/**
 * MOCK AI ANTI-CHEAT ENGINE
 *
 * This service runs simple heuristic checks on mock match data to generate
 * a "Suspicion Score" and identify potentially unfair play.
 */

export const calculateSuspicionScore = (match: MatchData): { score: number; reasons: string[] } => {
  let score = 0;
  const reasons: string[] = [];

  // Rule 1: High Headshot % and K/D Ratio
  const kdRatio = match.deaths > 0 ? match.kills / match.deaths : match.kills;
  if (match.headshotPercentage > 80 && kdRatio > 10) {
    score += 60;
    reasons.push(`Unusually high K/D (${kdRatio.toFixed(1)}) with high HS% (${match.headshotPercentage}%)`);
  }

  // Rule 2: Sudden Accuracy Spike
  if (match.previousMatchAccuracy > 0 && match.accuracy > match.previousMatchAccuracy * 3) {
    score += 30;
    reasons.push(`Accuracy spiked 3x+ from previous match (${match.previousMatchAccuracy}% -> ${match.accuracy}%)`);
  }

  // Rule 3: Missing Replay for a paid match
  if (!match.hasReplay) {
    score += 40;
    reasons.push('Missing match replay file');
  }

  // Rule 4: IP Mismatch (mock rule, just an example)
  // In a real scenario, this would compare against a history of IPs.
  // For this mock, we'll just add a small score for a specific IP.
  if (match.ipAddress === '2.2.2.2') {
    score += 20;
    reasons.push('IP address differs from account region (mock rule)');
  }
  
  return { score: Math.min(100, score), reasons };
};

/**
 * Analyzes all match data and returns a list of flagged matches for admin review.
 */
export const getFlaggedMatches = (): AdminFlag[] => {
  const allMatches = getAllMatches();
  const flaggedMatches: AdminFlag[] = [];

  allMatches.forEach(match => {
    const { score, reasons } = calculateSuspicionScore(match);
    if (score >= 60) {
      flaggedMatches.push({
        matchId: match.matchId,
        playerName: match.playerName,
        suspicionScore: score,
        reasons,
        status: 'pending',
        evidence: [{ type: 'image', url: 'https://placehold.co/400x200?text=Match+Screenshot' }]
      });
    }
  });

  return flaggedMatches.sort((a, b) => b.suspicionScore - a.suspicionScore);
};

/**
 * Determines if a player has a "Fair Play" badge.
 */
export const hasFairPlayBadge = (playerName: string): boolean => {
    const playerMatches = getMatchesByPlayer(playerName);
    if (playerMatches.length < 10) return false;

    const cleanMatches = playerMatches.filter(m => calculateSuspicionScore(m).score < 60);
    return cleanMatches.length >= 10;
};
