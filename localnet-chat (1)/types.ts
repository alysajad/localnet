
export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  type: 'text' | 'image';
}

export interface Chat {
  id: string;
  userIds: string[];
  messages: Message[];
}
   