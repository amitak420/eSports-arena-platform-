import React from 'react';
import Header from './Header';
import BottomNav from './BottomNav';
import Footer from './Footer';
import { Page, useAppContext } from '../App';

interface LayoutProps {
  children: React.ReactNode;
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, currentPage, setCurrentPage }) => {
  const { currentUser, openAuthModal } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={currentUser} onUserButtonClick={openAuthModal} />
      <main className="pt-20 pb-24 flex-grow">
        <div className="page-animation">
          {children}
        </div>
      </main>
      <Footer />
      <BottomNav currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </div>
  );
};

export default Layout;