import React from 'react';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInterface from '@/components/chat/ChatInterface';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ChatPage: React.FC = () => {
  return (
    <div>
      <Tabs defaultValue="chatWindow">
        <TabsList className='flex items-center justify-center'>
          <TabsTrigger value="chatWindow">Chat Window</TabsTrigger>
          <TabsTrigger value="chatInterface">Chat Interface</TabsTrigger>
        </TabsList>
        <TabsContent value="chatInterface">
          <div className="flex items-center justify-center h-[42rem] mx-40 my-2">
            <ChatInterface />
          </div>
        </TabsContent>
        <TabsContent value="chatWindow">
          <div className="flex items-center justify-center h-[42rem] mx-40 my-2">
            <ChatWindow />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ChatPage;
