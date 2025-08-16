import React, { useState, useMemo } from 'react';
import type { AppConfig } from '../App';
import type { User, Chat } from '../types';
import { LogoutIcon, SettingsIcon, UsersIcon, TrashIcon, MessageSquareIcon, GlobeIcon } from './icons';
import Message from './Message';
import { format } from 'date-fns';

// --- Re-usable UI components ---
const Input = (props: React.ComponentProps<'input'>) => (
  <input
    {...props}
    className="w-full bg-base p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-on-surface placeholder-on-surface-variant"
  />
);

const Button = ({ children, ...props }: React.ComponentProps<'button'>) => (
  <button
    {...props}
    className="w-full bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
  >
    {children}
  </button>
);


// --- Child Components for AdminScreen ---

const SettingsPanel: React.FC<{ config: AppConfig, onSave: (newConfig: AppConfig) => void }> = ({ config, onSave }) => {
  const [ip, setIp] = useState(config.wifiIp);
  const [password, setPassword] = useState(config.userPassword);

  const handleSave = () => {
    onSave({ wifiIp: ip, userPassword: password });
  };
  
  return (
    <div className="animate-fade-in space-y-4">
       <p className="text-on-surface-variant mb-4 text-sm">Update the access details for users.</p>
       <Input type="text" placeholder="Wi-Fi IP Address" value={ip} onChange={e => setIp(e.target.value)} />
       <Input type="text" placeholder="New User Password" value={password} onChange={e => setPassword(e.target.value)} />
       <Button onClick={handleSave}>Save & Exit</Button>
    </div>
  );
};

const UsersPanel: React.FC<{ users: User[], currentUserId: string, onAddUser: (name: string) => void, onDeleteUser: (userId: string) => void }> = ({ users, currentUserId, onAddUser, onDeleteUser }) => {
  const [newUserName, setNewUserName] = useState('');

  const handleAdd = () => {
    if (newUserName.trim()) {
      onAddUser(newUserName.trim());
      setNewUserName('');
    }
  };

  return (
    <div className="animate-fade-in">
       <p className="text-on-surface-variant mb-4 text-sm">Add or remove users from the chat network.</p>
       <div className="flex gap-2 mb-6">
        <Input type="text" placeholder="New User's Name" value={newUserName} onChange={e => setNewUserName(e.target.value)} />
        <button onClick={handleAdd} className="bg-secondary text-black font-bold py-2 px-4 rounded-lg hover:bg-opacity-80 transition-all shrink-0">Add</button>
       </div>
       
       <h4 className="font-semibold text-on-surface mb-2">Current Users</h4>
       <div className="max-h-60 overflow-y-auto pr-2 space-y-2">
         {users.filter(u => u.id !== currentUserId).map(user => (
           <div key={user.id} className="flex items-center justify-between bg-base p-2 rounded-lg">
             <div className="flex items-center gap-3">
               <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full" />
               <span className="text-on-surface">{user.name}</span>
             </div>
             <button onClick={() => window.confirm(`Are you sure you want to delete ${user.name}? This will remove all their chats.`) && onDeleteUser(user.id)} className="text-on-surface-variant hover:text-red-500 p-1 rounded-full transition-colors">
                <TrashIcon />
             </button>
           </div>
         ))}
       </div>
    </div>
  );
};

