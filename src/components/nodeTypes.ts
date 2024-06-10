import { NodeTypes } from '@/types';
import { Position } from 'reactflow';

export const nodeTypes: NodeTypes = {
  chatInputNode: {
    label: 'Chat Input',
    type: 'chatInputNode',
    data: {
      label: 'Chat Input',
      description: '',
      fields: [
        { name: 'message', label: 'Message', type: 'text', placeholder: 'Type your message here' },
        { name: 'sender', label: 'Sender Name', type: 'text', placeholder: 'User' },
      ],
      formData: {},
      onChange: (id, data) => {},
    },
    handles: {
      inputs: [],
      outputs: [{ id: 'output-1', position: Position.Right, type: 'source', fieldName:'' }],
    },
  },
  promptNode: {
    label: 'Prompt',
    type: 'promptNode',
    data: {
      label: 'Prompt',
      description: 'Create a prompt template.',
      fields: [
        { name: 'template', label: 'Template', type: 'text', placeholder: 'Enter your template' },
        { name: 'user_input', label: 'User Input', type: 'text', placeholder: 'Enter user input' },
      ],
      formData: {},
      onChange: (id, data) => {},
    },
    handles: {
      inputs: [
        { id: 'input-template', position: Position.Left, type: 'target', fieldName: 'template' },
        { id: 'input-user_input', position: Position.Left, type: 'target', fieldName: 'user_input' },
      ],
      outputs: [{ id: 'output-text', position: Position.Right, type: 'source', fieldName:'' }],
    },
  },
  modelNode: {
    label: 'Model',
    type: 'modelNode',
    data: {
      label: 'Model',
      description: 'Generates text using LLM.',
      fields: [
        { name: 'modelName', label: 'Model Name', type: 'text', placeholder: 'llama-3' },
        { name: 'input', label: 'Input', type: 'text', placeholder: 'Type something...' },
        { name: 'apiKey', label: 'API Key', type: 'text', placeholder: 'Enter your API key' },
        { name: 'temperature', label: 'Temperature', type: 'number', placeholder: '0.1' },
      ],
      formData: {},
      onChange: (id, data) => {},
    },
    handles: {
      inputs: [
        { id: 'input-modelName', position: Position.Left, type: 'target', fieldName: 'modelName' },
        { id: 'input-input', position: Position.Left, type: 'target', fieldName: 'input' },
      ],
      outputs: [{ id: 'output-1', position: Position.Right, type: 'source', fieldName:'' }],
    },
  },
  chatOutputNode: {
    label: 'Chat Output',
    type: 'chatOutputNode',
    data: {
      label: 'Chat Output',
      description: 'Display a chat output.',
      fields: [
        { name: 'message', label: 'Message', type: 'text', placeholder: 'Type your message here' },
        { name: 'sender', label: 'Sender Name', type: 'text', placeholder: 'AI' },
      ],
      formData: {},
      onChange: (id, data) => {},
    },
    handles: {
      inputs: [{ id: 'input-1', position: Position.Left, type: 'target', fieldName:'' }],
      outputs: [],
    },
  },
  textOutputNode: {
    label: 'Text Output',
    type: 'textOutputNode',
    data: {
      label: 'Text Output',
      description: 'Display a text output.',
      fields: [
        { name: 'input', label: 'Input', type: 'text', placeholder: 'Type something...' },
      ],
      formData: {},
      onChange: (id, data) => {},
    },
    handles: {
      inputs: [{ id: 'input-1', position: Position.Left, type: 'target', fieldName:'' }],
      outputs: [],
    },
  },
};
