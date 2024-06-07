import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className={`flex flex-col min-h-screen w-screen overflow-x-hidden ${inter.className}`}>
      <Navbar />
      <main className="flex-grow  items-center justify-between">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;