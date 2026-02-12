import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';

interface GuestBookEntry {
    id: number;
    name: string;
    message: string;
    created_at: string;
}

const GuestBook: React.FC = () => {
    const [entries, setEntries] = useState<GuestBookEntry[]>([]);
    const [formData, setFormData] = useState({ name: '', message: '' });
    const [status, setStatus] = useState<null | 'success' | 'error'>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [myEntryIds, setMyEntryIds] = useState<number[]>([]);
    const [openMenuId, setOpenMenuId] = useState<number | null>(null);

    const containerRef = useRef<HTMLDivElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLDivElement>(null);
    const entriesRef = useRef<HTMLDivElement>(null);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    useEffect(() => {
        fetchEntries();

        // Load my entry IDs from localStorage
        const stored = localStorage.getItem('myGuestbookEntries');
        if (stored) {
            setMyEntryIds(JSON.parse(stored));
        }

        // Entrance animations
        const ctx = gsap.context(() => {
            const tl = gsap.timeline();

            tl.from(headerRef.current, {
                y: 50,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out'
            })
                .from(formRef.current, {
                    x: -30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.4')
                .from(entriesRef.current, {
                    x: 30,
                    opacity: 0,
                    duration: 0.8,
                    ease: 'power3.out'
                }, '-=0.6');
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (openMenuId !== null) {
                setOpenMenuId(null);
            }
        };

        if (openMenuId !== null) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [openMenuId]);


    useEffect(() => {
        // Fade in new entries
        if (entries.length > 0 && entriesRef.current) {
            const entryElements = entriesRef.current.querySelectorAll('.entry-item');
            gsap.from(entryElements, {
                opacity: 0,
                y: 20,
                duration: 0.5,
                stagger: 0.1,
                ease: 'power2.out',
                clearProps: 'all'
            });
        }
    }, [entries.length]);

    async function fetchEntries() {
        try {
            const res = await fetch(`${API_URL}/guestbook`);
            const data = await res.json();
            setEntries(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch guestbook entries:', err);
            setEntries([]);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus(null);

        try {
            const response = await fetch(`${API_URL}/guestbook`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const result = await response.json();
                setStatus('success');
                setFormData({ name: '', message: '' });

                // Store this entry as mine
                const newEntryId = result.id;
                if (newEntryId) {
                    const updated = [...myEntryIds, newEntryId];
                    setMyEntryIds(updated);
                    localStorage.setItem('myGuestbookEntries', JSON.stringify(updated));
                }

                setTimeout(() => setStatus(null), 3000);
                fetchEntries();
            } else {
                setStatus('error');
                setTimeout(() => setStatus(null), 3000);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            setStatus('error');
            setTimeout(() => setStatus(null), 3000);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Delete this entry?')) return;

        try {
            const response = await fetch(`${API_URL}/guestbook/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                // Remove from my entries
                const updated = myEntryIds.filter(entryId => entryId !== id);
                setMyEntryIds(updated);
                localStorage.setItem('myGuestbookEntries', JSON.stringify(updated));
                fetchEntries();
            }
        } catch (error) {
            console.error('Error deleting entry:', error);
        }
    };

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return '';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
            <Navbar />

            <div ref={containerRef} className="pt-32 pb-20 px-4 sm:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header - Apple-style */}
                    <div ref={headerRef} className="mb-20 text-center">
                        <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extralight tracking-tighter mb-6
                                     bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700
                                     dark:from-gray-100 dark:via-gray-200 dark:to-gray-400
                                     bg-clip-text text-transparent">
                            GuestBook
                        </h1>
                        <p className="text-xl sm:text-2xl font-light text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-4">
                            Leave a note, say hi, or share your thoughts
                        </p>
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                                      bg-gray-100 dark:bg-gray-800/50 backdrop-blur-sm
                                      border border-gray-200/50 dark:border-gray-700/50">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                            <span className="text-sm font-light text-gray-600 dark:text-gray-400">
                                {entries.length} {entries.length === 1 ? 'signature' : 'signatures'}
                            </span>
                        </div>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                        {/* Left: Form - Glassmorphism */}
                        <div ref={formRef} className="relative">
                            {/* Soft glow effect */}
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 
                                          dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20
                                          blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-3xl"></div>

                            <div className="relative backdrop-blur-xl bg-white/60 dark:bg-gray-900/60 
                                          border border-gray-200/50 dark:border-gray-700/50
                                          rounded-xl p-8 sm:p-10 shadow-2xl shadow-gray-200/50 dark:shadow-black/50
                                          group">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="group/field">
                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Your Name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            className="w-full px-0 py-3 bg-transparent border-b border-gray-300 dark:border-gray-700 
                             text-lg font-light
                             focus:outline-none focus:border-black dark:focus:border-white 
                             transition-all duration-300
                             placeholder-gray-400 dark:placeholder-gray-500
                             disabled:opacity-50"
                                        />
                                    </div>

                                    <div className="group">
                                        <textarea
                                            name="message"
                                            placeholder="Your Message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            disabled={isSubmitting}
                                            rows={4}
                                            className="w-full px-0 py-3 bg-transparent border-b border-gray-300 dark:border-gray-700 
                             text-lg font-light resize-none
                             focus:outline-none focus:border-black dark:focus:border-white 
                             transition-all duration-300
                             placeholder-gray-400 dark:placeholder-gray-500
                             disabled:opacity-50"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="group flex items-center gap-2 px-8 py-3 bg-black dark:bg-white text-white dark:text-black 
                           rounded-full hover:opacity-80 transition-all duration-300
                           text-base font-light disabled:opacity-50
                           hover:gap-3"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                                </svg>
                                                Signing...
                                            </>
                                        ) : (
                                            <>
                                                Sign GuestBook
                                                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                                </svg>
                                            </>
                                        )}
                                    </button>

                                    {status === 'success' && (
                                        <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 animate-fadeIn">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            Thanks for signing!
                                        </div>
                                    )}

                                    {status === 'error' && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 animate-fadeIn">
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                            Something went wrong.
                                        </div>
                                    )}
                                </form>
                            </div>
                        </div>

                        {/* Right: Entries */}
                        <div ref={entriesRef}>
                            <h2 className="text-2xl font-light mb-8 pb-3 border-b border-gray-200 dark:border-gray-800 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                                Recent Signatures
                            </h2>

                            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {entries.length === 0 ? (
                                    <div className="text-center py-12">
                                        <svg className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                        </svg>
                                        <p className="text-gray-400 dark:text-gray-500 italic">
                                            No entries yet. Be the first!
                                        </p>
                                    </div>
                                ) : (
                                    entries.map((entry) => (
                                        <div
                                            key={entry.id}
                                            className="entry-item group relative"
                                        >
                                            {/* Apple-style card */}
                                            <div className="relative p-6 rounded-xl mb-4
                                                          backdrop-blur-sm bg-white/40 dark:bg-gray-900/40
                                                          border border-gray-200/50 dark:border-gray-700/50
                                                          shadow-lg shadow-gray-200/20 dark:shadow-black/20
                                                          hover:shadow-xl hover:shadow-gray-200/30 dark:hover:shadow-black/30
                                                          hover:scale-[1.01] transition-all duration-300">
                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <p className="text-base font-normal text-gray-800 dark:text-gray-200 flex-1 leading-relaxed">
                                                        {entry.message}
                                                    </p>

                                                    {/* Three-dot menu (only for own entries) */}
                                                    {myEntryIds.includes(entry.id) && (
                                                        <div className="relative">
                                                            <button
                                                                onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)}
                                                                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded
                                                                     text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                                                                     transition-colors duration-300"
                                                                title="Options"
                                                            >
                                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                                                </svg>
                                                            </button>

                                                            {/* Dropdown menu */}
                                                            {openMenuId === entry.id && (
                                                                <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-gray-800 
                                                                          border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg 
                                                                          overflow-hidden z-10 animate-fadeIn">
                                                                    <button
                                                                        onClick={() => {
                                                                            handleDelete(entry.id);
                                                                            setOpenMenuId(null);
                                                                        }}
                                                                        className="w-full px-4 py-2 text-left text-sm
                                                                             text-red-600 dark:text-red-400
                                                                             hover:bg-red-50 dark:hover:bg-red-900/20
                                                                             transition-colors duration-200
                                                                             flex items-center gap-2"
                                                                    >
                                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                        </svg>
                                                                        Delete
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                                        <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                        </svg>
                                                        {entry.name}
                                                    </span>
                                                    {entry.created_at && (
                                                        <span className="text-gray-500 dark:text-gray-400 font-light">
                                                            {formatDate(entry.created_at)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 3px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #374151;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #4b5563;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default GuestBook;
