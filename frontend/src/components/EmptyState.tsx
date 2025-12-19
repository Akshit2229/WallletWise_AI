import React from 'react';

interface EmptyStateProps {
    icon: React.ComponentType<{ className?: string; size?: number }>;
    title: string;
    description: string;
    actionButton?: React.ReactNode;
}

const EmptyState = ({ icon: Icon, title, description, actionButton }: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Icon className="text-gray-400" size={32} />
            </div>
            <h3 className="text-xl font-semibold text-text-main mb-2">{title}</h3>
            <p className="text-text-muted text-center mb-6 max-w-md">{description}</p>
            {actionButton && <div>{actionButton}</div>}
        </div>
    );
};

export default EmptyState;