const ChatsPanel: React.FC<{ chats: Chat[], users: User[] }> = ({ chats, users }) => {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  const getChatParticipants = (chat: Chat) => {
    return chat.userIds
      .map(id => users.find(u => u.id === id))
      .filter((u): u is User => !!u);
  };

  if (selectedChat) {
    const participants = getChatParticipants(selectedChat);
    // For rendering purposes, we need a "currentUser" to align messages. We'll pick the first user.
    const perspectiveUser = participants[0]; 

    return (
      <div className="animate-fade-in flex flex-col h-96">
        <div className="flex items-center gap-4 mb-4">
           <button onClick={() => setSelectedChat(null)} className="text-on-surface-variant hover:text-primary">&larr; Back</button>
           <h4 className="font-semibold text-on-surface truncate">
            {participants.map(p => p.name).join(' & ')}
           </h4>
        </div>
        <div className="flex-1 overflow-y-auto bg-base p-4 rounded-lg space-y-4">
          {selectedChat.messages.length > 0 ? selectedChat.messages.map(msg => (
            <Message key={msg.id} message={msg} currentUser={perspectiveUser} users={users} />
          )) : (
            <p className="text-center text-on-surface-variant">No messages in this chat yet.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <p className="text-on-surface-variant mb-4 text-sm">Select a conversation to view its history.</p>
      <div className="max-h-80 overflow-y-auto pr-2 space-y-2">
        {chats.map(chat => {
          const participants = getChatParticipants(chat);
          if (participants.length < 2) return null; // Don't show empty/single-user chats
          return (
            <div key={chat.id} onClick={() => setSelectedChat(chat)} className="flex items-center justify-between bg-base p-3 rounded-lg cursor-pointer hover:bg-primary/10 transition-colors">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-4">
                    {participants.map(p => <img key={p.id} src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full border-2 border-surface" />)}
                </div>
                <span className="text-on-surface font-medium">{participants.map(p => p.name).join(' & ')}</span>
              </div>
              <span className="text-xs text-on-surface-variant">{chat.messages.length} messages</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const NetworkLogsPanel: React.FC = () => {
    // This is simulated data as a browser cannot access network logs.
    const mockLogs = useMemo(() => [
        { id: 1, user: 'Alex', site: 'youtube.com', time: new Date(Date.now() - 1000 * 60 * 5) },
        { id: 2, user: 'Jess', site: 'stackoverflow.com', time: new Date(Date.now() - 1000 * 60 * 12) },
        { id: 3, user: 'Sam', site: 'github.com', time: new Date(Date.now() - 1000 * 60 * 25) },
        { id: 4, user: 'Alex', site: 'google.com', time: new Date(Date.now() - 1000 * 60 * 31) },
        { id: 5, user: 'Jess', site: 'tailwindcss.com', time: new Date(Date.now() - 1000 * 60 * 45) },
        { id: 6, user: 'Alex', site: 'react.dev', time: new Date(Date.now() - 1000 * 60 * 52) },
    ], []);

    return (
        <div className="animate-fade-in">
            <p className="text-on-surface-variant mb-4 text-sm">
                Displaying simulated network traffic for demonstration purposes.
            </p>
            <div className="max-h-80 overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-surface">
                        <tr>
                            <th className="p-2 font-semibold text-on-surface-variant">User</th>
                            <th className="p-2 font-semibold text-on-surface-variant">Website Visited</th>
                            <th className="p-2 font-semibold text-on-surface-variant">Time</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-base">
                        {mockLogs.map(log => (
                            <tr key={log.id}>
                                <td className="p-2 text-on-surface">{log.user}</td>
                                <td className="p-2 text-secondary">{log.site}</td>
                                <td className="p-2 text-on-surface-variant">{format(log.time, 'p')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


// --- Main Admin Screen ---
interface AdminScreenProps {
  config: AppConfig;
  onSave: (newConfig: AppConfig) => void;
  onLogout: () => void;
  users: User[];
  chats: Chat[];
  currentUserId: string;
  onAddUser: (name: string) => void;
  onDeleteUser: (userId: string) => void;
}

const AdminScreen: React.FC<AdminScreenProps> = (props) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'users' | 'chats' | 'network'>('settings');
  
  return (
     <div className="flex items-center justify-center h-screen bg-base animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-lg m-4">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-base">
           <h2 className="text-xl font-bold text-on-surface">Admin Dashboard</h2>
           <button onClick={props.onLogout} title="Logout" className="text-on-surface-variant hover:text-red-500 transition-colors">
             <LogoutIcon />
           </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-base text-sm">
            <button onClick={() => setActiveTab('settings')} className={`flex-1 p-3 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'settings' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'}`}>
              <SettingsIcon /> Settings
            </button>
            <button onClick={() => setActiveTab('users')} className={`flex-1 p-3 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'users' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'}`}>
              <UsersIcon /> Users
            </button>
             <button onClick={() => setActiveTab('chats')} className={`flex-1 p-3 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'chats' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'}`}>
              <MessageSquareIcon /> Chats
            </button>
             <button onClick={() => setActiveTab('network')} className={`flex-1 p-3 font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'network' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'}`}>
              <GlobeIcon /> Network Logs
            </button>
        </div>

        {/* Content */}
        <div className="p-6 min-h-[28rem]">
          {activeTab === 'settings' && <SettingsPanel config={props.config} onSave={props.onSave} />}
          {activeTab === 'users' && <UsersPanel users={props.users} currentUserId={props.currentUserId} onAddUser={props.onAddUser} onDeleteUser={props.onDeleteUser} />}
          {activeTab === 'chats' && <ChatsPanel chats={props.chats} users={props.users} />}
          {activeTab === 'network' && <NetworkLogsPanel />}
        </div>
      </div>
    </div>
  );
};

export default AdminScreen;