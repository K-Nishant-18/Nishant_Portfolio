import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio element
    const audio = new Audio('/music/background-music.mp3');
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Handle audio loading
    audio.addEventListener('loadeddata', () => {
      console.log('Audio loaded successfully');
    });

    audio.addEventListener('error', (e) => {
      console.error('Audio loading error:', e);
    });

    // Start playing when component mounts (may be blocked by browser)
    const startMusic = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
        console.log('Music started playing');
      } catch (error) {
        console.log('Autoplay prevented by browser:', error);
        setIsPlaying(false);
      }
    };

    // Try to start music after a delay
    const timer = setTimeout(startMusic, 2000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []); // Remove dependencies to prevent recreation

  // Handle user interaction to start music
  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted && !isPlaying && audioRef.current) {
        setHasUserInteracted(true);
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          console.log('Music started on user interaction');
        }).catch((error) => {
          console.error('Failed to start music on user interaction:', error);
        });
      }
    };

    // Add event listeners for user interaction
    document.addEventListener('click', handleUserInteraction, { once: true });
    document.addEventListener('keydown', handleUserInteraction, { once: true });
    document.addEventListener('touchstart', handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
    };
  }, [hasUserInteracted, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        console.log('Music paused');
      } else {
        audioRef.current.play().then(() => {
          setIsPlaying(true);
          console.log('Music resumed');
        }).catch((error) => {
          console.error('Failed to play music:', error);
        });
      }
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    if (audioRef.current) {
      audioRef.current.volume = newMutedState ? 0 : volume;
    }
    console.log(newMutedState ? 'Music muted' : 'Music unmuted');
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : newVolume;
    }
  };

  const value: MusicContextType = {
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    volume,
    setVolume: handleVolumeChange,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}; 