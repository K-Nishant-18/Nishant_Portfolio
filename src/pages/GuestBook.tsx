import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { FiArrowRight, FiX, FiCheck, FiMoreHorizontal, FiTrash2 } from 'react-icons/fi'; // Using Feather icons for sharp look
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
    const formRef = useRef<HTMLFormElement>(null);
    const streamRef = useRef<HTMLDivElement>(null);

    // In PROD: Use relative '/api' so Vercel rewrites handle it
    // In DEV: Use localhost or env var
    const rawApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
    // Remove duplicate /api if present to avoid /api/api/guestbook
    const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) + '/api' : rawApiUrl;

    useEffect(() => {
        fetchEntries();
        const stored = localStorage.getItem('myGuestbookEntries');
        if (stored) setMyEntryIds(JSON.parse(stored));

        // Swiss Entrance Animation
        const ctx = gsap.context(() => {
            // Hero Reveal
            gsap.from('.hero-char', {
                y: 100,
                opacity: 0,
                duration: 1,
                stagger: 0.05,
                ease: 'power4.out',
                delay: 0.2
            });

            // Divider Draw
            gsap.from('.divider-line', {
                scaleY: 0,
                duration: 1.5,
                ease: 'power3.inOut',
                transformOrigin: 'top center'
            });

            // Content Reveal
            gsap.from('.console-element', {
                x: -20,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power2.out',
                delay: 0.5
            });
        }, containerRef);
        return () => ctx.revert();
    }, []);

    // Staggered entry reveal when entries load
    useEffect(() => {
        if (entries.length > 0) {
            gsap.fromTo('.log-entry',
                { opacity: 0, x: 20 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
            );
        }
    }, [entries]);

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
                const updated = [...myEntryIds, result.id];
                setMyEntryIds(updated);
                localStorage.setItem('myGuestbookEntries', JSON.stringify(updated));
                setTimeout(() => setStatus(null), 3000);
                fetchEntries();
            } else {
                setStatus('error');
            }
        } catch (error) {
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('CONFIRM DELETION COMMAND?')) return;
        try {
            const response = await fetch(`${API_URL}/guestbook/${id}`, { method: 'DELETE' });
            if (response.ok) {
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
            return new Date(dateString).toLocaleDateString('en-US', {
                month: '2-digit', day: '2-digit', year: '2-digit'
            }).replace(/\//g, '.');
        } catch { return '00.00.00'; }
    };

    const formatTime = (dateString: string) => {
        try {
            return new Date(dateString).toLocaleTimeString('en-US', {
                hour12: false, hour: '2-digit', minute: '2-digit'
            });
        } catch { return '00:00'; }
    }

    return (
        <div ref={containerRef} className="min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
            <Navbar />

            {/* Swiss Background Grid */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="w-full h-full grid grid-cols-2 md:grid-cols-12 gap-0">
                    <div className="hidden md:block col-span-1 border-r border-black/5 dark:border-white/5 h-full"></div>
                    <div className="col-span-1 md:col-span-5 border-r border-black/10 dark:border-white/10 h-full divider-line origin-top"></div>
                    <div className="col-span-1 md:col-span-5 border-r border-black/5 dark:border-white/5 h-full"></div>
                    <div className="hidden md:block col-span-1 h-full"></div>
                </div>
            </div>

            <div className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-[1800px] mx-auto">

                {/* Header: Monumental */}
                <header className="mb-24 overflow-hidden">
                    <h1 className="text-[12vw] leading-[0.8] font-bold tracking-tighter uppercase mix-blend-difference text-black dark:text-white">
                        {"GUESTBOOK_".split('').map((char, i) => (
                            <span key={i} className="hero-char inline-block">{char}</span>
                        ))}
                    </h1>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-4 font-mono text-xs uppercase tracking-widest text-gray-500">
                        <div className="md:col-start-2 md:col-span-5">
                            // Sign the Guestbook
                        </div>
                        <div className="md:col-start-7 md:col-span-5 flex justify-between">
                            <span>Public Log v.1.0</span>
                            <span className="animate-pulse text-green-600 dark:text-green-400">● ONLINE</span>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-12">

                    {/* LEFT: Transmission Console (Form) */}
                    <div className="lg:col-span-5 lg:col-start-2 mb-20 lg:mb-0">
                        <div className="sticky top-32">
                            <form ref={formRef} onSubmit={handleSubmit} className="space-y-12">
                                <div className="space-y-8">
                                    <div className="console-element group relative">
                                        <label className="block font-mono text-xs uppercase tracking-widest mb-2 text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                                            01. Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="Your name..."
                                            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-800 py-4 text-xl font-light focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-300 dark:placeholder-gray-700 font-mono"
                                        />
                                    </div>

                                    <div className="console-element group relative">
                                        <label className="block font-mono text-xs uppercase tracking-widest mb-2 text-gray-500 group-hover:text-black dark:group-hover:text-white transition-colors">
                                            02. Message
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            rows={4}
                                            placeholder="Write something..."
                                            className="w-full bg-transparent border-b border-gray-300 dark:border-gray-800 py-4 text-xl font-light focus:outline-none focus:border-black dark:focus:border-white transition-colors placeholder-gray-300 dark:placeholder-gray-700 resize-none font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="console-element flex items-center gap-6">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="h-14 px-8 bg-black dark:bg-white text-white dark:text-black font-mono text-xs uppercase tracking-widest hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center gap-4"
                                    >
                                        {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                                        {!isSubmitting && <FiArrowRight className="w-4 h-4" />}
                                    </button>

                                    {status === 'success' && (
                                        <span className="font-mono text-xs text-green-600 dark:text-green-400 flex items-center gap-2">
                                            <FiCheck /> SENT
                                        </span>
                                    )}
                                    {status === 'error' && (
                                        <span className="font-mono text-xs text-red-600 flex items-center gap-2">
                                            <FiX /> ERROR
                                        </span>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: Incoming Stream (Entries) */}
                    <div className="lg:col-span-5" ref={streamRef}>
                        {/* Stream Header */}
                        <div className="flex justify-between border-b border-black dark:border-white pb-2 mb-0 font-mono text-xs uppercase tracking-widest text-gray-400">
                            <span className="w-24">Time</span>
                            <span className="flex-1 px-4">Log Data</span>
                            <span className="w-8">Ops</span>
                        </div>

                        <div className="border-l border-r border-gray-200 dark:border-gray-800">
                            {entries.length === 0 ? (
                                <div className="p-8 font-mono text-sm text-gray-400 text-center border-b border-gray-200 dark:border-gray-800">
                                    [NO DATA DETECTED]
                                </div>
                            ) : (
                                entries.map((entry) => (
                                    <div key={entry.id} className="log-entry group relative border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">

                                        <div className="flex items-stretch min-h-[5rem]">

                                            {/* Timestamp Col */}
                                            <div className="w-24 p-4 border-r border-gray-200 dark:border-gray-800 font-mono text-xs text-gray-400 leading-tight">
                                                <div className="group-hover:text-black dark:group-hover:text-white transition-colors">
                                                    {formatDate(entry.created_at)}
                                                </div>
                                                <div className="opacity-50 mt-1">{formatTime(entry.created_at)}</div>
                                            </div>

                                            {/* Content Col */}
                                            <div className="flex-1 p-4 flex flex-col justify-center">
                                                <div className="mb-2 font-mono text-xs uppercase tracking-wider text-black dark:text-white">
                                                    {entry.name}
                                                </div>
                                                <div className="text-sm font-light text-gray-600 dark:text-gray-300 leading-relaxed font-sans">
                                                    {entry.message}
                                                </div>
                                            </div>

                                            {/* Actions Col */}
                                            <div className="w-10 flex items-center justify-center relative">
                                                {myEntryIds.includes(entry.id) && (
                                                    <button
                                                        onClick={() => setOpenMenuId(openMenuId === entry.id ? null : entry.id)}
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-sm"
                                                    >
                                                        <FiMoreHorizontal />
                                                    </button>
                                                )}

                                                {/* Delete Menu */}
                                                {openMenuId === entry.id && (
                                                    <div className="absolute right-full mr-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs font-mono uppercase px-3 py-2 z-20 flex items-center gap-2 cursor-pointer hover:bg-red-600"
                                                        onClick={() => { handleDelete(entry.id); setOpenMenuId(null); }}
                                                    >
                                                        <FiTrash2 className="w-3 h-3" /> DELETE
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        <div className="mt-4 font-mono text-[10px] text-gray-400 uppercase text-center">
                              // End of Stream //
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default GuestBook;
