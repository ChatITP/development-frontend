import React, { useState, useRef, useEffect } from 'react';
import ChatList from './ChatList';
import ChatBottombar from './ChatBottombar';
import axios from 'axios';

const ChatWindow = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const chatListRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async (message: string) => {
    setMessages([...messages, { text: message, sender: 'user' }]);

    try {
      const response = await axios.post('http://localhost:3001/', {
        systemPrompt: 'You are a helpful assistant.', 
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
        { text: 'Failed to get a response from the the model.', sender: 'ai' },
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
      <ChatList messages={messages} ref={chatListRef} />
      <ChatBottombar onSendMessage={handleSendMessage} />
    </div>
  );
};

export default ChatWindow;
