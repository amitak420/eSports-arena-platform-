import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBXDPW_MHtURBYIZaq85I_IZ2X5pkPX2DA",
  authDomain: "esports-arena-e60c7.firebaseapp.com",
  projectId: "esports-arena-e60c7",
  storageBucket: "esports-arena-e60c7.firebasestorage.app",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
