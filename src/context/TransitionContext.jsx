// src/context/TransitionContext.jsx
import React, { createContext, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const TransitionContext = createContext();

// Destination label shown inside the transition curtain.
const LABELS = {
  '/': 'HOME',
  '/projects': 'ENGINEERING',
  '/guestbook': 'GUESTBOOK',
};

const labelFor = (path) => {
  if (LABELS[path]) return LABELS[path];
  if (path.startsWith('/projects/')) return 'PROJECT';
  return path.replace(/^\//, '').toUpperCase() || 'HOME';
};

export const TransitionProvider = ({ children }) => {
  const [timeline, setTimeline] = useState(null);
  const [label, setLabel] = useState('HOME');
  const navigate = useNavigate();

  const playTransition = (path) => {
    const next = labelFor(path);
    setLabel(next); // Stamp the destination label into the overlay
    if (timeline) {
      timeline.play(0); // Play the timeline from the beginning
      setTimeout(() => {
        navigate(path); // Navigate once the screen is fully covered
      }, 1100); // Must align with the cover-in phase of the timeline
    }
  };

  return (
    <TransitionContext.Provider value={{ timeline, setTimeline, playTransition, label, setLabel }}>
      {children}
    </TransitionContext.Provider>
  );
};

// Custom hook for easy access to the context
export const useTransition = () => {
  return useContext(TransitionContext);
};