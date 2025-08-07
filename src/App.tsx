import React, { useEffect, useRef, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// Your existing components and providers
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

// ✅ ADDED: Import the new transition components
import { TransitionProvider } from './context/TransitionContext';
import Transition from './components/Transition';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef(null); // Type annotation removed for JS/JSX compatibility
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

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

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
      gsap.ticker.remove((time) => {
        if (lenis) {
          lenis.raf(time * 1000);
        }
      });
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <ThemeProvider>
      <MusicProvider>
        {/* Router must be outside the TransitionProvider */}
        <Router>
          {/* ✅ ADDED: Wrap the main content with TransitionProvider */}
          <TransitionProvider>
            <div className="relative bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 min-h-screen">
              <CustomCursor />
              {/* Remember to update Navigation to use TransitionLink */}
              <Navigation />
              
              {/* ✅ ADDED: The visual transition component */}
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