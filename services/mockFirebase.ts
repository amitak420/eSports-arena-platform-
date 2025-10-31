import { Tournament, User, MatchData } from '../types';
import { MOCK_TOURNAMENTS, MOCK_MATCH_DATA } from '../constants';

const DB_KEY = 'esportsArenaDB';

interface MockDB {
  tournaments: Tournament[];
  users: User[];
  matches: MatchData[];
}

// Function to get the entire database from localStorage
const getDB = (): MockDB => {
  const dbString = localStorage.getItem(DB_KEY);
  if (dbString) {
    const db = JSON.parse(dbString);
    // Dates are stored as strings, so we need to convert them back
    db.tournaments.forEach((t: any) => t.startTime = new Date(t.startTime));
    return db;
  }
  // If no DB found, initialize with default data
  return {
    tournaments: MOCK_TOURNAMENTS,
    users: [],
    matches: MOCK_MATCH_DATA
  };
};

// Function to save the entire database to localStorage
const saveDB = (db: MockDB) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Initialize DB on load
let db = getDB();
saveDB(db); // Save initial state if it doesn't exist

// --- USER FUNCTIONS ---

export function getUserByName(name: string): User | undefined {
  return db.users.find(u => u.name.toLowerCase() === name.toLowerCase());
}

export function getUserByUid(uid: string): User | undefined {
  return db.users.find(u => u.uid === uid);
}

export function createUserByName(name: string, role: 'player' | 'organizer' | 'admin'): User {
  const existingUser = getUserByName(name);
  if (existingUser) return existingUser;

  const newUser: User = {
    uid: `mock_${name.toLowerCase().replace(/\s/g, '')}`,
    name,
    role,
    subscription: null,
    wallet: { balance: role === 'organizer' ? 5000 : 1000, transactions: [] },
    achievements: [],
    joinedTournaments: [],
    gameId: `${name}#${Math.floor(1000 + Math.random() * 9000)}`,
    favoriteGames: [],
    teamId: name === 'Player1' ? '1' : undefined,
    teamRole: name === 'Player1' ? 'captain' : undefined,
  };
  db.users.push(newUser);
  saveDB(db);
  return newUser;
}

export function createUserWithUid(uid: string, role: 'player' | 'organizer' | 'admin' = 'player'): User {
  const existingUser = getUserByUid(uid);
  if (existingUser) return existingUser;

  const name = `Player${uid.slice(-4)}`;

  const newUser: User = {
    uid,
    name,
    role,
    subscription: null,
    wallet: { balance: 1000, transactions: [] },
    achievements: [],
    joinedTournaments: [],
    gameId: `${name}#${Math.floor(1000 + Math.random() * 9000)}`,
    favoriteGames: [],
    teamId: undefined,
    teamRole: undefined,
  };
  db.users.push(newUser);
  saveDB(db);
  return newUser;
}

export function updateUserByUid(uid: string, updates: Partial<User>): User | undefined {
    const userIndex = db.users.findIndex(u => u.uid === uid);
    if (userIndex > -1) {
        db.users[userIndex] = { ...db.users[userIndex], ...updates };
        saveDB(db);
        return db.users[userIndex];
    }
    return undefined;
}


// --- TOURNAMENT FUNCTIONS ---

export function getTournaments(): Tournament[] {
  return db.tournaments.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
}

export function getTournamentById(id: string): Tournament | undefined {
    return db.tournaments.find(t => t.id === id);
}

export function addTournament(tournament: Omit<Tournament, 'id'>) {
  const newTournament: Tournament = {
    ...tournament,
    id: Date.now().toString(), // Simple unique ID for mock purposes
  };
  db.tournaments.push(newTournament);
  saveDB(db);
  return newTournament;
}

// --- MATCH DATA FUNCTIONS ---

export function getAllMatches(): MatchData[] {
    return db.matches;
}

export function getMatchesByPlayer(playerName: string): MatchData[] {
    return db.matches.filter(m => m.playerName.toLowerCase() === playerName.toLowerCase());
}