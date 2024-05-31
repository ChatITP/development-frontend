import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ChatBottombar = ({ onSendMessage }: { onSendMessage: (message: string) => void }) => {
    const [message, setMessage] = useState('');

    const handleSend = () => {
        if (message.trim() !== '') {
            onSendMessage(message);
            setMessage('');
        }
    };

    return (
        <div className="flex p-2">
            <Input
                type="text"
                className="flex-1 p-2 border rounded-l-lg focus:outline-0"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button
                className="ml-2 p-4 bg-neutral-900 text-white"
                onClick={handleSend}
            >
                Send
            </Button>
        </div>
    );
};

export default ChatBottombar;
