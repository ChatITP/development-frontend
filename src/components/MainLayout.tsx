import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Inter } from 'next/font/google';
import { useRouter } from 'next/router';
import AuthWrapper from './AuthWrapper';

const inter = Inter({ subsets: ['latin'] });

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();

  return (
    <div
      className={`flex flex-col min-h-screen w-screen overflow-x-hidden ${inter.className}`}
    >
      {router.pathname === '/login' ||
      router.pathname === '/register' ? null : (
        <Navbar />
      )}
      <main className="flex-grow  items-center justify-between">
        {router.pathname === '/login' || router.pathname === '/register' ? (
          children
        ) : (
          <AuthWrapper>{children}</AuthWrapper>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
