import React, { useState, createContext, useContext, useEffect } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import Layout from './components/Layout';
import Home from './components/Home';
import TournamentListPage from './components/TournamentListPage';
import TournamentDetailPage from './components/TournamentDetailPage';
import AICoachPage from './components/AICoachPage';
import AuthModal from './components/AuthModal';
import PlayerDashboard from './components/PlayerDashboard';
import OrganizerDashboard from './components/OrganizerDashboard';
import AdminDashboard from './components/AdminDashboard';
import CreateTournamentWizard from './components/CreateTournamentWizard';
import SubscriptionPlansPage from './components/SubscriptionPlansPage';
import { Tournament, User, Notification } from './types';
import { getUserByName, createUserByName } from './services/mockFirebase';
import { getOrCreateUser } from './services/firestoreService';
// FIX: Import new page components
import LeaderboardPage from './components/LeaderboardPage';
import TeamsPage from './components/TeamsPage';
import ProfilePage from './components/ProfilePage';


export type Page = 
  | 'home' | 'tournaments' | 'tournament-detail' | 'join-flow' 
  | 'player-dashboard' | 'organizer-dashboard' | 'admin-dashboard'
  | 'create-wizard' | 'subscriptions' | 'chat'
  // FIX: Add missing page types
  | 'leaderboards' | 'teams' | 'profile';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAllNotificationsAsRead: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error("useAppContext must be used within an AppProvider");
    return context;
};

const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        // Auto-login mock user for faster development/testing
        const user = getUserByName("Player1");
        if(user) setCurrentUser(user);
    }, []);

    const openAuthModal = () => setAuthModalOpen(true);
    const closeAuthModal = () => setAuthModalOpen(false);

    const updateCurrentUser = (updates: Partial<User>) => {
        setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    };
    
    const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now(),
            timestamp: new Date(),
            read: false,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const markAllNotificationsAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    return (
        <AppContext.Provider value={{ 
            currentUser, 
            setCurrentUser, 
            updateCurrentUser, 
            isAuthModalOpen, 
            openAuthModal, 
            closeAuthModal,
            notifications,
            addNotification,
            markAllNotificationsAsRead
        }}>
            {children}
        </AppContext.Provider>
    );
};


const MainApp: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const { isAuthModalOpen, closeAuthModal, setCurrentUser } = useAppContext();

  const viewTournamentDetail = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setCurrentPage('tournament-detail');
  };

  const handleDemoAuth = (authData: {name: string, role: 'player' | 'organizer' | 'admin'}) => {
      let user = getUserByName(authData.name);
      if (!user) {
          user = createUserByName(authData.name, authData.role);
      } else if (user.role !== authData.role) {
          // For demo, allow role switching on login
          user.role = authData.role;
      }
      setCurrentUser(user);
      closeAuthModal();
      // Navigate to the correct dashboard after login
      setCurrentPage(`${authData.role}-dashboard` as Page);
  }
  
  const handleFirebaseAuthSuccess = async (firebaseUser: FirebaseUser) => {
    try {
      const userProfile = await getOrCreateUser(firebaseUser);
      setCurrentUser(userProfile);
      closeAuthModal();
      // Default to player dashboard after phone login
      setCurrentPage(`${userProfile.role}-dashboard` as Page);
    } catch (error) {
      console.error("Error handling auth success:", error);
      // Optionally: show an error message to the user
    }
  };


  const renderPage = () => {
    const pageProps = { setCurrentPage, viewTournamentDetail };
    switch (currentPage) {
      case 'home':
        return <Home {...pageProps} />;
      case 'tournaments':
        return <TournamentListPage {...pageProps} />;
      case 'tournament-detail':
        return <TournamentDetailPage tournament={selectedTournament!} {...pageProps} isJoinFlow={false} />;
      case 'join-flow':
        // FIX: Corrected typo from 'page_props' to 'pageProps'.
        return <TournamentDetailPage tournament={selectedTournament!} {...pageProps} isJoinFlow={true} />;
      case 'player-dashboard':
        return <PlayerDashboard {...pageProps} />;
      case 'organizer-dashboard':
        return <OrganizerDashboard setCurrentPage={setCurrentPage} />;
      case 'admin-dashboard':
        return <AdminDashboard setCurrentPage={setCurrentPage} />;
      case 'create-wizard':
        return <CreateTournamentWizard setCurrentPage={setCurrentPage} />;
      case 'subscriptions':
        return <SubscriptionPlansPage setCurrentPage={setCurrentPage} />;
      case 'chat':
        return <AICoachPage />;
      // FIX: Add rendering for new pages
      case 'leaderboards':
        return <LeaderboardPage />;
      case 'teams':
        return <TeamsPage />;
      case 'profile':
        return <ProfilePage />;
      default:
        return <Home {...pageProps} />;
    }
  };

  return (
    <div className="min-h-screen font-sans" suppressHydrationWarning={true}>
      <Layout 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage}
      >
        {renderPage()}
      </Layout>
      {isAuthModalOpen && (
          <AuthModal 
            onClose={closeAuthModal} 
            onAuth={handleDemoAuth}
            onFirebaseAuthSuccess={handleFirebaseAuthSuccess}
          />
      )}
    </div>
  );
};

const App: React.FC = () => (
    <AppProvider>
        <MainApp />
    </AppProvider>
);

export default App;