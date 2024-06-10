import React, { useState, useRef, useEffect } from 'react';
import ChatList from './ChatList';
import ChatBottombar from './ChatBottombar';
import axios from 'axios';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const prompts = [
  'You are a helpful assistant.',
  'You are a knowledgeable professor.',
  'You are a meme artist.',
];

const ChatWindow = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const chatListRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (message: string) => {
    setMessages([...messages, { text: message, sender: 'user' }]);

    try {
      const response = await axios.post('http://localhost:3001/', {
        systemPrompt: selectedPrompt,
        userPrompt: message,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.content, sender: 'ai' },
      ]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Failed to get a response from the model.', sender: 'ai' },
      ]);
    }
  };

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full p-4 bg-white rounded-lg border border-neutral-300">
      <div className="mb-4">
        <label htmlFor="promptSelector" className="block text-sm font-medium text-gray-700">
          Select a Prompt:
        </label>
        <Select
          value={selectedPrompt}
          onValueChange={(value) => setSelectedPrompt(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a prompt" />
          </SelectTrigger>
          <SelectContent>
            {prompts.map((prompt, index) => (
              <SelectItem key={index} value={prompt}>
                {prompt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ChatList messages={messages} ref={chatListRef} />
      <ChatBottombar onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;

