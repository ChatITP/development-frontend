import React, { forwardRef } from 'react';
import { Message } from './Message';

const ChatList = forwardRef<HTMLDivElement, { messages: { text: string; sender: string }[] }>(
  ({ messages }, ref) => {
    return (
      <div ref={ref} className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <Message key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
    );
  }
);

ChatList.displayName = 'ChatList';

export default ChatList;