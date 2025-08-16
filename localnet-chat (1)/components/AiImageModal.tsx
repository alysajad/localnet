
import React, { useState, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { XIcon, SendIcon } from './icons';

interface AiImageModalProps {
  onClose: () => void;
  onSend: (imageUrl: string) => void;
  isOnline: boolean;
}

type GenerationState = 'idle' | 'loading' | 'success' | 'error';

const AiImageModal: React.FC<AiImageModalProps> = ({ onClose, onSend, isOnline }) => {
  const [prompt, setPrompt] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [state, setState] = useState<GenerationState>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || !isOnline) return;
    setState('loading');
    setError(null);
    setGeneratedImage(null);
    try {
      const imageUrl = await generateImage(prompt);
      setGeneratedImage(imageUrl);
      setState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      setState('error');
    }
  }, [prompt, isOnline]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="ai-modal-title">
      <div className="bg-surface rounded-2xl shadow-xl w-full max-w-md m-4 flex flex-col">
        <header className="flex items-center justify-between p-4 border-b border-base">
          <h2 id="ai-modal-title" className="text-lg font-bold text-on-surface">AI Image Generator</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-primary" aria-label="Close AI Image Generator">
            <XIcon />
          </button>
        </header>

        <div className="p-6 flex-1">
          <p className="text-sm text-on-surface-variant mb-4">
            Describe the sticker or meme you want to create. Be creative!
          </p>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., a cat DJing at a party, pixel art style"
            className="w-full bg-base p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-on-surface placeholder-on-surface-variant resize-none"
            rows={3}
            disabled={!isOnline}
          />
          <button
            onClick={handleGenerate}
            disabled={!isOnline || state === 'loading' || !prompt.trim()}
            className="w-full mt-4 bg-primary text-black font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {state === 'loading' ? 'Generating...' : 'Generate'}
          </button>
          
          <div className="mt-6 h-64 bg-base rounded-lg flex items-center justify-center overflow-hidden">
            {!isOnline ? (
                <div className="text-yellow-500 p-4 text-center">Internet connection required to generate images.</div>
            ) : state === 'loading' ? (
                <div className="text-on-surface-variant">Conjuring pixels...</div>
            ) : state === 'error' ? (
                <div className="text-red-500 p-4 text-center">{error}</div>
            ) : state === 'success' && generatedImage ? (
                <img src={generatedImage} alt={prompt} className="object-contain w-full h-full" />
            ) : (
                <div className="text-on-surface-variant">Your creation will appear here</div>
            )}
          </div>
        </div>

        <footer className="p-4 border-t border-base">
          <button
            onClick={() => generatedImage && onSend(generatedImage)}
            disabled={!generatedImage || state !== 'success'}
            className="w-full bg-secondary text-black font-bold py-3 px-4 rounded-lg hover:bg-opacity-80 transition-all duration-200 disabled:bg-gray-600 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <SendIcon /> Send to Chat
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AiImageModal;
