import React from 'react';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

export const Message = ({ text, sender }: { text: string; sender: string }) => {
  const messageStyles =
    sender === 'user'
      ? 'bg-purple-50 text-black self-end'
      : 'bg-neutral-100 text-black self-start';

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      <Card className={`p-3 rounded-lg max-w-md ${messageStyles}`}>
        <ReactMarkdown>{text}</ReactMarkdown>
      </Card>
    </div>
  );
};