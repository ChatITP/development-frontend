import { Position } from 'reactflow';

export interface HandleConfig {
  id: string;
  position: Position;
  type: 'source' | 'target';
  fieldName: string; 
}

export interface Field {
  name: string;
  label: string;
  type: string;
  placeholder: string;
}

export interface NodeData {
  label: string;
  description: string;
  fields: Field[];
  formData: { [key: string]: string };
  onChange: (id: string, data: NodeData) => void;
}

export interface NodeTypeConfig {
  label: string;
  type: string;
  data: NodeData;
  handles: {
    inputs: HandleConfig[];
    outputs: HandleConfig[];
  };
}

export type NodeTypes = {
  [key: string]: NodeTypeConfig;
};
