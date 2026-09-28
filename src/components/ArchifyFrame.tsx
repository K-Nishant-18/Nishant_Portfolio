import { useCallback, useEffect, useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';

interface ArchifyFrameProps {
    src: string;
    title: string;
    /** Height of the frame. The document lays itself out against the viewport
     *  height, so this must be explicit rather than a minimum. */
    height?: string;
}

/**
 * Embeds a standalone Archify document and keeps its theme pinned to the site
 * theme.
 *
 * The theme is part of the initial request only. Switching the site theme
 * afterwards pushes `data-theme` onto the already-loaded document (same-origin,
 * and the document re-themes itself via MutationObserver) instead of changing
 * `src`, which would re-download the whole document.
 */
const ArchifyFrame: React.FC<ArchifyFrameProps> = ({ src, title, height = 'clamp(460px, 76vh, 940px)' }) => {
    const { isDark } = useTheme();
    const frameRef = useRef<HTMLIFrameElement>(null);
    const [ready, setReady] = useState(false);

    const theme = isDark ? 'dark' : 'light';
    const [frameSrc] = useState(() => `${src}?theme=${isDark ? 'dark' : 'light'}`);

    const paint = useCallback((value: string) => {
        const root = frameRef.current?.contentDocument?.documentElement;
        root?.setAttribute('data-theme', value);
    }, []);

    // Re-assert on theme change.
    useEffect(() => {
        paint(theme);
    }, [theme, paint]);

    // The document is same-origin, so the theme is pushed on every load rather
    // than driven by state. An iframe fires `load` for its initial about:blank
    // document too, so a "ready" state set there would already be true when the
    // real document arrives and the push above would never run against it.
    const handleLoad = () => {
        paint(theme);
        setReady(true);
    };

    return (
        <div className="relative w-full">
            {!ready && (
                <div
                    className="absolute inset-0 flex items-center justify-center bg-white dark:bg-black pointer-events-none"
                    style={{ height }}
                >
                    <span className="text-[10px] uppercase tracking-widest text-gray-400 animate-pulse">
                        Loading diagram
                    </span>
                </div>
            )}
            <iframe
                ref={frameRef}
                src={frameSrc}
                title={title}
                loading="lazy"
                onLoad={handleLoad}
                className="block w-full border-0 bg-white dark:bg-black"
                style={{ height }}
            />
        </div>
    );
};

export default ArchifyFrame;
