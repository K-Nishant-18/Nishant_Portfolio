import React from 'react';
import { FiStar, FiGitBranch, FiArrowUpRight } from 'react-icons/fi';

interface RepoCardProps {
    name: string;
    stars: number;
    forks: number;
    language: string;
    url: string;
    updated: string;
}

const RepoCard: React.FC<RepoCardProps> = ({ name, stars, forks, language, url, updated }) => {
    return (
        <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block border-t border-black/20 dark:border-white/20 py-4 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors duration-200"
        >
            <div className="flex items-baseline justify-between gap-4">
                {/* Left: Name and Language */}
                <div className="flex flex-col md:flex-row md:items-baseline gap-1 md:gap-4 flex-1 min-w-0">
                    <h4 className="text-lg font-bold text-black dark:text-white truncate group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                        {name}
                    </h4>
                    <span className="font-mono text-[10px] uppercase text-zinc-500 dark:text-zinc-400">
                        {language}
                    </span>
                </div>

                {/* Right: Stats and Icon */}
                <div className="flex items-center gap-6 md:gap-8 flex-shrink-0">
                    <div className="flex items-center gap-4 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                        <span className="flex items-center gap-1" title="Stars">
                            <FiStar /> {stars}
                        </span>
                        <span className="flex items-center gap-1" title="Forks">
                            <FiGitBranch /> {forks}
                        </span>
                    </div>
                    <FiArrowUpRight className="text-lg opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-black dark:text-white" />
                </div>
            </div>
        </a>
    );
};

export default RepoCard;
