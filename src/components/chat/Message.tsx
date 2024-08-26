import React from 'react';
import { Card } from '@/components/ui/card';
import ReactMarkdown from 'react-markdown';

interface MessageProps {
  text: string;
  sender: string;
  type: 'text' | 'image';
  imageUrl?: string;
}

export const Message: React.FC<MessageProps> = ({ text, sender, type, imageUrl }) => {
  const messageStyles =
    sender === 'user'
      ? 'bg-purple-50 text-black self-end'
      : 'bg-neutral-100 text-black self-start';

  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'} mb-2`}>
      <Card className={`p-3 rounded-lg max-w-lg ${messageStyles}`}>
        {type === 'image' && imageUrl && (
          <img src={imageUrl} alt="AI generated image" className="w-full h-auto rounded mb-2" />
        )}
        {text && <ReactMarkdown>{text}</ReactMarkdown>}
      </Card>
    </div>
  );
};