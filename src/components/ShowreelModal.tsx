import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Sparkles, CheckCircle2 } from 'lucide-react';
import { heroCompositionImg, aboutWorkspaceImg } from '../data/studioData';

interface ShowreelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService?: (serviceName: string) => void;
}

export const ShowreelModal: React.FC<ShowreelModalProps> = ({ isOpen, onClose, onSelectService }) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [currentScene, setCurrentScene] = useState(0);

  const scenes = [
    {
      title: 'Cinematic Visual Production',
      category: 'Videography & Lighting',
      desc: 'High-end 4K production setups, on-location cinematography, and lighting direction.',
      bg: heroCompositionImg,
      duration: '00:15',
    },
    {
      title: 'Digital Workspace & Creative Engineering',
      category: 'Web & Software Solutions',
      desc: 'Modern responsive web systems, intuitive interfaces, and practical digital problem-solving.',
      bg: aboutWorkspaceImg,
      duration: '00:20',
    },
  ];

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setCurrentScene((prev) => (prev + 1) % scenes.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying, scenes.length]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="showreel-title"
    >
      <div className="relative w-full max-w-4xl bg-[#0D111E] border border-[#282D40] rounded-2xl overflow-hidden shadow-2xl flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#282D40] bg-[#121727]/90">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFA500] animate-pulse" />
            <h3 id="showreel-title" className="font-semibold text-white tracking-wide text-sm sm:text-base">
              KC Digital Studio — Studio Introduction Reel
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#858DA2] hover:text-white hover:bg-[#282D40] transition-colors focus:outline-none focus:ring-2 focus:ring-[#FFA500]"
            aria-label="Close Showreel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video / Cinema Player Viewport */}
        <div className="relative aspect-video w-full bg-black overflow-hidden flex items-center justify-center group">
          <img
            src={scenes[currentScene].bg}
            alt={scenes[currentScene].title}
            className="w-full h-full object-cover transition-transform duration-1000 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080A14] via-transparent to-black/40" />

          {/* Overlay Tag & Description */}
          <div className="absolute bottom-16 left-6 right-6 flex flex-col gap-1 pointer-events-none">
            <span className="text-xs uppercase tracking-widest text-[#FFA500] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              {scenes[currentScene].category}
            </span>
            <h4 className="text-xl sm:text-2xl font-bold text-white drop-shadow-md">
              {scenes[currentScene].title}
            </h4>
            <p className="text-xs sm:text-sm text-[#B8BDCA] max-w-xl line-clamp-2 drop-shadow">
              {scenes[currentScene].desc}
            </p>
          </div>

          {/* Interactive Player Controls */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white bg-[#121727]/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-1 rounded-md hover:bg-white/10 text-[#FFA500] transition-colors focus:outline-none"
                aria-label={isPlaying ? 'Pause reel' : 'Play reel'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-[#FFA500]" />}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1 rounded-md hover:bg-white/10 text-white/80 transition-colors focus:outline-none"
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <span className="text-xs text-[#858DA2] font-mono">
                Scene {currentScene + 1} of {scenes.length}
              </span>
            </div>

            {/* Scene Selectors */}
            <div className="flex items-center gap-2">
              {scenes.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentScene(idx)}
                  className={`h-1.5 rounded-full transition-all ${
                    currentScene === idx ? 'w-8 bg-[#FFA500]' : 'w-3 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Jump to scene ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer with Action */}
        <div className="px-6 py-4 bg-[#080A14] flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#282D40]">
          <div className="text-xs text-[#858DA2] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#FFA500]" />
            Official showcase of digital production, web design & media services.
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => {
                onClose();
                if (onSelectService) onSelectService('Videography');
                const contactEl = document.getElementById('contact');
                contactEl?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#FFA500] hover:bg-[#FFB52E] text-black font-semibold text-xs sm:text-sm tracking-wide transition-all shadow-md shadow-[#FFA500]/20 text-center"
            >
              Start a Creative Project →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
