import React from 'react';

export interface Tournament {
  id: string;
  organizerName: string;
  game: Game;
  name: string;
  prizePool: number;
  entryFee: number;
  participants: number;
  maxParticipants: number;
  mode: 'Solo' | 'Duo' | 'Squad';
  startTime: Date;
  isRecommended?: boolean;
  rules?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface Game {
    id: string;
    name: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    bannerUrl: string;
}

export interface ChatMessage {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    isTyping?: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  pricePeriod: 'mo' | 'qtr' | 'yr';
  features: string[];
  platformFee?: number; // Only for organizers
  forRole: 'player' | 'organizer';
}

export interface UserSubscription {
  planId: string;
  startDate: Date;
  endDate: Date;
}

export interface UserWallet {
  balance: number;
  transactions: {
    id: string;
    type: 'deposit' | 'withdrawal' | 'entry-fee' | 'payout';
    amount: number;
    description: string;
    timestamp: Date;
  }[];
}

export interface UserAchievement {
  id: string; // e.g., 'first-win', '5-day-streak'
  name: string;
  description: string;
  unlocked: boolean;
  date?: Date;
}

export interface User {
  uid: string;
  name: string;
  role: 'player' | 'organizer' | 'admin';
  avatarUrl?: string | null;
  gameId?: string; // e.g., In-game name
  subscription: UserSubscription | null;
  wallet: UserWallet;
  achievements: UserAchievement[];
  joinedTournaments: string[];
  // FIX: Add missing properties to User type
  favoriteGames?: string[];
  teamId?: string;
  teamRole?: 'captain' | 'member';
}

export interface MatchData {
  matchId: string;
  tournamentId: string;
  playerName: string;
  kills: number;
  deaths: number;
  headshotPercentage: number;
  accuracy: number; // Overall accuracy percentage
  previousMatchAccuracy: number; // For comparison
  hasReplay: boolean;
  ipAddress: string;
}

export interface AdminFlag {
  matchId: string;
  playerName: string;
  suspicionScore: number;
  reasons: string[];
  status: 'pending' | 'approved' | 'banned';
  evidence?: {
    type: 'image' | 'video';
    url: string; // Placeholder URL
  }[];
}

export interface Notification {
  id: number;
  message: string;
  timestamp: Date;
  read: boolean;
  tournamentId?: string;
}

// FIX: Add missing Team type
export interface Team {
  id: string;
  name: string;
  tag: string;
  members: { name: string; role: 'captain' | 'member' }[];
  stats: {
    rank: number;
    wins: number;
    earnings: number;
  };
}

// FIX: Add missing LeaderboardEntry type
export interface LeaderboardEntry {
  rank: number;
  player: { name: string; avatarUrl?: string };
  metric: 'Earnings' | 'Kills' | 'Wins';
  value: number;
  gameId: string;
  period: 'weekly' | 'monthly' | 'all-time';
}

// FIX: Add missing TeamLeaderboardEntry type
export interface TeamLeaderboardEntry {
  rank: number;
  team: { id: string; name: string; tag: string; };
  metric: 'Earnings' | 'Wins';
  value: number;
}