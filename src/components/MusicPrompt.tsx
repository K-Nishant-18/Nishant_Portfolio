import React, { useState, useEffect } from 'react';
import { FiVolume2, FiX } from 'react-icons/fi';
import { useMusic } from '../context/MusicContext';

const MusicPrompt: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const { isPlaying, togglePlay } = useMusic();

  useEffect(() => {
    // Show prompt if music is not playing after 3 seconds
    const timer = setTimeout(() => {
      if (!isPlaying) {
        setShowPrompt(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPlaying]);

  const handleEnableMusic = () => {
    togglePlay();
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm mx-auto sm:mx-0">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <FiVolume2 className="text-gray-600 dark:text-gray-400" size={20} />
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Enable Background Music by Hans Zimmer
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              Click to start the background music by Hans Zimmer.
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
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