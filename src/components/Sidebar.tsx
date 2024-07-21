import React from 'react';
import Link from 'next/link';
import { FaList, FaBars } from 'react-icons/fa';
import {
  SquareChevronRight,
  Database,
  Workflow,
  MessageCircle,
  LogIn,
  LogOut,
  Blocks,
} from 'lucide-react';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { request } from '@/lib/request';
import Router from 'next/router';

const Sidebar: React.FC = () => {
  const onLogout = async () => {
    try {
      await request('POST', process.env.NEXT_PUBLIC_API_URL + '/user/logout');
      Router.push('/login');
    } catch (error) {
      console.error('Failed to logout');
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="text-gray-800">
          <FaBars />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="p-4 w-64 bg-white text-black border-l border-neutral-200 shadow-sm"
      >
        <SheetClose asChild></SheetClose>
        <nav className="flex-grow mt-12">
          <ul>
            {/* <li className="mb-4">
              <Link href="/flows">
                <p className="flex items-center p-2 hover:bg-neutral-100 rounded-lg">
                  <Workflow className="mr-2" /> Flows
                </p>
              </Link>
            </li> */}
            <li className="mb-4">
              <Link href="/data">
                <p className="flex items-center p-2 hover:bg-neutral-100 rounded-lg">
                  <Database className="mr-2" /> Data
                </p>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/prompts">
                <p className="flex items-center p-2 hover:bg-neutral-100 rounded-lg">
                  <SquareChevronRight className="mr-2" /> Prompts
                </p>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/chat">
                <p className="flex items-center p-2 hover:bg-neutral-100 rounded-lg">
                  <MessageCircle className="mr-2" /> Chat
                </p>
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/canvas">
                <p className="flex items-center p-2 hover:bg-neutral-100 rounded-lg">
                  <Blocks className="mr-2" /> Blocks
                </p>
              </Link>
            </li>
            {/* <li className="mb-4">
              <Link href="/login">
                <p className="flex items-center p-2 hover:bg-neutral-100 rounded-lg">
                  <LogIn className="mr-2" /> Login
                </p>
              </Link>
            </li> */}
            <li className="mb-4">
              <button className="w-full" onClick={onLogout}>
                <p className="flex items-center p-2 hover:bg-neutral-100 rounded-lg">
                  <LogOut className="mr-2" /> Logout
                </p>
              </button>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default Sidebar;
