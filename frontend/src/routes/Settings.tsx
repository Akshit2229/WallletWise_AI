import Sidebar from '../components/Sidebar';
import { User, Bell, Lock, Palette, Database } from 'lucide-react';

const Settings = () => {
    const settingsSections = [
        {
            icon: User,
            title: 'Profile Settings',
            description: 'Update your personal information and preferences',
            color: 'from-blue-primary to-blue-navy',
        },
        {
            icon: Bell,
            title: 'Notifications',
            description: 'Manage your notification preferences and alerts',
            color: 'from-green-primary to-green-dark',
        },
        {
            icon: Lock,
            title: 'Security & Privacy',
            description: 'Control your security settings and data privacy',
            color: 'from-purple-primary to-purple-600',
        },
        {
            icon: Palette,
            title: 'Appearance',
            description: 'Customize the look and feel of your dashboard',
            color: 'from-gold-warm to-yellow-600',
        },
        {
            icon: Database,
            title: 'Data Management',
            description: 'Export, import, or delete your financial data',
            color: 'from-red-500 to-red-700',
        },
    ];

    return (
        <div className="flex h-screen bg-bg-light">
            <Sidebar />

            <div className="flex-1 ml-64 overflow-y-auto">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-navy to-purple-primary text-white py-8 px-8">
                    <div className="max-w-7xl mx-auto">
                        <h1 className="text-3xl font-bold mb-2">Settings</h1>
                        <p className="text-blue-soft">Manage your account and preferences</p>
                    </div>
                </div>

                {/* Content */}
                <div className="max-w-7xl mx-auto px-8 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {settingsSections.map((section, index) => {
                            const Icon = section.icon;

                            return (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all cursor-pointer group"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${section.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                            <Icon className="text-white" size={28} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-text-main mb-2 group-hover:text-blue-primary transition-colors">
                                                {section.title}
                                            </h3>
                                            <p className="text-text-muted leading-relaxed">
                                                {section.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* App Info */}
                    <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
                        <h3 className="text-xl font-bold text-text-main mb-4">App Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                            <div className="p-4 bg-green-soft rounded-lg">
                                <p className="text-green-dark font-semibold text-lg">Version</p>
                                <p className="text-text-main text-2xl font-bold">1.0.0</p>
                            </div>
                            <div className="p-4 bg-blue-soft rounded-lg">
                                <p className="text-blue-navy font-semibold text-lg">Last Updated</p>
                                <p className="text-text-main text-2xl font-bold">Dec 2025</p>
                            </div>
                            <div className="p-4 bg-purple-soft rounded-lg">
                                <p className="text-purple-primary font-semibold text-lg">Status</p>
                                <p className="text-text-main text-2xl font-bold">Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
