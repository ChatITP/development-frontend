// pages/data.tsx
import { FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import DataTable from '@/components/DataTable';
import { Button } from '@/components/ui/button';

const DataPage: FC = () => {
  return (
    <div className="m-16">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Database</h1>
        <Button variant="outline" className="flex items-center px-4 py-2  rounded-lg">
          <FaPlus className="mr-2" /> Add New 
        </Button>
      </div>
      <DataTable />
    </div>
  );
};

export default DataPage;
