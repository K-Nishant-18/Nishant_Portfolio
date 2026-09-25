import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { FiArrowRight, FiCheck, FiX, FiTrash2 } from 'react-icons/fi';
import Navbar from '../components/Navigation';
import Footer from '../components/Footer';
import { loadMyEntries, saveMyEntries, type MyEntry } from '../lib/guestbook';

interface GuestBookEntry {
    id: number;
    name: string;
    message: string;
    email?: string;
    avatar?: string;
    created_at: string;
}

const GuestBook: React.FC = () => {
    const [entries, setEntries] = useState<GuestBookEntry[]>([]);
    const [formData, setFormData] = useState({ name: '', message: '' });
    const [status, setStatus] = useState<null | 'success' | 'error'>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [myEntries, setMyEntries] = useState<MyEntry[]>([]);
    const freshIds = useRef<Set<number>>(new Set());

    const containerRef = useRef<HTMLDivElement>(null);
    const streamRef = useRef<HTMLDivElement>(null);
    const countRef = useRef<HTMLSpanElement>(null);

    // In PROD: Use relative '/api' so Vercel rewrites handle it
    // In DEV: Use localhost or env var
    const rawApiUrl = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
    // Remove duplicate /api if present to avoid /api/api/guestbook
    const API_URL = rawApiUrl.endsWith('/api') ? rawApiUrl.slice(0, -4) + '/api' : rawApiUrl;

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

    useEffect(() => {
        fetchEntries();
        setMyEntries(loadMyEntries());

        // Swiss Entrance Animation
        const ctx = gsap.context(() => {
            // Hero Reveal
            gsap.from('.hero-char', {
                y: 120,
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
                y: 24,
                opacity: 0,
                duration: 0.8,
                stagger: 0.08,
                ease: 'power2.out',
                delay: 0.5
            });
        }, containerRef);
        return () => ctx.revert();
    }, [fetchEntries]);

    // Staggered entry reveal + live count-up when entries arrive
    useEffect(() => {
        if (entries.length > 0) {
            gsap.fromTo('.log-entry',
                { opacity: 0, x: 16 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.04, ease: 'power2.out' }
            );

            // Count-up the total signals
            if (countRef.current) {
                const target = { val: 0 };
                const el = countRef.current;
                gsap.to(target, {
                    val: entries.length,
                    duration: 1.4,
                    ease: 'power2.out',
                    overwrite: 'auto',
                    onUpdate: () => {
                        el.textContent = String(Math.round(target.val)).padStart(4, '0');
                    }
                });
            }
        }
    }, [entries]);

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
                if (result.id && result.editToken) {
                    const updated = [...myEntries, { id: result.id, editToken: result.editToken }];
                    setMyEntries(updated);
                    saveMyEntries(updated);
                    freshIds.current.add(result.id);
                } else {
                    saveMyEntries(myEntries);
                }
                setTimeout(() => setStatus(null), 3000);
                fetchEntries();
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Erase this signal? This cannot be undone.')) return;
        const entry = myEntries.find(e => e.id === id);
        if (!entry) return;
        try {
            const response = await fetch(`${API_URL}/guestbook/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${entry.editToken}` },
            });
            if (response.ok) {
                const updated = myEntries.filter(e => e.id !== id);
                setMyEntries(updated);
                saveMyEntries(updated);
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
    };

    const title = 'GUESTBOOK';
    const tickerNames = entries.length
        ? entries.slice(0, 40).map(e => e.name || 'ANON')
        : ['NO SIGNALS YET', 'BE THE FIRST', 'SIGN THE LOG'];

    return (
        <div ref={containerRef} className="relative min-h-screen bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-[#d80711] selection:text-white overflow-hidden">
            <style>{`
                @keyframes gb-marquee {
                    from { transform: translateX(0); }
                    to   { transform: translateX(-50%); }
                }
                @keyframes gb-blink {
                    0%, 60% { opacity: 1; }
                    61%, 100% { opacity: 0; }
                }
                .gb-marquee-track {
                    animation: gb-marquee 30s linear infinite;
                    will-change: transform;
                }
                .gb-marquee:hover .gb-marquee-track { animation-play-state: paused; }
                .gb-caret { animation: gb-blink 1.1s steps(1) infinite; }
                @media (prefers-reduced-motion: reduce) {
                    .gb-marquee-track { animation: none; }
                    .gb-caret { animation: none; }
                }
            `}</style>

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

            <div className="relative z-10 pt-24 md:pt-32 px-6 md:px-12 pb-20 max-w-[1800px] mx-auto">

                {/* ================= HERO ================= */}
                <header className="relative mb-16 md:mb-24 overflow-hidden">
                    {/* Top status bar */}
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-black/50 dark:text-white/50 border-b border-black/10 dark:border-white/10 py-3">
                        <span className="flex items-center gap-3">
                            <span className="text-[#d80711]">✕</span>
                            Kumar Nishant — Public Signal Log
                        </span>
                        <div className="flex items-center gap-6">
                            <span className="hidden md:inline text-black/60 dark:text-white/60">Log v.1.1</span>
                            <span className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                                Eavesdrop Live
                            </span>
                        </div>
                    </div>

                    {/* Monumental title */}
                    <div className="py-10 md:py-16">
                        <h1 className="font-['Anton',Impact,sans-serif] text-[19vw] md:text-[15vw] leading-[0.82] tracking-tight select-none">
                            <span className="hero-char inline-block">{title.slice(0, 5)}</span>
                            <span className="hero-char inline-block text-[#d80711]">{title.slice(5)}</span>
                            <span className="hero-char gb-caret inline-block text-[#d80711]">_</span>
                        </h1>
                    </div>

                    {/* Meta row: count / blurb / shortcut */}
                    <div className="flex flex-wrap items-end justify-between gap-8 border-t border-black/10 dark:border-white/10 pt-6">
                        <div>
                            <span className="block font-mono text-[10px] uppercase tracking-[0.28em] text-[#d80711] mb-1">Total Signals</span>
                            <span ref={countRef} className="block font-mono text-5xl md:text-6xl font-light tabular-nums">0000</span>
                        </div>
                        <p className="max-w-xs font-mono text-[11px] uppercase tracking-[0.18em] text-black/50 dark:text-white/50 leading-relaxed">
                            Leave a mark on the<br />
                            log before you leave orbit.
                        </p>
                        <a href="#sign"
                            className="group inline-flex items-center gap-3 font-mono text-xs uppercase tracking-[0.28em] text-black dark:text-white border border-black/20 dark:border-white/20 px-5 py-3 hover:bg-[#d80711] hover:text-white hover:border-[#d80711] transition-colors">
                            02 / Transmit
                            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                        </a>
                    </div>
                </header>

                {/* Ticker of visitor names */}
                <div className="gb-marquee relative z-10 overflow-hidden border-y border-black/10 dark:border-white/10 py-3 mb-16 md:mb-24">
                    <div className="gb-marquee-track flex w-max items-center">
                        {[0, 1].map(row => (
                            <div key={row} className="flex shrink-0 items-center" aria-hidden={row === 1}>
                                {tickerNames.map((name, i) => (
                                    <span key={`${row}-${i}`} className="flex items-center">
                                        <span className="whitespace-nowrap px-8 font-mono text-[11px] uppercase tracking-[0.3em] text-black/60 dark:text-white/60">
                                            {name}
                                        </span>
                                        <span className="text-[#d80711]">✦</span>
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                {/* ================= BODY ================= */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* LEFT: Transmission Console (Form) */}
                    <div className="lg:col-span-5 lg:col-start-2" id="sign">
                        <div className="sticky top-24 lg:top-28 console-element border border-black/15 dark:border-white/15">
                            {/* Card header */}
                            <div className="flex items-center justify-between border-b border-black/15 dark:border-white/15 px-5 py-3.5">
                                <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d80711]">
                                    02 / Transmission
                                </span>
                                <span className="font-mono text-[10px] tracking-[0.2em] text-black/40 dark:text-white/40">
                                    SIGNAL_IN
                                </span>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-10">
                                <div className="space-y-9">
                                    {/* Name */}
                                    <div className="group relative">
                                        <label className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] mb-1 text-black/50 dark:text-white/50 group-focus-within:text-[#d80711] transition-colors">
                                            <span>01</span> Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            maxLength={80}
                                            placeholder="Your name…"
                                            className="w-full bg-transparent py-3.5 font-mono text-xl font-light focus:outline-none placeholder-black/25 dark:placeholder-white/25"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-px bg-black/15 dark:bg-white/15" />
                                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#d80711] scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-500" />
                                    </div>

                                    {/* Message */}
                                    <div className="group relative">
                                        <label className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] mb-1 text-black/50 dark:text-white/50 group-focus-within:text-[#d80711] transition-colors">
                                            <span>02</span> Message
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            required
                                            maxLength={1000}
                                            rows={5}
                                            placeholder="Write something…"
                                            className="w-full bg-transparent py-3.5 font-mono text-lg font-light focus:outline-none placeholder-black/25 dark:placeholder-white/25 resize-none leading-relaxed"
                                        />
                                        <div className="absolute inset-x-0 bottom-0 h-px bg-black/15 dark:bg-white/15" />
                                        <div className="absolute inset-x-0 bottom-0 h-[2px] bg-[#d80711] scale-x-0 group-focus-within:scale-x-100 origin-left transition-transform duration-500" />
                                        <div className={`mt-2 text-right font-mono text-[10px] tracking-[0.2em] ${formData.message.length > 950 ? 'text-[#d80711]' : 'text-black/35 dark:text-white/35'}`}>
                                            {formData.message.length} / 1000
                                        </div>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="space-y-5">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="group relative w-full h-16 overflow-hidden bg-[#d80711] text-white font-mono text-xs uppercase tracking-[0.3em] disabled:opacity-50 flex items-center justify-center gap-4 transition-colors duration-300 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black"
                                    >
                                        {isSubmitting ? 'Transmitting…' : 'Transmit Signal'}
                                        {!isSubmitting && (
                                            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
                                        )}
                                    </button>

                                    <div className="flex items-center justify-center gap-4 min-h-6">
                                        {status === 'success' && (
                                            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-green-600 dark:text-green-400 flex items-center gap-2">
                                                <FiCheck /> Signal Received
                                            </span>
                                        )}
                                        {status === 'error' && (
                                            <span className="font-mono text-[11px] uppercase tracking-[0.24em] text-red-600 flex items-center gap-2">
                                                <FiX /> Transmission Failed
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT: Incoming Stream (Entries) */}
                    <div className="lg:col-span-5" ref={streamRef}>
                        <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.28em] text-black/50 dark:text-white/50 border-b border-black/15 dark:border-white/15 pb-3 mb-0">
                            <span className="flex items-center gap-3">
                                <span className="text-[#d80711]">01</span> Incoming Signals
                            </span>
                            <span className="tabular-nums">{entries.length.toString().padStart(4, '0')}</span>
                        </div>

                        <div className="border-x border-b border-black/15 dark:border-white/15">
                            {entries.length === 0 ? (
                                <div className="p-10 text-center font-mono text-xs uppercase tracking-[0.24em] text-black/40 dark:text-white/40 space-y-3">
                                    <div className="text-[#d80711] text-base">⟨ NO SIGNALS YET ⟩</div>
                                    <div>Be the first to sign the log →</div>
                                </div>
                            ) : (
                                entries.map((entry, i) => {
                                    const isMine = myEntries.some(e => e.id === entry.id);
                                    const isFresh = freshIds.current.has(entry.id);
                                    return (
                                        <div key={entry.id} className={`log-entry group relative flex items-stretch min-h-[6rem] border-b border-black/10 dark:border-white/10 last:border-b-0 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.05]`}>

                                            {/* Red hover accent */}
                                            <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#d80711] scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-300" />

                                            {/* Index */}
                                            <div className="w-12 flex items-end justify-center pb-5 font-mono text-[11px] text-black/35 dark:text-white/35 group-hover:text-[#d80711] transition-colors">
                                                {String(i + 1).padStart(3, '0')}
                                            </div>

                                            {/* Timestamp */}
                                            <div className="w-20 border-l border-r border-black/10 dark:border-white/10 p-4 flex flex-col justify-center font-mono text-[10px] text-black/40 dark:text-white/40 leading-tight">
                                                <div className="group-hover:text-black dark:group-hover:text-white transition-colors">{formatTime(entry.created_at)}</div>
                                                <div className="opacity-60 mt-1">{formatDate(entry.created_at)}</div>
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1 p-4 flex flex-col justify-center overflow-hidden">
                                                <div className="mb-2 flex items-center gap-2.5">
                                                    {entry.avatar ? (
                                                        <img
                                                            src={entry.avatar}
                                                            alt={entry.name}
                                                            className="w-6 h-6 rounded-full object-cover flex-shrink-0 border border-black/15 dark:border-white/15"
                                                            referrerPolicy="no-referrer"
                                                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div className="w-6 h-6 rounded-full bg-[#d80711]/10 text-[#d80711] flex items-center justify-center font-mono text-[10px] font-bold flex-shrink-0">
                                                            {entry.name ? entry.name.charAt(0).toUpperCase() : '?'}
                                                        </div>
                                                    )}
                                                    <span className="font-mono text-xs uppercase tracking-[0.22em] text-black dark:text-white truncate">
                                                        {entry.name}
                                                    </span>
                                                    {isMine && (
                                                        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-black bg-white dark:text-white dark:bg-black border border-black/20 dark:border-white/20 px-1.5 py-0.5">
                                                            You
                                                        </span>
                                                    )}
                                                    {isFresh && (
                                                        <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-white bg-[#d80711] px-1.5 py-0.5 animate-pulse">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="border-l-2 border-black/10 dark:border-white/10 pl-3 font-sans text-[15px] font-light text-black/70 dark:text-white/70 leading-relaxed line-clamp-3">
                                                    {entry.message}
                                                </div>
                                            </div>

                                            {/* Ops */}
                                            <div className="w-12 flex items-center justify-center border-l border-black/10 dark:border-white/10">
                                                {isMine && (
                                                    <button
                                                        onClick={() => handleDelete(entry.id)}
                                                        title="Delete this signal"
                                                        className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 flex items-center justify-center text-[#d80711] hover:bg-[#d80711] hover:text-white transition-colors"
                                                    >
                                                        <FiTrash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                        <div className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-black/40 dark:text-white/40 text-center">
                            ⟨ End of Signal Archive ⟩
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default GuestBook;