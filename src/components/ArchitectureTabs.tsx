import { useState } from 'react';
import { ProjectArchitecture } from '../data/projects';
import MermaidDiagram from './MermaidDiagram';

interface ArchitectureTabsProps {
    architecture: ProjectArchitecture;
    projectId: string;
}

const TABS = [
    { id: 'dataflow', label: 'Data Flow', sublabel: 'Request Lifecycle' },
    { id: 'hld', label: 'HLD', sublabel: 'High-Level Design' },
    { id: 'lld', label: 'LLD', sublabel: 'Low-Level Design' },
] as const;

type TabId = typeof TABS[number]['id'];

const ArchitectureTabs: React.FC<ArchitectureTabsProps> = ({ architecture, projectId }) => {
    const [active, setActive] = useState<TabId>('dataflow');

    const diagramMap: Record<TabId, string> = {
        dataflow: architecture.dataFlow,
        hld: architecture.hld,
        lld: architecture.lld,
    };

    return (
        <div className="w-full font-mono">
            {/* Tab Bar */}
            <div className="flex border-b border-black dark:border-white overflow-x-auto">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActive(tab.id)}
                        className={`group flex flex-col items-start px-6 py-4 border-r border-black/10 dark:border-white/10 transition-all duration-200 flex-shrink-0
                            ${active === tab.id
                                ? 'bg-black dark:bg-white text-white dark:text-black'
                                : 'bg-transparent text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 hover:text-black dark:hover:text-white'
                            }`}
                    >
                        <span className="text-xs font-bold tracking-widest uppercase">{tab.label}</span>
                        <span className={`text-[9px] tracking-wider mt-0.5 transition-colors ${active === tab.id ? 'text-white/60 dark:text-black/60' : 'text-gray-400'}`}>
                            {tab.sublabel}
                        </span>
                    </button>
                ))}
            </div>

            {/* Diagram Panel */}
            <div className="border border-t-0 border-black/10 dark:border-white/10 bg-white dark:bg-black min-h-[450px]">
                <MermaidDiagram
                    key={`${projectId}-${active}`}
                    code={diagramMap[active]}
                    id={`${projectId}-${active}`}
                    maxWidth={active === 'hld' || active === 'lld' ? '700px' : '100%'}
                />
            </div>
        </div>
    );
};

export default ArchitectureTabs;
