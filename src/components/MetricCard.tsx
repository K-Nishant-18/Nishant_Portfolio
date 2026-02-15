
import React, { ReactNode } from 'react';

interface MetricCardProps {
    icon: ReactNode;
    title: string;
    value: string | number | React.ReactNode;
    description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ icon, title, value, description }) => {
    return (
        <div className="flex flex-col justify-between py-4 border-t border-black dark:border-white group">
            <div className="flex justify-between items-start mb-4">
                <h3 className="font-mono text-xs uppercase tracking-widest text-zinc-500 dark:text-zinc-400 group-hover:text-red-600 dark:group-hover:text-red-500 transition-colors">
                    {title}
                </h3>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-red-600 dark:text-red-500">
                    {/* Small icon on hover for context, keeping it minimal */}
                    <span className="text-lg">{icon}</span>
                </div>
            </div>

            <div>
                <span className="block text-4xl md:text-5xl font-bold tracking-tighter text-black dark:text-white mb-2">
                    {value}
                </span>
                <p className="text-xs font-light text-zinc-600 dark:text-zinc-400 max-w-[80%]">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default MetricCard;
