import React, { forwardRef } from 'react';
import { Message } from './Message';

interface ChatMessage {
  text: string;
  sender: string;
  type: 'text' | 'image';
  imageUrl?: string;
}

const ChatList = forwardRef<HTMLDivElement, { messages: ChatMessage[] }>(
  ({ messages }, ref) => {
    return (
      <div ref={ref} className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <Message 
            key={index} 
            text={msg.text} 
            sender={msg.sender} 
            type={msg.type}
            imageUrl={msg.imageUrl}
          />
        ))}
      </div>
    );
  }
);

ChatList.displayName = 'ChatList';
export default ChatList;