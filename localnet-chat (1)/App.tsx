
import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import AdminScreen from './components/AdminScreen'; // Import new component
import { INITIAL_CHATS, INITIAL_USERS, ADMIN_PASSWORD, DEFAULT_WIFI_IP, DEFAULT_USER_PASSWORD } from './constants';
import type { Chat, User, Message } from './types';
import { useOnlineStatus } from './hooks/useOnlineStatus';

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


// --- Authentication Screen ---

interface LoginScreenProps {
  onUserLogin: (ip: string, pass: string) => boolean;
  onAdminLogin: (pass: string) => boolean;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onUserLogin, onAdminLogin }) => {
  const [mode, setMode] = useState<'user' | 'admin'>('user');
  const [ip, setIp] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!onUserLogin(ip, userPassword)) {
      setError('Incorrect IP or Password. Get the deets from the admin!');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!onAdminLogin(adminPassword)) {
      setError('Incorrect Admin Password.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-base animate-fade-in">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-sm m-4">
        <div className="p-8 text-center">
          <h1 className="text-3xl font-bold text-on-surface">LocalNet Chat</h1>
          <p className="text-on-surface-variant mt-2">the spot for hostel hangs</p>
        </div>
        
        <div className="flex border-b border-base">
          <button onClick={() => { setMode('user'); setError(null); }} className={`flex-1 p-4 font-semibold transition-colors ${mode === 'user' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'}`}>User</button>
          <button onClick={() => { setMode('admin'); setError(null); }} className={`flex-1 p-4 font-semibold transition-colors ${mode === 'admin' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant'}`}>Admin</button>
        </div>

        <div className="p-8">
          {mode === 'user' ? (
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <Input type="text" placeholder="Wi-Fi IP Address" value={ip} onChange={e => setIp(e.target.value)} required />
              <Input type="password" placeholder="Password" value={userPassword} onChange={e => setUserPassword(e.target.value)} required />
              <Button type="submit">Enter Chat</Button>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <Input type="password" placeholder="Admin Password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} required />
              <Button type="submit">Admin Login</Button>
            </form>
          )}
          {error && <p className="text-red-500 text-center mt-4 text-sm">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export interface AppConfig {
  wifiIp: string;
  userPassword: string;
}

// --- Main Application ---

const CURRENT_USER_ID = 'user1';

const App: React.FC = () => {
  const isOnline = useOnlineStatus();
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    role: null as 'user' | 'admin' | null,
  });

  const [appConfig, setAppConfig] = useState<AppConfig>({
    wifiIp: DEFAULT_WIFI_IP,
    userPassword: DEFAULT_USER_PASSWORD,
  });

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [chats, setChats] = useState<Chat[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string>('chat1');

  const currentUser = users.find(u => u.id === CURRENT_USER_ID);
  const activeChat = chats.find(c => c.id === activeChatId);

  // --- Auth Handlers ---
  const handleUserLogin = (ip: string, pass: string): boolean => {
    if (ip.trim() === appConfig.wifiIp && pass.trim() === appConfig.userPassword) {
      setAuthState({ isAuthenticated: true, role: 'user' });
      return true;
    }
    return false;
  };
  
  const handleAdminLogin = (pass: string): boolean => {
    if (pass === ADMIN_PASSWORD) {
      setAuthState({ isAuthenticated: true, role: 'admin' });
      return true;
    }
    return false;
  };

  const handleLogout = useCallback(() => {
    setAuthState({ isAuthenticated: false, role: null });
  }, []);
  
  const handleSaveSettings = useCallback((newConfig: AppConfig) => {
    setAppConfig(newConfig);
    handleLogout();
  }, [handleLogout]);

  // --- User & Chat Management Handlers (for Admin) ---
  const handleAddUser = useCallback((name: string) => {
    if (!name.trim() || !currentUser) return;
    
    const newUserId = `user${Date.now()}`;
    const newUser: User = {
      id: newUserId,
      name: name.trim(),
      avatar: `https://picsum.photos/seed/${name.trim()}/100/100`,
      isOnline: false, // New users start as offline
    };
    
    const newChat: Chat = {
      id: `chat${Date.now()}`,
      userIds: [currentUser.id, newUserId],
      messages: [],
    };

    setUsers(prev => [...prev, newUser]);
    setChats(prev => [...prev, newChat]);
  }, [currentUser]);

  const handleDeleteUser = useCallback((userIdToDelete: string) => {
    // Prevent deleting the main user
    if (userIdToDelete === CURRENT_USER_ID) return;

    // Remove user
    setUsers(prev => prev.filter(user => user.id !== userIdToDelete));
    
    // Remove chats involving the user
    const remainingChats = chats.filter(chat => !chat.userIds.includes(userIdToDelete));
    setChats(remainingChats);

    // If active chat was deleted, reset it
    if (activeChatId && !remainingChats.some(c => c.id === activeChatId)) {
      setActiveChatId(remainingChats.length > 0 ? remainingChats[0].id : '');
    }
  }, [chats, activeChatId]);


  // --- Chat Handlers ---
  const handleSendMessage = useCallback((content: string, type: 'text' | 'image') => {
    if (!activeChatId || !currentUser) return;
    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      type,
    };
    setChats(prevChats => prevChats.map(chat =>
      chat.id === activeChatId
        ? { ...chat, messages: [...chat.messages, newMessage] }
        : chat
    ));
  }, [activeChatId, currentUser]);

  // --- Render Logic ---
  if (!authState.isAuthenticated) {
    return <LoginScreen onUserLogin={handleUserLogin} onAdminLogin={handleAdminLogin} />;
  }
  
  if (authState.role === 'admin') {
    return (
      <AdminScreen 
        config={appConfig} 
        onSave={handleSaveSettings} 
        onLogout={handleLogout}
        users={users}
        chats={chats}
        onAddUser={handleAddUser}
        onDeleteUser={handleDeleteUser}
        currentUserId={CURRENT_USER_ID}
      />
    );
  }
  
  if (!currentUser) {
    // This case should ideally not happen if authenticated, but it's good practice
    return <div className="flex items-center justify-center h-screen">Error: Current user not found.</div>;
  }

  return (
    <div className="flex h-screen w-full font-sans bg-base text-on-surface antialiased">
      <Sidebar
        chats={chats}
        users={users}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        currentUser={currentUser}
        onLogout={handleLogout}
        isOnline={isOnline}
      />
      <main className="flex-1 flex flex-col bg-surface">
        {activeChat ? (
          <ChatWindow
            chat={activeChat}
            users={users}
            currentUser={currentUser}
            onSendMessage={handleSendMessage}
            isOnline={isOnline}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-on-surface-variant text-lg">Select a chat to start messaging</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
