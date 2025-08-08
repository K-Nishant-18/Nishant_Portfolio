import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Import all necessary components and providers
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Projects from './pages/Projects';
import GuestBook from './pages/GuestBook';
import Collaborate from './pages/Collaborate';
import Gallery from './components/Gallery';
import Loader from './components/Loader';
import MusicPrompt from './components/MusicPrompt';
import CustomCursor from './components/CustomCursor';
import ThemeProvider from './context/ThemeContext';
import { MusicProvider } from './context/MusicContext';
import { TransitionProvider } from './context/TransitionContext';
import Transition from './components/Transition';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);
  // Create a ref for the reveal animation element
  const revealRef = useRef(null);

  // This effect manages the loader's visibility duration
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500); // Loader is visible for 2.5 seconds
    return () => clearTimeout(timer);
  }, []);

  // This effect runs the reveal animation once the loader is finished
  useEffect(() => {
    // Check if loading is complete and the reveal element is available
    if (!loading && revealRef.current) {
      // Animate the curtain up to reveal the content
      gsap.to(revealRef.current, {
        yPercent: -100,
        duration: 2.0,
        backgroundColor: '#faf9f7',
        ease: 'power4.inOut',
        delay: 0.1, // A slight delay after the loader disappears
      });
    }
  }, [loading]); // The [loading] dependency ensures this runs when the loading state changes

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

  // While loading is true, only show the Loader component
  if (loading) {
    return <Loader />;
  }

  // Once loading is false, render the main application
  return (
    <ThemeProvider>
      <MusicProvider>
        <Router>
          <TransitionProvider>
            <div className="relative bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
              {/* This is the "curtain" element that will animate away */}
              <div
                ref={revealRef}
                className="fixed top-0 left-0 w-full h-full bg-gray-950 z-50"
              />

              {/* The rest of your application components */}
              <CustomCursor />
              <Navigation />
              <Transition />

              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/guestbook" element={<GuestBook />} />
                <Route path="/collaborate" element={<Collaborate />} />
                <Route path="/gallery" element={<Gallery />} />
              </Routes>

              <MusicPrompt />
            </div>
          </TransitionProvider>
        </Router>
      </MusicProvider>
    </ThemeProvider>
  );
}

export default App;