import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, Target, Settings, Home } from 'lucide-react';

const Sidebar = () => {
    const location = useLocation();

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
        { icon: Receipt, label: 'Transactions', path: '/transactions' },
        { icon: Target, label: 'Goals', path: '/goals' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="w-64 bg-white border-r border-border-subtle h-screen fixed left-0 top-0 flex flex-col">
            {/* Logo */}
            <div className="p-6 border-b border-border-subtle">
                <Link to="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-blue-navy">WalletWise</span>
                    <span className="text-xl font-bold text-purple-primary">AI</span>
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${active
                                    ? 'bg-gradient-to-r from-green-primary to-blue-primary text-white shadow-md'
                                    : 'text-text-main hover:bg-gray-100'
                                }`}
                        >
                            <Icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Back to Home Button */}
            <div className="p-4 border-t border-border-subtle">
                <Link
                    to="/"
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-primary to-blue-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                    <Home size={20} />
                    <span>Back to Home</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
