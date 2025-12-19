import type { ReactNode } from 'react';

interface ChartCardProps {
    children: ReactNode;
    title: string;
    className?: string;
}

const ChartCard = ({ children, title, className = '' }: ChartCardProps) => {
    return (
        <div className={`bg-white rounded-2xl shadow-lg p-6 border border-border-subtle hover:shadow-xl transition-shadow ${className}`}>
            <h3 className="text-lg font-bold text-text-main mb-4">{title}</h3>
            {children}
        </div>
    );
};

export default ChartCard;
