import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { MenuIcon, XIcon } from 'lucide-react'; 

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className=" border-b border-gray-200 shadow-sm">
      <div className="container mx-auto flex flex-wrap justify-between items-center p-4">
        <div className="text-lg font-semibold">
          <Link href="/" className="hover:text-gray-600">
            Dev ChatITP
          </Link>
        </div>
        <div className="md:hidden">
          <button onClick={toggleMenu} className="p-2 text-gray-800 focus:outline-none">
            {isOpen ? <XIcon className="w-6 h-6"/> : <MenuIcon className="w-6 h-6"/>}
          </button>
        </div>
        <div className={`w-full md:flex md:items-center md:w-auto ${isOpen ? 'block' : 'hidden'}`}>
          <div className="flex flex-col md:flex-row gap-2 md:gap-4 mt-2 md:mt-0">
            <Link href="/chat" className={`hover:text-gray-600 py-2 px-4 ${router.pathname === '/chat' ? 'underline' : ''}`}>
              Chat
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
