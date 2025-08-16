import React, { useState, useEffect } from 'react';
import { FiVolume2, FiX } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext'; // Adjust path as needed

const MusicPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { isPlaying, togglePlay } = useMusic();

  // Effect to show the prompt if music isn't playing
  useEffect(() => {
    // If music is already playing when the component mounts, do nothing.
    if (isPlaying) {
      setShowPrompt(false);
      return;
    }

    // Set a timer to show the prompt after 3 seconds
    const timer = setTimeout(() => {
      // Check again before showing, in case it started playing in the meantime
      if (!isPlaying) {
        setShowPrompt(true);
      }
    }, 3000);

    // Cleanup function to clear the timer
    return () => clearTimeout(timer);
  }, [isPlaying]); // Re-run this effect if isPlaying changes

  const handleEnableMusic = () => {
    togglePlay(); // This starts the music via the context
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // If the prompt shouldn't be shown, render nothing
  if (!showPrompt) {
    return null;
  }

  // Render the prompt UI
  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 backdrop-blur-xl bg-gray-200 dark:bg-gray-900/30 border border-white/20 dark:border-gray-300/30 rounded-lg shadow-lg hover:shadow-sm transition-all duration-300 overflow-hidden p-4 max-w-sm mx-auto sm:mx-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <FiVolume2 className="text-gray-600 dark:text-gray-400" size={20} />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Enable Background Music By Hans Zimmer
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Enhance your experience with immersive background music.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          aria-label="Dismiss"
        >
          <FiX size={16} />
        </button>
      </div>
      <div className="mt-3 flex space-x-2">
        <button
          onClick={handleEnableMusic}
          className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-medium py-2 px-3 rounded transition-colors"
        >
          Enable Music
        </button>
        <button
          onClick={handleDismiss}
          className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium py-2 px-3 rounded transition-colors"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
};

export default MusicPrompt;