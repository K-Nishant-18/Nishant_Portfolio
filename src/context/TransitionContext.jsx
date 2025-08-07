// src/context/TransitionContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const TransitionContext = createContext();

export const TransitionProvider = ({ children }) => {
  const [timeline, setTimeline] = useState(null);
  const navigate = useNavigate();

  const playTransition = (path) => {
    if (timeline) {
      timeline.play(0); // Play the timeline from the beginning
      setTimeout(() => {
        navigate(path);
      }, 1000); // Duration must be long enough for the IN-animation
    }
  };

  return (
    <TransitionContext.Provider value={{ timeline, setTimeline, playTransition }}>
      {children}
    </TransitionContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useTransition = () => {
  return useContext(TransitionContext);
};