import React, { useState, useEffect, useRef } from 'react';
import { request } from '@/lib/request';
import { Button } from '@/components/ui/button';
import LoadingDots from './LoadingDots';

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
    className={`py-2 px-4 rounded-full shadow-md text-sm font-semibold ${
      text === '?' ? 'bg-gray-600 text-white' : colors[index % colors.length]
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

const BlockSelector: React.FC<BlockSelectorProps> = ({
  suggestions,
  onSelect,
}) => (
  <div className="flex flex-wrap mt-4 justify-center gap-2">
    {suggestions.map(
      (suggestion, index) =>
        suggestion && (
          <div key={index} className="m-1">
            <Block text={suggestion} index={index} onSelect={onSelect} />
          </div>
        ),
    )}
  </div>
);

const fetchSuggestionsFromBackend = async (
  selectedBlocks: string[],
): Promise<string[]> => {
  try {
    const response = await request(
      'POST',
      'http://localhost:8000/api/llm/suggestions',
      { selectedBlocks },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    return [];
  }
};

const DottedLine: React.FC = () => (
  <svg width="32" height="2" className="mx-1">
    <line
      x1="0"
      y1="1"
      x2="32"
      y2="1"
      stroke="black"
      strokeWidth="2"
      strokeDasharray="2 4"
    />
  </svg>
);

interface Message {
  question: string[];
  answer: string;
}

const ChatInterface: React.FC = () => {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([
    'what',
    'who',
    'when',
    'where',
    'why',
    'how',
  ]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatListRef = useRef<HTMLDivElement>(null);

  const handleBlockSelect = async (text: string) => {
    if (text === '?') {
      const completeQuestion = [...selectedBlocks, text];
      await sendMessageToModel(completeQuestion);
      setSelectedBlocks([]);
      setSuggestions(['what', 'who', 'when', 'where', 'why', 'how']);
    } else {
      const newSelectedBlocks = [...selectedBlocks, text];
      setSelectedBlocks(newSelectedBlocks);
      const newSuggestions =
        await fetchSuggestionsFromBackend(newSelectedBlocks);
      setSuggestions(newSuggestions);
    }
  };

  const sendMessageToModel = async (question: string[]) => {
    setLoading(true);
    setShowSuggestions(false);
    try {
      const response = await request(
        'POST',
        'http://localhost:8000/api/llm/generate',
        {
          userPrompt: question.join(' '),
        },
      );
      setMessages([...messages, { question, answer: response.data.content }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages([
        ...messages,
        { question, answer: 'Failed to get a response from the model.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleAskAgain = () => {
    setShowSuggestions(true);
    setSelectedBlocks([]);
    setSuggestions(['what', 'who', 'when', 'where', 'why', 'how']);
  };

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-4 w-[600px] bg-white rounded-lg shadow-lg flex flex-col max-h-96">
      <div className="flex-1 overflow-y-auto mb-4" ref={chatListRef}>
        {messages.map((message, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center justify-start mb-2 bg-gray-100 p-4 rounded-md shadow-inner min-h-20 overflow-x-auto">
              {message.question.map((block, blockIndex) => (
                <React.Fragment key={blockIndex}>
                  <Block text={block} index={blockIndex} onSelect={() => {}} />
                  {blockIndex < message.question.length - 1 && <DottedLine />}
                </React.Fragment>
              ))}
            </div>
            <div className="bg-blue-100 p-4 rounded-md w-fit overflow-scroll">
              <p>{message.answer}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {showSuggestions ? (
          <>
            <div className="flex items-center justify-start mb-4 bg-gray-100 p-4 rounded-md shadow-inner min-h-20 overflow-x-auto">
              {selectedBlocks.map((block, index) => (
                <React.Fragment key={index}>
                  <Block text={block} index={index} onSelect={() => {}} />
                  {index < selectedBlocks.length - 1 && <DottedLine />}
                </React.Fragment>
              ))}
              {selectedBlocks.length > 0 && (
                <>
                  <DottedLine />
                  <Block
                    text="?"
                    index={selectedBlocks.length}
                    onSelect={handleBlockSelect}
                  />
                </>
              )}
            </div>
            <BlockSelector
              suggestions={suggestions}
              onSelect={handleBlockSelect}
            />
          </>
        ) : (
          <div className="flex flex-col">
            {loading && (
              <div className="flex justify-center items-center my-4">
                <LoadingDots />
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={handleAskAgain}>Ask Again</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
