import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    code: string;
    id: string;
    maxWidth?: string;
}

// Initialize once globally
let initialized = false;
function ensureInit(isDark: boolean) {
    if (initialized) return;
    initialized = false; // always re-init on theme change - handled per render
    mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? 'dark' : 'neutral',
        themeVariables: {
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
            fontSize: '12px',
            primaryColor: isDark ? '#1a1a1a' : '#f0f0f0',
            primaryBorderColor: isDark ? '#ffffff' : '#000000',
            primaryTextColor: isDark ? '#ffffff' : '#000000',
            lineColor: isDark ? '#888888' : '#555555',
            secondaryColor: isDark ? '#111111' : '#e8e8e8',
            tertiaryColor: isDark ? '#0d0d0d' : '#fafafa',
            edgeLabelBackground: isDark ? '#000000' : '#ffffff',
            clusterBkg: isDark ? '#111111' : '#f5f5f5',
            titleColor: isDark ? '#ffffff' : '#000000',
            sequenceNumberColor: isDark ? '#ffffff' : '#000000',
        },
        flowchart: { curve: 'linear', htmlLabels: false },
        sequence: { useMaxWidth: true, actorMargin: 50 },
    });
}

const MermaidDiagram: React.FC<MermaidDiagramProps> = ({ code, id, maxWidth = '100%' }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const isDark = document.documentElement.classList.contains('dark');
        ensureInit(isDark);

        // Use a unique ID per invocation to avoid DOM ID conflicts
        const renderId = `mmd-${id}-${Date.now()}`;
        let cancelled = false;

        // Clear previous content
        containerRef.current.innerHTML = '';

        mermaid.render(renderId, code)
            .then(({ svg }) => {
                if (cancelled || !containerRef.current) return;
                containerRef.current.innerHTML = svg;

                const svgEl = containerRef.current.querySelector('svg');
                if (svgEl) {
                    svgEl.setAttribute('width', '100%');
                    svgEl.removeAttribute('height');
                    svgEl.style.maxWidth = maxWidth;
                    svgEl.style.width = '100%';
                    svgEl.style.height = 'auto';
                    svgEl.style.display = 'block';
                    svgEl.style.margin = '0 auto';
                }
            })
            .catch(() => {
                if (cancelled || !containerRef.current) return;
                containerRef.current.innerHTML =
                    `<div style="color:#ef4444;font-size:11px;padding:16px;font-family:monospace">
                        ⚠ Diagram render error — check Mermaid syntax
                    </div>`;
            });

        return () => {
            cancelled = true;
        };
    }, [code, id]);

    return (
        <div
            ref={containerRef}
            className="w-full overflow-x-auto p-6 flex justify-center"
            style={{ maxWidth: '100%' }}
        >
            {/* SVG injected by Mermaid */}
        </div>
    );
};

export default MermaidDiagram;
