import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { AnimatePresence } from 'framer-motion';

// Import all necessary components and providers
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import GuestBook from './pages/GuestBook';
import Loader from './components/Loader';

import CustomCursor from './components/CustomCursor';
import ThemeProvider from './context/ThemeContext';
import { MusicProvider } from './context/MusicContext';
import { TransitionProvider } from './context/TransitionContext';
import Transition from './components/Transition';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  // Force scroll to top on mount and disable browser scroll restoration
  useEffect(() => {
    // Disable browser's native scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Force scroll to top immediately
    window.scrollTo(0, 0);
  }, []);



  // This effect sets up the Lenis smooth scroll library
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);

    const tickerCallback = (time) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerCallback);
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(tickerCallback);
    };
  }, []);

  // Handler for when loader animation completes
  const handleLoaderComplete = () => {
    // Start showing content immediately when loader exit begins
    setShowContent(true);
    // Remove loader after animation completes
    setTimeout(() => {
      setLoading(false);
    }, 100);
  };

  // Once loading is false, render the main application
  return (
    <ThemeProvider>
      <MusicProvider>
        <Router>
          <TransitionProvider>
            <div className="relative bg-gray-50 dark:bg-black text-gray-900 dark:text-gray-100 min-h-screen overflow-x-hidden">
              <AnimatePresence mode="wait">
                {loading && <Loader key="loader" onComplete={handleLoaderComplete} />}
              </AnimatePresence>

              {/* Main content - starts fading in when showContent is true */}
              <div
                className={`transition-opacity duration-700 ${showContent ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                style={{ visibility: showContent ? 'visible' : 'hidden' }}
              >
                <CustomCursor />
                <Navigation />
                <Transition />

                <Routes>
                  <Route path="/" element={<Home startAnimation={showContent} />} />
                  <Route path="/projects" element={<Projects />} />
                  <Route path="/projects/:id" element={<ProjectDetail />} />
                  <Route path="/guestbook" element={<GuestBook />} />
                </Routes>
              </div>
            </div>
          </TransitionProvider>
        </Router>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;