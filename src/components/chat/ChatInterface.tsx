import React, { useState, useEffect, useRef } from 'react';
import { request } from '@/lib/request';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import LoadingDots from './LoadingDots';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

interface BlockEditPopoverProps {
  text: string;
  onSelect: (newText: string) => void;
  onClose: () => void;
}


interface BlockProps {
  text: string;
  index: number;
  editable: boolean; 
  onSelect: (text: string) => void;
  onUpdate: (newText: string) => void;
}

const ModeSwitch: React.FC<{
  interactionMode: 'blocks' | 'simple';
  setInteractionMode: (mode: 'blocks' | 'simple') => void;
}> = ({ interactionMode, setInteractionMode }) => (
  <div className="flex items-center justify-end space-x-2 mb-4">
    <Switch
      id="interaction-mode"
      checked={interactionMode === 'simple'}
      onCheckedChange={() => setInteractionMode(interactionMode === 'blocks' ? 'simple' : 'blocks')}
    />
    <Label htmlFor="interaction-mode">
      {interactionMode === 'blocks' ? 'Blocks' : 'Simple'}
    </Label>
  </div>
);


const BlockEditPopover: React.FC<BlockEditPopoverProps> = ({ text, onSelect, onClose }) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    setSuggestions([`lorem`,
      `ipsum`,
      `dolorum`]);
  }, [text]);

  return (
    <div className="p-2">
      <div className="flex flex-col space-y-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="ghost"
            className="justify-start"
            onClick={() => {
              onSelect(suggestion);
              onClose();
            }}
          >
            {suggestion}
          </Button>
        ))}
      </div>
      <Button variant="outline" className="mt-2 w-full" onClick={onClose}>
        Cancel
      </Button>
    </div>
  );
};


const Block: React.FC<BlockProps> = ({ text, index, onSelect, onUpdate, editable }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handlePopoverClose = () => {
    setIsPopoverOpen(false);
  };

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <button
          className={`py-2 px-4 rounded-full shadow-md text-sm font-semibold ${
            text === '?' ? 'bg-gray-600 text-white' : colors[index % colors.length]
          } text-black`}
          onClick={() => {
            onSelect(text);
            if (editable) setIsPopoverOpen(true);
          }}
        >
          {text}
        </button>
      </PopoverTrigger>
      {editable && (
        <PopoverContent className="w-full">
          <BlockEditPopover text={text} onSelect={onUpdate} onClose={handlePopoverClose} />
        </PopoverContent>
      )}
    </Popover>
  );
};



interface BlockSelectorProps {
  suggestions: string[];
  onSelect: (text: string) => void;
}

