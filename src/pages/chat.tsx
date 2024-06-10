import React from 'react';
import ChatWindow from '../components/chat/ChatWindow';

const ChatPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-[42rem] mx-40 my-2">
      <ChatWindow />
    </div>
  );
};

export default ChatPage;
