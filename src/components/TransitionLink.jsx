// src/components/TransitionLink.jsx
import React from 'react';
import { useTransition } from '../context/TransitionContext';

// Add the onClick prop here
const TransitionLink = ({ to, children, className, onClick }) => {
  const { playTransition } = useTransition();

  const handleClick = (e) => {
    e.preventDefault();
    
    // If an onClick prop is passed (like from the mobile menu), call it first!
    if (onClick) {
      onClick(e);
    }

    // Then, play the transition
    playTransition(to);
  };

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

export default TransitionLink;