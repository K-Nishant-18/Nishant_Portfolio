import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { FiArrowRight, FiX, FiMoreHorizontal, FiTrash2, FiCheck, FiBookOpen, FiLogOut } from 'react-icons/fi';
import { useGoogleLogin } from '@react-oauth/google';

interface GuestBookEntry {
  id: number;
  name: string;
  message: string;
  created_at: string;
}

interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

const FloatingGuestbook: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [entries, setEntries] = useState<GuestBookEntry[]>([]);
  const [formData, setFormData] = useState({ name: '', message: '' });
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [myEntryIds, setMyEntryIds] = useState<number[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);

  const location = useLocation();

  // Magnetic Button Refs
  const magnetRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // API configuration matching the existing GuestBook page
  const rawApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
  const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) + '/api' : rawApiUrl;

  // Sync self-created posts from LocalStorage
  useEffect(() => {
    const stored = localStorage.getItem('myGuestbookEntries');
    if (stored) {
      setMyEntryIds(JSON.parse(stored));
    }
  }, []);

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/guestbook`);
      const data = await res.json();
      setEntries(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch guestbook entries:', err);
      setEntries([]);
    }
  }, [API_URL]);

  // Fetch entries when drawer opens; reset google user on close
  useEffect(() => {
    if (isOpen) {
      fetchEntries();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      // Reset sign-in state each time drawer is closed
      setGoogleUser(null);
      setFormData({ name: '', message: '' });
      setStatus(null);
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, fetchEntries]);

  // Google Login handler — fetches profile info after token exchange
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsSigningIn(true);
      try {
        const res = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        const user: GoogleUser = {
          name: profile.name || profile.given_name || 'Guest',
          email: profile.email || '',
          picture: profile.picture || '',
        };
        setGoogleUser(user);
        setFormData(prev => ({ ...prev, name: user.name }));
      } catch (err) {
        console.error('Failed to fetch Google profile:', err);
      } finally {
        setIsSigningIn(false);
      }
    },
    onError: () => setIsSigningIn(false),
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!magnetRef.current) return;
    const rect = magnetRef.current.getBoundingClientRect();
    const x = e.clientX - (rect.left + rect.width / 2);
    const y = e.clientY - (rect.top + rect.height / 2);

    // Dynamic magnetic pull using GSAP
    gsap.to(magnetRef.current, {
      x: x * 0.4,
      y: y * 0.4,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    if (!magnetRef.current) return;
    gsap.to(magnetRef.current, {
      x: 0,
      y: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  const handleMouseEnter = () => {
    // No-op or styling effects if needed
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.message.trim()) return;

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_URL}/guestbook`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setStatus('success');
        setFormData({ name: '', message: '' });
        
        // Save the new entry ID to localStorage to enable deletion later
        const updatedIds = [...myEntryIds, data.id];
        setMyEntryIds(updatedIds);
        localStorage.setItem('myGuestbookEntries', JSON.stringify(updatedIds));

        // Refetch logs immediately to show the new entry
        await fetchEntries();
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setStatus(null), 3500);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_URL}/guestbook/${id}`, { method: 'DELETE' });
      if (response.ok) {
        // Remove locally and refetch
        const updated = myEntryIds.filter(item => item !== id);
        setMyEntryIds(updated);
        localStorage.setItem('myGuestbookEntries', JSON.stringify(updated));
        await fetchEntries();
      }
    } catch (err) {
      console.error('Failed to delete entry:', err);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear().toString().substring(2)}`;
    } catch {
      return '00/00/00';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '00:00';
    }
  };

  // Hide the floating button on the dedicated guestbook page
  if (location.pathname === '/guestbook') {
    return null;
  }

  return (
    <>
      {/* ── Mobile: circular FAB at bottom-right ── */}
      <div className="sm:hidden fixed bottom-6 right-6 z-40 select-none pointer-events-auto">
        <button
          onClick={() => setIsOpen(true)}
          data-cursor="pointer"
          aria-label="Open Guestbook Drawer"
          className="cursor-none w-12 h-12 rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(185,28,28,0.45)] active:scale-95 transition-transform duration-150"
          style={{ background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)' }}
        >
          <FiBookOpen size={17} className="text-white" />
        </button>
      </div>

      {/* ── Desktop: bookmark side-tab anchored to the right edge ── */}
      <div className="hidden sm:block fixed right-0 top-1/2 -translate-y-1/2 z-40 select-none pointer-events-auto">
        <button
          ref={magnetRef}
          onClick={() => setIsOpen(true)}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          data-cursor="pointer"
          aria-label="Open Guestbook Drawer"
          className="cursor-none group block"
        >
          {/* Slides left on hover like pulling a physical bookmark */}
          <div className="transition-transform duration-300 ease-out group-hover:-translate-x-1">
            {/* Tab body */}
            <div
              className="relative flex flex-col items-center gap-3 py-5 px-[10px] shadow-[-4px_0_24px_rgba(185,28,28,0.4)] transition-all duration-300"
              style={{
                background: 'linear-gradient(180deg, #dc2626 0%, #991b1b 100%)',
                borderRadius: '8px 0 0 8px',
                minHeight: '110px',
              }}
            >
              {/* Inner shine */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  borderRadius: '8px 0 0 8px',
                  background: 'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 55%)',
                }}
              />

              {/* Icon */}
              <FiBookOpen size={15} className="text-white flex-shrink-0 relative z-10" />

              {/* Vertical label */}
              <span
                className="relative z-10 font-mono font-semibold text-white text-[9px] uppercase tracking-[0.25em] leading-none select-none"
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
              >
                Guestbook
              </span>

              {/* Bookmark notch point */}
              <div
                className="absolute -bottom-[10px] left-0 right-0 h-[10px]"
                style={{
                  background: '#991b1b',
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                }}
              />
            </div>
          </div>
        </button>
      </div>

      {/* Slide-out Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-50 cursor-none"
              data-cursor="pointer"
            />

            {/* Main Drawer Panel */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full sm:w-[480px] md:w-[560px] bg-white dark:bg-zinc-950 border-l border-black/10 dark:border-zinc-800 z-50 shadow-2xl flex flex-col font-sans text-black dark:text-white"
            >
              {/* Swiss grid overlay inside the drawer */}
              <div className="absolute inset-0 pointer-events-none z-0 opacity-5">
                <div className="w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
              </div>

              {/* Drawer Header */}
              <div className="relative z-10 p-6 border-b border-black/5 dark:border-zinc-800 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tighter uppercase">GUESTBOOK</h2>
                  <div className="flex items-center gap-2 mt-1 font-mono text-[10px] uppercase text-gray-500 tracking-wider">
                    <span>Public Log v.1.0</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-green-600 dark:text-green-400">ONLINE</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 border border-black/10 dark:border-zinc-800 rounded-full flex items-center justify-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors duration-300"
                  aria-label="Close drawer"
                  style={{ cursor: 'none' }}
                >
                  <FiX size={16} />
                </button>
              </div>

              {/* Scrollable Content Container */}
              <div className="flex-1 overflow-y-auto relative z-10 p-6 space-y-8 scrollbar-thin scrollbar-thumb-zinc-200 dark:scrollbar-thumb-zinc-800">
                
                {/* Form Section */}
                <div className="space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 border-b border-black/5 dark:border-zinc-900 pb-1">
                    01. Write a message
                  </h3>

                  {/* ── Not signed in: show Google sign-in gate ── */}
                  {!googleUser ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-6">
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-12 h-12 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center">
                          <FiBookOpen size={20} className="text-gray-400" />
                        </div>
                        <p className="font-mono text-xs text-gray-500 uppercase tracking-widest">Sign in to leave a message</p>
                        <p className="text-[11px] text-gray-400 dark:text-zinc-500 font-sans">Your identity is verified via Google.</p>
                      </div>

                      <button
                        onClick={() => { setIsSigningIn(true); googleLogin(); }}
                        disabled={isSigningIn}
                        className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded-full shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60 group"
                        style={{ cursor: 'none' }}
                      >
                        {/* Google "G" SVG logo */}
                        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                          <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                        </svg>
                        <span className="font-sans text-sm font-medium text-gray-700 dark:text-gray-200">
                          {isSigningIn ? 'Signing in…' : 'Continue with Google'}
                        </span>
                      </button>
                    </div>

                  ) : (
                    /* ── Signed in: show user badge + message form ── */
                    <div className="space-y-5">
                      {/* User identity badge */}
                      <div className="flex items-center justify-between py-2 px-3 bg-black/[0.03] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 rounded">
                        <div className="flex items-center gap-3">
                          <img
                            src={googleUser.picture}
                            alt={googleUser.name}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="font-mono text-xs font-semibold text-black dark:text-white uppercase tracking-wide">{googleUser.name}</div>
                            <div className="font-mono text-[9px] text-gray-400 tracking-wider">{googleUser.email}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => { setGoogleUser(null); setFormData({ name: '', message: '' }); }}
                          className="flex items-center gap-1 font-mono text-[9px] uppercase tracking-wider text-gray-400 hover:text-red-500 transition-colors"
                          style={{ cursor: 'none' }}
                          title="Sign out"
                        >
                          <FiLogOut size={11} />
                          Not you?
                        </button>
                      </div>

                      {/* Message-only form */}
                      <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="group relative">
                          <label className="block font-mono text-[10px] uppercase tracking-widest mb-1 text-gray-400 group-focus-within:text-black dark:group-focus-within:text-white transition-colors">
                            Your Message
                          </label>
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            rows={4}
                            placeholder="Love your portfolio design!"
                            className="w-full bg-transparent border-b border-gray-200 dark:border-zinc-800 py-2 text-base font-light focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-300 dark:placeholder-zinc-700 resize-none font-mono text-sm"
                          />
                        </div>

                        <div className="flex items-center gap-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="h-10 px-6 bg-black dark:bg-white text-white dark:text-black font-mono text-[10px] uppercase tracking-widest hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center gap-3"
                            style={{ cursor: 'none' }}
                          >
                            {isSubmitting ? 'SENDING...' : 'SEND'}
                            {!isSubmitting && <FiArrowRight className="w-3.5 h-3.5" />}
                          </button>

                          {status === 'success' && (
                            <span className="font-mono text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1.5 animate-pulse">
                              <FiCheck /> SENT
                            </span>
                          )}
                          {status === 'error' && (
                            <span className="font-mono text-[10px] text-red-600 flex items-center gap-1.5">
                              <FiX /> ERROR
                            </span>
                          )}
                        </div>
                      </form>
                    </div>
                  )}
                </div>

                {/* Log Stream Section */}
                <div className="space-y-4">
                  <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 border-b border-black/5 dark:border-zinc-900 pb-1">
                    02. Stream Log
                  </h3>

                  <div className="border border-gray-100 dark:border-zinc-900 divide-y divide-gray-100 dark:divide-zinc-900 rounded bg-zinc-50/50 dark:bg-zinc-950/50">
                    {entries.length === 0 ? (
                      <div className="p-8 font-mono text-xs text-gray-400 text-center">
                        [NO DATA DETECTED]
                      </div>
                    ) : (
                      entries.map((entry) => (
                        <div
                          key={entry.id}
                          className="log-entry group relative p-4 flex gap-4 hover:bg-gray-100/50 dark:hover:bg-zinc-900/30 transition-colors"
                        >
                          {/* Left: Time column */}
                          <div className="w-16 flex-shrink-0 font-mono text-[10px] text-gray-400 select-none">
                            <div>{formatDate(entry.created_at)}</div>
                            <div className="opacity-50 mt-0.5">{formatTime(entry.created_at)}</div>
                          </div>

                          {/* Right: Message Content */}
                          <div className="flex-1 min-w-0">
                            <div className="font-mono text-xs font-semibold text-black dark:text-white uppercase mb-1 truncate">
                              {entry.name}
                            </div>
                            <p className="text-xs font-light text-zinc-600 dark:text-zinc-400 leading-relaxed font-sans break-words">
                              {entry.message}
                            </p>
                          </div>

                          {/* Deletion Option */}
                          {myEntryIds.includes(entry.id) && (
                            <div className="flex-shrink-0 flex items-start">
                              <button
                                onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)}
                                className="p-1 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors text-gray-400 hover:text-black dark:hover:text-white"
                                style={{ cursor: 'none' }}
                                aria-label="More actions"
                              >
                                <FiMoreHorizontal size={14} />
                              </button>

                              {openMenuId === entry.id && (
                                <button
                                  onClick={() => {
                                    handleDelete(entry.id);
                                    setOpenMenuId(null);
                                  }}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white font-mono text-[9px] uppercase px-2 py-1.5 rounded flex items-center gap-1 z-10 transition-colors shadow-lg"
                                  style={{ cursor: 'none' }}
                                >
                                  <FiTrash2 size={10} /> Delete
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="relative z-10 p-4 border-t border-black/5 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 font-mono text-[9px] uppercase tracking-widest text-center text-gray-400">
                // END OF STREAM LOG //
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default FloatingGuestbook;
