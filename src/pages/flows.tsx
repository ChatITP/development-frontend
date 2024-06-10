import { FC } from 'react';
import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

const FlowsPage: FC = () => {
  return (
    <div className="m-16">
      <div className="flex flex-row justify-between">
        <h1 className="text-2xl font-bold">Flows</h1>
        <div className="mb-4">
          <Link href="/flows/new">
            <p className="flex items-center p-2 px-4 hover:bg-neutral-100 rounded-lg border border-neutral-200">
              <FaPlus className="mr-2" /> Create New Flow
            </p>
          </Link>
        </div>
      </div>
      <div className='text-center my-20 text-neutral-500 text-sm'>
        <p>Existing flows here.</p>
      </div>
      <div></div>
    </div>
  );
};

export default FlowsPage;
