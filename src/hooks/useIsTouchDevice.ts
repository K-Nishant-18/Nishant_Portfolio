// src/hooks/useIsTouchDevice.ts
import { useState, useEffect } from 'react';

export const useIsTouchDevice = () => {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    // The '(pointer: coarse)' media query is a modern and reliable
    // way to check for touch-first devices.
    const mediaQuery = window.matchMedia('(pointer: coarse)');

    const determineTouchDevice = (e: MediaQueryListEvent | MediaQueryList) => {
      setIsTouch(e.matches);
    };

    // Initial check
    determineTouchDevice(mediaQuery);

    // Listen for changes (e.g., if a user connects/disconnects a mouse)
    mediaQuery.addEventListener('change', determineTouchDevice);

    // Cleanup listener on component unmount
    return () => {
      mediaQuery.removeEventListener('change', determineTouchDevice);
    };
  }, []);

  return isTouch;
};