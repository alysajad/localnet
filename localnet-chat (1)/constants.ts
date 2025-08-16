import type { User, Chat } from './types';

export const INITIAL_USERS: User[] = [
  { id: 'user1', name: 'You', avatar: 'https://picsum.photos/seed/you/100/100', isOnline: true },
  { id: 'user2', name: 'Alex', avatar: 'https://picsum.photos/seed/alex/100/100', isOnline: true },
  { id: 'user3', name: 'Sam', avatar: 'https://picsum.photos/seed/sam/100/100', isOnline: false },
  { id: 'user4', name: 'Jess', avatar: 'https://picsum.photos/seed/jess/100/100', isOnline: true },
];

export const INITIAL_CHATS: Chat[] = [
  {
    id: 'chat1',
    userIds: ['user1', 'user2'],
    messages: [
      { id: 'msg1', senderId: 'user2', content: 'yo what up!', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), type: 'text' },
      { id: 'msg2', senderId: 'user1', content: 'nm, just chillin. hostel wifi is surprisingly fast tonight', timestamp: new Date(Date.now() - 1000 * 60 * 4).toISOString(), type: 'text' },
      { id: 'msg3', senderId: 'user2', content: 'fr? lets run some games', timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(), type: 'text' },
    ],
  },
  {
    id: 'chat2',
    userIds: ['user1', 'user3'],
    messages: [
      { id: 'msg4', senderId: 'user3', content: 'did you finish the assignment?', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), type: 'text' },
    ],
  },
  {
    id: 'chat3',
    userIds: ['user1', 'user4'],
    messages: [
      { id: 'msg5', senderId: 'user4', content: 'pizza party in the common room @ 9', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), type: 'text' },
      { id: 'msg6', senderId: 'user1', content: 'omw!', timestamp: new Date(Date.now() - 1000 * 60 * 29).toISOString(), type: 'text' },
    ],
  },
  {
    id: 'chat4',
    userIds: ['user2', 'user3'], // Chat between Alex and Sam
    messages: [
        { id: 'msg7', senderId: 'user2', content: 'Hey, are you going to the jam session tonight?', timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(), type: 'text' },
        { id: 'msg8', senderId: 'user3', content: 'Yeah, I\'ll be there. Need to finish some work first.', timestamp: new Date(Date.now() - 1000 * 60 * 118).toISOString(), type: 'text' },
        { id: 'msg9', senderId: 'user2', content: 'Cool, save me a spot!', timestamp: new Date(Date.now() - 1000 * 60 * 117).toISOString(), type: 'text' },
    ],
  },
];

export const ADMIN_PASSWORD = 'admin-password-123';
export const DEFAULT_WIFI_IP = '192.168.1.1';
export const DEFAULT_USER_PASSWORD = 'hostel-vibes';