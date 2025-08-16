
import React from 'react';
import type { Message as MessageType, User } from '../types';
import { format } from 'date-fns';

interface MessageProps {
  message: MessageType;
  currentUser: User;
  users: User[];
}

const Message: React.FC<MessageProps> = ({ message, currentUser, users }) => {
  const isCurrentUser = message.senderId === currentUser.id;
  const sender = users.find(u => u.id === message.senderId);

  const messageAlignment = isCurrentUser ? 'justify-end' : 'justify-start';
  const bubbleColor = isCurrentUser ? 'bg-primary text-black' : 'bg-surface';
  const bubbleStyles = `max-w-md lg:max-w-lg p-3 rounded-2xl ${bubbleColor}`;
  const timeAlignment = isCurrentUser ? 'text-right' : 'text-left';

  return (
    <div className={`flex items-end gap-3 animate-fade-in ${messageAlignment}`}>
      {!isCurrentUser && (
        <img src={sender?.avatar} alt={sender?.name} className="w-8 h-8 rounded-full self-start" />
      )}
      <div className="flex flex-col">
        <div className={bubbleStyles}>
          {message.type === 'text' ? (
             <p className="text-sm break-words">{message.content}</p>
          ) : (
            <img src={message.content} alt="sent" className="rounded-lg max-w-xs cursor-pointer" onClick={() => window.open(message.content, '_blank')} />
          )}
        </div>
        <span className={`text-xs text-on-surface-variant mt-1 px-2 ${timeAlignment}`}>
            {format(new Date(message.timestamp), 'p')}
        </span>
      </div>
       {isCurrentUser && (
        <img src={currentUser.avatar} alt={currentUser.name} className="w-8 h-8 rounded-full self-start" />
      )}
    </div>
  );
};

export default Message;
   