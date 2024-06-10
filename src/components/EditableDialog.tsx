import React from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EditableDialogProps {
  open: boolean;
  fieldName: string;
  fieldLabel: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => void;
}

const EditableDialog: React.FC<EditableDialogProps> = ({ open, fieldName, fieldLabel, value, onChange, onSubmit }) => {
  return (
    <Dialog open={open} onOpenChange={onSubmit}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {fieldLabel}</DialogTitle>
          <DialogDescription>
            Update the value for {fieldLabel}.
          </DialogDescription>
        </DialogHeader>
        <Input
          id={fieldName}
          type="text"
          name={fieldName}
          placeholder={`Edit ${fieldLabel}`}
          value={value}
          onChange={onChange}
          className="mt-4 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <DialogFooter>
          <Button onClick={onSubmit}>Submit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditableDialog;
