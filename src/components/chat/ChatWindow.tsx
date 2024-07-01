import React, { useState, useRef, useEffect } from 'react';
import ChatList from './ChatList';
import ChatBottombar from './ChatBottombar';
import LoadingDots from './LoadingDots';
import axios from 'axios';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { SaveIcon } from 'lucide-react';

interface Prompt {
  _id: string;
  title: string;
  type: string;
  system_prompt: string;
  main_prompt: string;
  created_at: Date;
}

interface Message {
  text: string;
  sender: string;
}

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [sessionIds, setSessionIds] = useState<string[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string>('');
  const [selectedSessionId, setSelectedSessionId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
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

    const fetchSessionIds = async () => {
      try {
        const response = await axios.get('http://localhost:3001/llm/sessions');
        setSessionIds(response.data.sessionIds);
      } catch (error) {
        console.error('Error fetching session IDs:', error);
      }
    };

    fetchPrompts();
    fetchSessionIds();
  }, []);

  const initializeConversation = async (systemPrompt: string) => {
    try {
      await axios.post('http://localhost:3001/llm/initialize', { systemPrompt });
    } catch (error) {
      console.error('Error initializing conversation:', error);
    }
  };

  const handleSendMessage = async (message: string) => {
    setMessages([...messages, { text: message, sender: 'user' }]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/llm/generate', {
        userPrompt: message,
      });

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: response.data.content, sender: 'ai' },
      ]);
      setLoading(false);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Failed to get a response from the model.', sender: 'ai' },
      ]);
      setLoading(false);
    }
  };

  const handleSaveSession = async () => {
    try {
      const response = await axios.post('http://localhost:3001/llm/save-session', { sessionId: selectedSessionId, messages });
      setSelectedSessionId(response.data.sessionId); // Update the session ID with the response
      alert('Session saved successfully.');
      // Fetch updated session IDs
      const updatedSessionsResponse = await axios.get('http://localhost:3001/llm/sessions');
      setSessionIds(updatedSessionsResponse.data.sessionIds);
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Failed to save session.');
    }
  };

  const handleLoadSession = async (sessionId: string) => {
    try {
      if (!sessionId) {
        alert('Session ID is required to load the session.');
        return;
      }
      const response = await axios.post('http://localhost:3001/llm/load-session', { sessionId });
      const loadedMessages = response.data.messages.map((msg: { content: string; role: string }) => ({
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'ai'
      }));
      setMessages(loadedMessages);

      // Initialize the conversation with loaded messages
      await axios.post('http://localhost:3001/llm/initialize-with-messages', {
        messages: response.data.messages
      });
    } catch (error) {
      console.error('Error loading session:', error);
      // alert('Failed to load session.');
    }
  };

  const handleResetSession = async () => {
    try {
      await axios.post('http://localhost:3001/llm/reset-session');
      setMessages([]);
      alert('Session reset successfully.');
    } catch (error) {
      console.error('Error resetting session:', error);
      alert('Failed to reset session.');
    }
  };

  useEffect(() => {
    if (selectedPrompt) {
      initializeConversation(selectedPrompt);
    }
  }, [selectedPrompt]);

  useEffect(() => {
    if (selectedSessionId) {
      handleLoadSession(selectedSessionId);
    }
  }, [selectedSessionId]);

  useEffect(() => {
    if (chatListRef.current) {
      chatListRef.current.scrollTop = chatListRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-full w-full p-4 bg-white rounded-lg border border-neutral-300 shadow-md">
      <div className="mb-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <label htmlFor="promptSelector" className="block text-sm font-medium text-gray-700 mb-2">
            Select a Prompt:
          </label>
          <Select
            value={selectedPrompt}
            onValueChange={(value) => setSelectedPrompt(value)}
          >
            <SelectTrigger className="w-full md:w-64">
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
        <div className="mb-4 md:mb-0">
          <label htmlFor="sessionSelector" className="block text-sm font-medium text-gray-700 mb-2">
            Select a Session:
          </label>
          <Select
            value={selectedSessionId}
            onValueChange={(value) => setSelectedSessionId(value)}
          >
            <SelectTrigger className="w-full md:w-64">
              <SelectValue placeholder="Select a session" />
            </SelectTrigger>
            <SelectContent>
              {sessionIds.map((id) => (
                <SelectItem key={id} value={id}>
                  {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center">
          <Button
            variant = "outline"
            onClick={handleSaveSession}
            className="text-black px-4 py-2 rounded-lg"
          >
            <SaveIcon className='h-4 w-4'/>
          </Button>
        </div>
      </div>
      <div className="flex-1 w-full overflow-y-auto" ref={chatListRef}>
        <ChatList messages={messages} />
      </div>
      {loading && (
        <div className="flex justify-center items-center my-4">
          <LoadingDots />
        </div>
      )}
      <ChatBottombar onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
