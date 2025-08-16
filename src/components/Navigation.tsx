import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
  const navRef = useRef<HTMLNavElement>(null);
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
      gsap.fromTo(
        mobileMenuRef.current?.querySelectorAll('.menu-item'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, delay: 0.1 }
      );
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
    { name: 'Projects', path: '/projects' },
    { name: 'GuestBook', path: '/guestbook' },
    { name: 'Collaborate', path: '/collaborate' },
    { name: 'Gallery', path: '/gallery' },
  ];

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 px-8 py-6 bg-gray-50/90 dark:bg-black/30 backdrop-blur-sm border-b border-gray-200/10 dark:border-gray-800/20"
        style={{ cursor: 'none' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <TransitionLink 
            to="/" 
            className="text-xl font-light tracking-wider"
            style={{ cursor: 'none' }}
          >
           <span className='text-red-600 font-bold'>KUMAR </span>NISHANT
          </TransitionLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-12">
            {navItems.map((item) => (
              <TransitionLink
                key={item.name}
                to={item.path}
                className={`text-sm font-light tracking-wide transition-colors duration-300 relative group ${
                  location.pathname === item.path
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
                style={{ cursor: 'none' }}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 h-px transition-all duration-300 ${
                  location.pathname === item.path 
                    ? 'w-full bg-gray-900 dark:bg-gray-100'
                    : 'w-0 bg-red-500 dark:bg-red-900 group-hover:w-full'
                }`}></span>
              </TransitionLink>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={downloadResume}
              className="hidden md:flex items-center space-x-2 px-4 py-2 text-sm font-light tracking-wide border border-gray-300 dark:border-gray-700 hover:bg-gray-900 dark:hover:bg-gray-100 hover:text-white dark:hover:text-gray-900 transition-all duration-300"
              style={{ cursor: 'none' }}
            >
              <FiDownload size={16} />
              <span>Resume</span>
            </button>

            <button
              onClick={toggleMute}
              className="hidden md:flex p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors duration-300"
              aria-label="Toggle music"
              style={{ cursor: 'none' }}
            >
              {isMuted ? <FiVolumeX size={18} /> : <FiVolume2 size={18} />}
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors duration-300"
              aria-label="Toggle theme"
              style={{ cursor: 'none' }}
            >
              {isDark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors duration-300"
              aria-label="Toggle menu"
              style={{ cursor: 'none' }}
            >
              {isMenuOpen ? <FiX size={18} /> : <FiMenu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className="fixed inset-0 z-40 bg-gray-50 dark:bg-gray-950 opacity-0 invisible md:hidden"
        style={{ cursor: 'none' }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {navItems.map((item) => (
            <TransitionLink
              key={item.name}
              to={item.path}
              onClick={() => setIsMenuOpen(false)}
              className="menu-item text-2xl font-light tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
              style={{ cursor: 'none' }}
            >
              {item.name}
            </TransitionLink>
          ))}
          <button
            onClick={() => {
              downloadResume();
              setIsMenuOpen(false);
            }}
            className="menu-item flex items-center space-x-2 text-2xl font-light tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
            style={{ cursor: 'none' }}
          >
            <FiDownload size={24} />
            <span>Resume</span>
          </button>
          
          <button
            onClick={() => {
              toggleMute();
              setIsMenuOpen(false);
            }}
            className="menu-item flex items-center space-x-2 text-2xl font-light tracking-wide hover:text-gray-600 dark:hover:text-gray-400 transition-colors duration-300"
            style={{ cursor: 'none' }}
          >
            {isMuted ? <FiVolumeX size={24} /> : <FiVolume2 size={24} />}
            <span>{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navigation;