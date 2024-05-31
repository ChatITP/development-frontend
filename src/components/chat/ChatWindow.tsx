import React, { useState, useRef, useEffect } from 'react';
import ChatList from './ChatList';
import ChatBottombar from './ChatBottombar';

const ChatWindow = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const chatListRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { text: message, sender: 'user' }]);
    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: 'Some AI response to: ' + message, sender: 'ai' },
      ]);
    }, 1000);
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

