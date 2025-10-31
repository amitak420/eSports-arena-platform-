import { Tournament, Game, SubscriptionPlan, MatchData, Team, LeaderboardEntry, TeamLeaderboardEntry } from './types';
import { BGMIIcon, ValorantIcon, FreeFireIcon, CODIcon } from './components/icons/GameIcons';

export const GAMES: Game[] = [
    { id: 'bgmi', name: 'BGMI', icon: BGMIIcon, bannerUrl: 'https://placehold.co/600x300/FBBF24/4B5563?text=BGMI&font=inter' },
    { id: 'valorant', name: 'Valorant', icon: ValorantIcon, bannerUrl: 'https://placehold.co/600x300/EF4444/FFFFFF?text=Valorant&font=inter' },
    { id: 'freefire', name: 'Free Fire', icon: FreeFireIcon, bannerUrl: 'https://placehold.co/600x300/F97316/FFFFFF?text=Free+Fire&font=inter' },
    { id: 'cod', name: 'COD Mobile', icon: CODIcon, bannerUrl: 'https://placehold.co/600x300/A8A29E/FFFFFF?text=COD+Mobile&font=inter' },
];

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: '1',
    organizerName: 'Mortal',
    game: GAMES[0],
    name: 'Morning Mayhem BGMI',
    prizePool: 5000,
    entryFee: 50,
    participants: 45,
    maxParticipants: 100,
    mode: 'Squad',
    startTime: new Date(Date.now() + 15 * 60000),
    isRecommended: true,
    status: 'upcoming',
  },
  {
    id: '2',
    organizerName: 'Pro Leaguers',
    game: GAMES[1],
    name: 'Valorant Vipers Weekly',
    prizePool: 10000,
    entryFee: 100,
    participants: 12,
    maxParticipants: 32,
    mode: 'Squad',
    startTime: new Date(Date.now() + 60 * 60000),
    status: 'upcoming',
  },
  {
    id: '3',
    organizerName: 'Mortal',
    game: GAMES[2],
    name: 'Free Fire Frenzy',
    prizePool: 2000,
    entryFee: 25,
    participants: 98,
    maxParticipants: 100,
    mode: 'Solo',
    startTime: new Date(Date.now() - 5 * 60000), // Started 5 mins ago
    status: 'ongoing',
  },
   {
    id: '4',
    organizerName: 'Pro Leaguers',
    game: GAMES[3],
    name: 'COD Mobile Solo King',
    prizePool: 3000,
    entryFee: 30,
    participants: 100,
    maxParticipants: 100,
    mode: 'Solo',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60000), // 2 days ago
    status: 'completed',
  },
];


export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  // Organizer Plans
  {
    id: 'org-free', name: 'Free Tier', price: 0, pricePeriod: 'mo',
    forRole: 'organizer', platformFee: 20,
    features: ['Unlimited free tournaments', '20% platform fee', 'Basic support']
  },
  {
    id: 'org-pro', name: 'Pro', price: 1499, pricePeriod: 'mo',
    forRole: 'organizer', platformFee: 10,
    features: ['All free features', '10% platform fee', 'Priority support', 'Live lobby view']
  },
  {
    id: 'org-enterprise', name: 'Enterprise', price: 6999, pricePeriod: 'qtr',
    forRole: 'organizer', platformFee: 5,
    features: ['All pro features', '5% platform fee', 'Custom branding', 'Bulk payouts']
  },
  // Player Plans
  {
    id: 'player-adfree', name: 'Ad-Free', price: 199, pricePeriod: 'mo',
    forRole: 'player',
    features: ['Remove all in-app ads', 'Exclusive profile badge', 'Priority matchmaking']
  },
];


export const MOCK_MATCH_DATA: MatchData[] = [
  // Clean Player
  { matchId: 'm1', tournamentId: '4', playerName: 'Player1', kills: 8, deaths: 2, headshotPercentage: 40, accuracy: 35, previousMatchAccuracy: 33, hasReplay: true, ipAddress: '1.1.1.1' },
  // Highly Suspicious Player
  { matchId: 'm2', tournamentId: '4', playerName: 'CheaterX', kills: 25, deaths: 1, headshotPercentage: 92, accuracy: 85, previousMatchAccuracy: 25, hasReplay: false, ipAddress: '2.2.2.2' },
  // Moderately Suspicious
  { matchId: 'm3', tournamentId: '4', playerName: 'MaybeSus', kills: 15, deaths: 3, headshotPercentage: 75, accuracy: 60, previousMatchAccuracy: 55, hasReplay: false, ipAddress: '3.3.3.3' },
   // Another Clean Player
  { matchId: 'm4', tournamentId: '4', playerName: 'FairPlayer', kills: 10, deaths: 3, headshotPercentage: 30, accuracy: 40, previousMatchAccuracy: 41, hasReplay: true, ipAddress: '4.4.4.4' },
];

// FIX: Add missing MOCK_TEAMS export
export const MOCK_TEAMS: Team[] = [
    { id: '1', name: 'Soul Reapers', tag: 'SR', members: [{ name: 'Player1', role: 'captain' }, { name: 'FairPlayer', role: 'member' }], stats: { rank: 5, wins: 12, earnings: 15000 } },
    { id: '2', name: 'GodLike Esports', tag: 'GLE', members: [{ name: 'CheaterX', role: 'captain' }], stats: { rank: 1, wins: 50, earnings: 100000 } },
];

// FIX: Add missing MOCK_LEADERBOARD export
export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
    // Weekly
    { rank: 1, player: { name: 'Player1' }, metric: 'Earnings', value: 2500, gameId: 'bgmi', period: 'weekly' },
    { rank: 2, player: { name: 'CheaterX' }, metric: 'Earnings', value: 1500, gameId: 'cod', period: 'weekly' },
    { rank: 3, player: { name: 'FairPlayer' }, metric: 'Earnings', value: 1000, gameId: 'valorant', period: 'weekly' },
    // Monthly
    { rank: 1, player: { name: 'CheaterX' }, metric: 'Earnings', value: 12000, gameId: 'cod', period: 'monthly' },
    { rank: 2, player: { name: 'Player1' }, metric: 'Earnings', value: 8000, gameId: 'bgmi', period: 'monthly' },
    // All-Time
    { rank: 1, player: { name: 'CheaterX' }, metric: 'Earnings', value: 50000, gameId: 'cod', period: 'all-time' },
];

// FIX: Add missing MOCK_TEAM_LEADERBOARD export
export const MOCK_TEAM_LEADERBOARD: TeamLeaderboardEntry[] = [
    { rank: 1, team: MOCK_TEAMS[1], metric: 'Earnings', value: 100000 },
    { rank: 2, team: MOCK_TEAMS[0], metric: 'Earnings', value: 15000 },
];