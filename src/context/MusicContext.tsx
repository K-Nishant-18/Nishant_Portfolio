import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

// Define the shape of the context data
interface MusicContextType {
  isPlaying: boolean;
  isMuted: boolean;
  togglePlay: () => void;
  toggleMute: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

// Create the context
const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Custom hook for easy access to the context
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};

// Define the props for the provider component
interface MusicProviderProps {
  children: React.ReactNode;
}

export const MusicProvider: React.FC<MusicProviderProps> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.7); // Default volume at 30%
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Effect to initialize the audio element
  useEffect(() => {
    // Create the audio object and store it in the ref
    const audio = new Audio('/music/background-music.mp3');
    audio.loop = true;
    audioRef.current = audio;

    // Cleanup function to run when the component unmounts
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []); // Empty dependency array ensures this runs only once

  // Effect to control the audio element's volume based on state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [isMuted, volume]);

  // Function to toggle play/pause
  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      console.log('Music paused');
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
        console.log('Music started playing');
      }).catch(error => {
        console.error('Audio play failed:', error);
        setIsPlaying(false); // Ensure state is correct if play fails
      });
    }
  }, [isPlaying]);

  // Function to toggle mute/unmute
  const toggleMute = useCallback(() => {
    setIsMuted(prevMuted => !prevMuted);
    console.log(isMuted ? 'Music unmuted' : 'Music muted');
  }, [isMuted]);

  // Function to set a new volume
  const handleSetVolume = useCallback((newVolume: number) => {
    const clampedVolume = Math.max(0, Math.min(1, newVolume)); // Ensure volume is between 0 and 1
    setVolume(clampedVolume);
  }, []);

  // The value object provided to consuming components
  const value: MusicContextType = {
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    volume,
    setVolume: handleSetVolume,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};