
import React from 'react';
import type { Chat, User } from '../types';
import { LogoutIcon } from './icons';

interface SidebarProps {
  chats: Chat[];
  users: User[];
  activeChatId: string;
  onSelectChat: (chatId: string) => void;
  currentUser: User;
  onLogout: () => void;
  isOnline: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ chats, users, activeChatId, onSelectChat, currentUser, onLogout, isOnline }) => {
  const getOtherUser = (chat: Chat): User | undefined => {
    const otherUserId = chat.userIds.find(id => id !== currentUser.id);
    return users.find(user => user.id === otherUserId);
  };

  return (
    <aside className="w-80 bg-base border-r border-surface flex flex-col">
      <div className="p-4 border-b border-surface flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={currentUser.avatar} alt={currentUser.name} className="w-12 h-12 rounded-full" />
          <div>
            <h2 className="font-bold text-lg text-on-surface">{currentUser.name}</h2>
            <div className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
              <p className={`text-sm ${isOnline ? 'text-secondary' : 'text-on-surface-variant'}`}>{isOnline ? 'Online' : 'Offline'}</p>
            </div>
          </div>
        </div>
        <button onClick={onLogout} title="Logout" aria-label="Logout" className="text-on-surface-variant hover:text-red-500 transition-colors p-2 rounded-full">
          <LogoutIcon />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        <h3 className="p-4 text-on-surface-variant font-semibold text-sm tracking-wider">CHATS</h3>
        <ul>
          {chats.map(chat => {
            const otherUser = getOtherUser(chat);
            if (!otherUser) return null;
            const lastMessage = chat.messages[chat.messages.length - 1];
            const isActive = chat.id === activeChatId;

            return (
              <li key={chat.id}>
                <button
                  onClick={() => onSelectChat(chat.id)}
                  className={`w-full text-left flex items-center gap-4 p-4 cursor-pointer transition-colors duration-200 ${
                    isActive ? 'bg-primary/20' : 'hover:bg-surface'
                  }`}
                >
                  <div className="relative">
                    <img src={otherUser.avatar} alt={otherUser.name} className="w-12 h-12 rounded-full" />
                    {otherUser.isOnline && (
                      <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-base"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <h4 className="font-semibold text-on-surface truncate">{otherUser.name}</h4>
                    <p className="text-sm text-on-surface-variant truncate">
                      {lastMessage ? (lastMessage.type === 'image' ? 'Sent an image' : lastMessage.content) : 'No messages yet'}
                    </p>
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
