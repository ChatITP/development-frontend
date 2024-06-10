import React, { useState } from 'react';
import { Handle, NodeProps } from 'reactflow';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FaEdit } from 'react-icons/fa';
import EditableDialog from './EditableDialog';
import { nodeTypes } from './nodeTypes';
import { NodeData, HandleConfig } from '@/types';

const CustomNode: React.FC<NodeProps<NodeData>> = ({ id, data, type }) => {
  const [formData, setFormData] = useState<{ [key: string]: string }>(
    data.fields.reduce((acc, field) => {
      acc[field.name] = '';
      return acc;
    }, {} as { [key: string]: string })
  );
  const [currentField, setCurrentField] = useState<string | null>(null);
  const [dialogValue, setDialogValue] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    data.onChange(id, { ...data, formData: { ...formData, [name]: value } });
  };

  const openDialog = (field: string) => {
    setCurrentField(field);
    setDialogValue(formData[field]);
  };

  const closeDialog = () => {
    setCurrentField(null);
  };

  const submitDialog = () => {
    if (currentField) {
      setFormData((prevData) => ({ ...prevData, [currentField]: dialogValue }));
      data.onChange(id, { ...data, formData: { ...formData, [currentField]: dialogValue } });
    }
    closeDialog();
  };

  const handleRun = () => {
    console.log('Running with data:', formData);
  };

  const nodeConfig = nodeTypes[type as keyof typeof nodeTypes];

  return (
    <Card className="w-80">
      <CardHeader>
        <CardTitle>{data.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mt-2">{data.description}</div>
        {data.fields.map((field) => (
          <div key={field.name} className="mt-4 flex flex-col items-start w-full">
            <Label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
              {field.label}
            </Label>
            <div className="flex items-center w-full relative">
              <Input
                id={field.name}
                type={field.type}
                name={field.name}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm pr-10"
              />
              {(field.name === 'template' || field.name === 'message') && (
                <button
                  onClick={() => openDialog(field.name)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                >
                  <FaEdit />
                </button>
              )}
            </div>
          </div>
        ))}
        {type === 'chatOutputNode' && (
          <button onClick={handleRun} className="mt-4 p-2 bg-blue-500 text-white rounded">
            Run
          </button>
        )}
        {nodeConfig.handles.inputs.map((input: HandleConfig, index: number) => (
          <Handle
            key={input.id}
            id={input.id}
            type={input.type}
            position={input.position}
            className="w-2 h-2 bg-blue-500"
            style={{ top: `${140 + index * 100}px` }} 
          />
        ))}
        {nodeConfig.handles.outputs.map((output: HandleConfig, index: number) => (
          <Handle
            key={output.id}
            id={output.id}
            type={output.type}
            position={output.position}
            className="w-2 h-2 bg-blue-500"
            style={{ bottom: `${20 + index * 50}px` }} 
          />
        ))}
      </CardContent>
      {currentField && (
        <EditableDialog
          open={true}
          fieldName={currentField}
          fieldLabel={data.fields.find((field) => field.name === currentField)?.label || ''}
          value={dialogValue}
          onChange={(e) => setDialogValue(e.target.value)}
          onSubmit={submitDialog}
        />
      )}
    </Card>
  );
};

export default CustomNode;

