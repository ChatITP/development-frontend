import React, { useState } from 'react';
import axios from 'axios';

const colors = [
  'bg-red-300',
  'bg-orange-300',
  'bg-yellow-300',
  'bg-green-300',
  'bg-teal-300',
  'bg-blue-300',
  'bg-indigo-300',
  'bg-purple-300',
  'bg-pink-300',
];

interface BlockProps {
  text: string;
  index: number;
  onSelect: (text: string) => void;
}

const Block: React.FC<BlockProps> = ({ text, index, onSelect }) => (
  <button
    className={`m-1 py-2 px-4 rounded-full shadow-md text-sm font-semibold ${
      text === '?' ? 'bg-gray-300' : colors[index % colors.length]
    } text-black`}
    onClick={() => onSelect(text)}
  >
    {text}
  </button>
);

interface BlockSelectorProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

const BlockSelector: React.FC<BlockSelectorProps> = ({ suggestions, onSelect }) => (
  <div className="flex flex-wrap mt-4 justify-center">
    {suggestions.map((suggestion, index) => (
      suggestion && <Block key={index} text={suggestion} index={index} onSelect={onSelect} />
    ))}
  </div>
);

const fetchSuggestionsFromBackend = async (selectedBlocks: string[]): Promise<string[]> => {
  try {
    const response = await axios.post('http://localhost:3001/llm/suggestions', { selectedBlocks });
    return response.data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

const ChatInterface: React.FC = () => {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>(['what', 'who', 'when', 'where', 'why', 'how']);

  const handleBlockSelect = async (text: string) => {
    if (text === '?') {
      console.log("Complete question:", [...selectedBlocks, text].join(' '));
      setSelectedBlocks([]);
      setSuggestions(['what', 'who', 'when', 'where', 'why', 'how']);
    } else {
      const newSelectedBlocks = [...selectedBlocks, text];
      setSelectedBlocks(newSelectedBlocks);

      const newSuggestions = await fetchSuggestionsFromBackend(newSelectedBlocks);
      setSuggestions(newSuggestions);
    }
  };

  return (
    <div className="p-4 min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-wrap mb-4 bg-gray-200 p-4 rounded-md shadow-inner">
        {selectedBlocks.map((block, index) => (
          <Block key={index} text={block} index={index} onSelect={() => {}} />
        ))}
        {selectedBlocks.length > 0 && <Block text="?" index={selectedBlocks.length} onSelect={handleBlockSelect} />}
      </div>
      <BlockSelector suggestions={suggestions} onSelect={handleBlockSelect} />
    </div>
  );
};

export default ChatInterface;