const BlockSelector: React.FC<BlockSelectorProps> = ({
  suggestions,
  onSelect,
}) => (
  <div className="flex flex-wrap mt-4 justify-center gap-2">
    {suggestions.length > 1 || suggestions[0] !== '?' ? (
      suggestions.map(
        (suggestion, index) =>
          suggestion && (
            <div key={index} className="m-1">
              <Block text={suggestion} index={index} onSelect={onSelect} editable={false} onUpdate={function (newText: string): void {
                throw new Error('Function not implemented.');
              } } />
            </div>
          ),
      )
    ) : (
      <p>No suggestions available</p>
    )}
  </div>
);

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
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [inputText, setInputText] = useState<string>('');
  const chatListRef = useRef<HTMLDivElement>(null);
  const [interactionMode, setInteractionMode] = useState<'blocks' | 'simple'>('blocks');

  const initializeChat = async () => {
    try {
      const response = await request(
        'GET',
        `${process.env.NEXT_PUBLIC_API_URL}/db/prompts?title=default_conversational&type=itp_collective_consciousness_model`
      );
      
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const fetchedPrompt = response.data[0];
        setSystemPrompt(fetchedPrompt.system_prompt);
  
        await request(
          'POST',
          process.env.NEXT_PUBLIC_API_URL + '/llm/initialize',
          { systemPrompt: fetchedPrompt.system_prompt }
        );
      } else {
        console.error('No matching prompt found');
      }
    } catch (error) {
      console.error('Error initializing chat:', error);
    }
  };

  useEffect(() => {
    initializeChat();
  }, []);

  const fetchSuggestionsFromBackend = async (
    selectedBlocks: string[],
  ): Promise<string[]> => {
    try {
      const response = await request(
        'POST',
        process.env.NEXT_PUBLIC_API_URL + '/llm/suggestions',
        { selectedBlocks, messages },
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const handleBlockSelect = async (text: string) => {
    if (text === '?') {
      const completeQuestion = [...selectedBlocks, text];
      await sendMessageToModel(completeQuestion);
      setSelectedBlocks([]);
      setSuggestions(['what', 'who', 'when', 'where', 'why', 'how']);
    } else {
      const newSelectedBlocks = [...selectedBlocks, text];
      setSelectedBlocks(newSelectedBlocks);
      const newSuggestions = await fetchSuggestionsFromBackend(newSelectedBlocks);
      setSuggestions(newSuggestions.length > 0 ? newSuggestions : ['?']);
    }
  };

  const sendMessageToModel = async (question: string[]) => {
    setLoading(true);
    setShowSuggestions(false);
    try {
      const response = await request(
        'POST',
        process.env.NEXT_PUBLIC_API_URL + '/llm/generate',
        {
          userPrompt: question.join(' '),
          messages,
        },
      );
      const newMessage = { question, answer: response.data.content };
      setMessages([...messages, newMessage]);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
  };

  const handleBlockUpdate = (index: number, newText: string) => {
    setSelectedBlocks(prevBlocks => {
      const newBlocks = [...prevBlocks];
      newBlocks[index] = newText;
      return newBlocks;
    });
  };

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      const question = interactionMode === 'blocks' 
        ? [...selectedBlocks, inputText]
        : [inputText];
      await sendMessageToModel(question);
      setInputText('');
      setSelectedBlocks([]);
    }
  };

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="p-4 w-[600px] bg-white rounded-lg shadow-lg flex flex-col max-h-[600px]">
      <ModeSwitch
        interactionMode={interactionMode}
        setInteractionMode={setInteractionMode}
      />
      <div className="flex-1 overflow-y-auto mb-4" ref={chatListRef}>
        {messages.map((message, index) => (
          <div key={index} className="mb-6">
            <div className="flex items-center justify-start mb-2 bg-gray-100 p-4 rounded-md shadow-inner min-h-20 overflow-x-auto">
              {message.question.map((block, blockIndex) => (
                <React.Fragment key={blockIndex}>
                  <Block 
                    text={block} 
                    index={blockIndex} 
                    onSelect={() => {}} 
                    onUpdate={() => {}}
                    editable={false}
                  />
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
        {interactionMode === 'blocks' && (
          <div className="flex items-center justify-start mb-4 bg-gray-100 p-4 rounded-md shadow-inner min-h-20 overflow-x-auto">
            {selectedBlocks.map((block, index) => (
              <React.Fragment key={index}>
                <Block
                  text={block}
                  index={index}
                  onSelect={() => {}}
                  onUpdate={(newText) => handleBlockUpdate(index, newText)}
                  editable={true}
                />
                {index < selectedBlocks.length - 1 && <DottedLine />}
              </React.Fragment>
            ))}
            {selectedBlocks.length > 0 && showSuggestions && (
              <>
                <DottedLine />
                <Block
                  text="?"
                  index={selectedBlocks.length}
                  onSelect={handleBlockSelect}
                  onUpdate={() => {}}
                  editable={false}
                />
              </>
            )}
          </div>
        )}
      
        {showSuggestions ? (
          <>
            {interactionMode === 'blocks' ? (
              <>
                <BlockSelector
                  suggestions={suggestions}
                  onSelect={handleBlockSelect}
                />
              </>
            ) : (
              <form onSubmit={handleInputSubmit} className="flex mb-2" data-no-drag>
                <Input
                  type="text"
                  value={inputText}
                  onChange={handleInputChange}
                  placeholder="Type your question..."
                  className="flex-grow mr-2"
                  data-no-drag
                />
                <Button type="submit" data-no-drag>Send</Button>
              </form>
            )}
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