import type { ReactNode } from 'react';

interface AuthLayoutProps {
    children: ReactNode;
    title: string;
    subtitle: string;
}

const AuthLayout = ({ children, title, subtitle }: AuthLayoutProps) => {
    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-primary via-purple-primary to-green-primary opacity-20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(16,185,129,0.15),transparent_50%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(109,40,217,0.15),transparent_50%)]"></div>

            {/* Decorative Blobs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-primary/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-primary/10 rounded-full blur-3xl"></div>

            {/* Auth Card */}
            <div className="relative z-10 w-full max-w-md mx-4">
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-border-subtle">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <span className="text-3xl font-bold text-blue-navy">WalletWise</span>
                            <span className="text-3xl font-bold text-purple-primary">AI</span>
                        </div>
                        <h1 className="text-3xl font-bold text-text-main mb-2">
                            {title}
                        </h1>
                        <p className="text-text-muted">
                            {subtitle}
                        </p>
                    </div>

                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;
