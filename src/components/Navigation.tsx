import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
// @ts-ignore
import TransitionLink from './TransitionLink';
import { FiSun, FiMoon, FiMenu, FiX, FiDownload, FiVolume2, FiVolumeX } from 'react-icons/fi';
import { gsap } from 'gsap';
import { useTheme } from '../context/ThemeContext';
import { useMusic } from '../context/MusicContext';

const Navigation: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const { isMuted, toggleMute } = useMusic();
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power2.out' }
    );
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      gsap.to(mobileMenuRef.current, {
        opacity: 1,
        visibility: 'visible',
        duration: 0.3,
        ease: 'power2.out',
      });

      const menuItems = mobileMenuRef.current?.querySelectorAll('.menu-item');
      if (menuItems && menuItems.length > 0) {
        gsap.fromTo(
          menuItems,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.1 }
        );
      }
    } else {
      gsap.to(mobileMenuRef.current, {
        opacity: 0,
        visibility: 'hidden',
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isMenuOpen]);

  const downloadResume = () => {
    const link = document.createElement('a');
    link.href = '/previews/resume.pdf'; // Adjust the path to your resume file
    link.download = 'Kumar_Nishant_Resume.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Engineering', path: '/projects' },
    { name: 'GuestBook', path: '/guestbook' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-black/10 dark:border-white/10"
        style={{ cursor: 'none' }}
      >
        <div className="max-w-[1800px] mx-auto flex items-center justify-between">
          <TransitionLink
            to="/"
            className="text-xl font-light tracking-wider"
            style={{ cursor: 'none' }}
          >
            <div className="flex items-center tracking-tighter text-xl">
              <span className="text-red-600 font-bold">KUMAR</span>
              <span className="font-light ml-1 dark:text-white">NISHANT</span>
              <span className="text-red-600 font-bold ml-0.5">.</span>
            </div>
          </TransitionLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <TransitionLink
                key={item.name}
                to={item.path}
                className={`relative px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-300 group overflow-hidden ${location.pathname === item.path
                  ? 'text-black dark:text-white font-bold'
                  : 'text-gray-500 hover:text-black dark:hover:text-white'
                  }`}
                style={{ cursor: 'none' }}
              >
                <div className={`absolute inset-0 bg-black/5 dark:bg-white/5 transform origin-left transition-transform duration-300 ${location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></div>
                <span className="relative z-10 flex items-center gap-2">
                  {location.pathname === item.path && <span className="w-1 h-1 bg-red-500 rounded-full"></span>}
                  {item.name}
                </span>
              </TransitionLink>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {/* Resume Button */}
            <button
              onClick={downloadResume}
              className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-mono uppercase tracking-widest border border-black/10 dark:border-white/10 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 group"
              style={{ cursor: 'none' }}
            >
              <FiDownload size={12} className="group-hover:-translate-y-0.5 transition-transform duration-300" />
              <span>Resume</span>
            </button>

            {/* Divider */}
            <div className="hidden md:block w-px h-6 bg-black/10 dark:bg-white/10"></div>

            {/* Utility Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={toggleMute}
                className="hidden md:flex w-8 h-8 items-center justify-center border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300"
                aria-label="Toggle music"
                style={{ cursor: 'none' }}
              >
                {isMuted ? <FiVolumeX size={14} className="opacity-50" /> : <FiVolume2 size={14} />}
              </button>

              <button
                onClick={toggleTheme}
                className="w-8 h-8 flex items-center justify-center border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300"
                aria-label="Toggle theme"
                style={{ cursor: 'none' }}
              >
                {isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300"
              aria-label="Toggle menu"
              style={{ cursor: 'none' }}
            >
              {isMenuOpen ? <FiX size={14} /> : <FiMenu size={14} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-white/95 dark:bg-black/95 backdrop-blur-xl opacity-0 invisible md:hidden"
        style={{ cursor: 'none' }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8 relative">
          {/* Grid Background */}
          <div className="absolute inset-0 pointer-events-none opacity-5">
            <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
          </div>

          {navItems.map((item, index) => (
            <TransitionLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="menu-item text-4xl font-mono uppercase font-light tracking-tighter hover:text-red-500 transition-colors duration-300 flex items-center gap-4 group"
              style={{ cursor: 'none' }}
            >
              <span className="text-xs text-gray-400 font-mono tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">0{index + 1}</span>
              {item.name}
            </TransitionLink>
          ))}

          <div className="w-12 h-px bg-black/10 dark:bg-white/10 my-8"></div>

          <button
            onClick={() => {
              downloadResume();
              setIsMenuOpen(false);
            }}
            className="menu-item flex items-center gap-2 text-sm font-mono uppercase tracking-widest border border-black/10 dark:border-white/10 px-6 py-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
            style={{ cursor: 'none' }}
          >
            <FiDownload size={14} />
            <span>Download Resume</span>
          </button>

          <button
            onClick={toggleMute}
            className="menu-item flex items-center gap-2 text-sm font-mono uppercase tracking-widest border border-black/10 dark:border-white/10 px-6 py-3 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
            style={{ cursor: 'none' }}
          >
            {isMuted ? <FiVolumeX size={14} /> : <FiVolume2 size={14} />}
            <span>{isMuted ? 'Unmute Audio' : 'Mute Audio'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;