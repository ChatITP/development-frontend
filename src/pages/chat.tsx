// app/page.tsx
import React from 'react';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[32rem] mx-40">
      <ChatWindow />
    </div>
  );
};

export default ChatPage;
