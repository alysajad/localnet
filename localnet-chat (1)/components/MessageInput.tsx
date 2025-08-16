
import React, { useState, useRef } from 'react';
import { PaperclipIcon, SendIcon, SparklesIcon } from './icons';
import AiImageModal from './AiImageModal';

interface MessageInputProps {
  onSendMessage: (content: string, type: 'text' | 'image') => void;
  isOnline: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, isOnline }) => {
  const [text, setText] = useState('');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim()) {
      onSendMessage(text.trim(), 'text');
      setText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onSendMessage(event.target.result as string, 'image');
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAiImageSend = (imageUrl: string) => {
    onSendMessage(imageUrl, 'image');
    setIsAiModalOpen(false);
  };

  return (
    <>
      <div className="p-4 bg-base border-t border-surface">
        <div className="flex items-center gap-4 bg-surface rounded-full px-4 py-2">
          <button 
            onClick={() => isOnline && setIsAiModalOpen(true)} 
            className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full disabled:opacity-50 disabled:cursor-not-allowed" 
            aria-label="Open AI Image Generator"
            title={isOnline ? "Generate image with AI" : "Internet connection required"}
            disabled={!isOnline}>
            <SparklesIcon />
          </button>
          <button onClick={() => fileInputRef.current?.click()} className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full" aria-label="Attach file">
            <PaperclipIcon />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
          />
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-transparent focus:outline-none text-on-surface placeholder-on-surface-variant"
            aria-label="Message input"
          />
          <button
            onClick={handleSend}
            className="bg-primary text-black rounded-full p-3 hover:bg-opacity-80 transition-all duration-200 disabled:bg-gray-500"
            disabled={!text.trim()}
            aria-label="Send message"
          >
            <SendIcon />
          </button>
        </div>
      </div>
      {isAiModalOpen && <AiImageModal onClose={() => setIsAiModalOpen(false)} onSend={handleAiImageSend} isOnline={isOnline} />}
    </>
  );
};

export default MessageInput;
