import React, { useState, useRef, useEffect } from 'react';
import ChatList from './ChatList';
import ChatBottombar from './ChatBottombar';
import axios from 'axios';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface Prompt {
  _id: string;
  title: string;
  type: string;
  system_prompt: string;
  main_prompt: string;
  created_at: Date;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    [],
  );
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const response = await axios.get('http://localhost:3001/db/prompts');
        setPrompts(response.data);
        setSelectedPrompt(response.data[0]?.system_prompt || '');
      } catch (error) {
        console.error('Error fetching prompts:', error);
      }
    };

    fetchPrompts();
  }, []);

  const initializeConversation = async (systemPrompt: string) => {
    try {
      await axios.post('http://localhost:3001/llm/initialize', {
        systemPrompt,
      });
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    setMessages([...messages, { text: message, sender: 'user' }]);

    try {
      const response = await axios.post('http://localhost:3001/llm/generate', {
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
    if (selectedPrompt) {
      initializeConversation(selectedPrompt);
    }
  }, [selectedPrompt]);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full p-4 bg-white rounded-lg border border-neutral-300">
      <div className="mb-4">
        <label
          htmlFor="promptSelector"
          className="block text-sm font-medium text-gray-700"
        >
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
            {prompts.map((prompt) => (
              <SelectItem key={prompt._id} value={prompt.system_prompt}>
                {prompt.title}
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
