import { collection, onSnapshot, doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';
import { db } from './firebase';
import { Tournament, User } from '../types';

// Get real-time updates for tournaments
export const getTournamentsStream = (callback: (tournaments: Tournament[]) => void) => {
  const tournamentsCollection = collection(db, 'tournaments');
  // NOTE: In a real production app, you would add error handling here.
  return onSnapshot(tournamentsCollection, (querySnapshot) => {
    const tournaments = querySnapshot.docs.map(doc => {
      const data = doc.data();
      // Convert Firestore Timestamps to JS Dates
      const startTime = data.startTime instanceof Timestamp ? data.startTime.toDate() : new Date();
      
      return {
        ...data,
        id: doc.id,
        startTime: startTime,
      } as Tournament;
    });
    callback(tournaments);
  });
};

// Get or create user profile in Firestore
export const getOrCreateUser = async (firebaseUser: FirebaseUser): Promise<User> => {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        // Here, you might want to handle data migration if your User type changes
        return userSnap.data() as User;
    } else {
        // Create a new user profile
        const name = firebaseUser.displayName || `Player${firebaseUser.uid.slice(0, 5)}`;
        const newUser: User = {
            uid: firebaseUser.uid,
            name: name,
            role: 'player', // Default role for new sign-ups
            avatarUrl: firebaseUser.photoURL,
            subscription: null,
            wallet: { balance: 100, transactions: [] }, // Starter balance for new players
            achievements: [],
            joinedTournaments: [],
            gameId: `${name.split(' ')[0]}#${Math.floor(1000 + Math.random() * 9000)}`,
            favoriteGames: [],
            teamId: undefined,
            teamRole: undefined,
        };
        await setDoc(userRef, newUser);
        return newUser;
    }
};
