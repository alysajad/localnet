
import React, { useRef, useEffect } from 'react';
import type { Chat, User, Message as MessageType } from '../types';
import Message from './Message';
import MessageInput from './MessageInput';
import { PhoneIcon, VideoIcon, InfoIcon } from './icons';

interface ChatWindowProps {
  chat: Chat;
  users: User[];
  currentUser: User;
  onSendMessage: (content: string, type: 'text' | 'image') => void;
  isOnline: boolean;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, users, currentUser, onSendMessage, isOnline }) => {
  const otherUserId = chat.userIds.find(id => id !== currentUser.id);
  const otherUser = users.find(user => user.id === otherUserId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat.messages]);

  if (!otherUser) {
    return <div className="flex-1 flex items-center justify-center">User not found</div>;
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <header className="flex items-center justify-between p-4 border-b border-surface bg-base shadow-md z-10">
        <div className="flex items-center gap-4">
          <img src={otherUser.avatar} alt={otherUser.name} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-bold text-lg text-on-surface">{otherUser.name}</h3>
            <p className="text-sm text-green-400">{otherUser.isOnline ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex items-center gap-6 text-on-surface-variant">
          <button className="hover:text-primary transition-colors" aria-label="Start voice call"><PhoneIcon /></button>
          <button className="hover:text-primary transition-colors" aria-label="Start video call"><VideoIcon /></button>
          <button className="hover:text-primary transition-colors" aria-label="View chat info"><InfoIcon /></button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {chat.messages.map(msg => (
          <Message key={msg.id} message={msg} currentUser={currentUser} users={users} />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageInput onSendMessage={onSendMessage} isOnline={isOnline} />
    </div>
  );
};

export default ChatWindow;
