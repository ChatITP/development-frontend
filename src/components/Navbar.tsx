import React from 'react';
import Link from 'next/link';
import Sidebar from './Sidebar';

const Navbar: React.FC = () => {
  return (
    <nav className="border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex flex-wrap justify-between items-center p-4">
        <div className="text-lg font-semibold">
          <Link href="/" className="hover:text-gray-600">
            Dev ChatITP
          </Link>
        </div>
        <div>
          <Sidebar />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
