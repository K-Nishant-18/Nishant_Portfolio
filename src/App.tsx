import React, { useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Projects from './pages/Projects';
import GuestBook from './pages/GuestBook';
import Collaborate from './pages/Collaborate';
import ThemeProvider from './context/ThemeContext';
import CustomCursor from './components/CustomCursor';
import Gallery from './components/Gallery';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Connect ScrollTrigger to Lenis
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        lenis.raf(time * 1000);
      });
    };
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="relative bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
          <CustomCursor />
          <Navigation />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/guestbook" element={<GuestBook />} />
            <Route path="/collaborate" element={<Collaborate />} />
            <Route path="/gallery" element={<Gallery />} />
            
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;