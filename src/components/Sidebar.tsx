import React from 'react';
import Link from 'next/link';
import { FaList, FaBars, FaDatabase } from 'react-icons/fa';
import { Sheet, SheetTrigger, SheetContent, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const Sidebar: React.FC = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-gray-800">
        <FaBars /> 
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="p-4 w-64 bg-white text-black border-l border-neutral-200 shadow-sm">
        <SheetClose asChild>
        </SheetClose>
        <nav className="flex-grow mt-12">
          <ul>
            <li className="mb-4">
              <Link href="/flows">
                <p className="flex items-center p-2 hover:bg-neutral-100 rounded-lg">
                  <FaList className="mr-2" /> Flows
                </p>
              </Link>
            </li>
            <li>
              <Link href="/data">
                <p className="flex items-center p-2 hover:bg-neutral-100 rounded-lg">
                  <FaDatabase className="mr-2" /> Data
                </p>
              </Link>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;





