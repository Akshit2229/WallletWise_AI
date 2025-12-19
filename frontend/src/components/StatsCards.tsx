import { TrendingUp, Clock, BarChart3 } from 'lucide-react';

const stats = [
    {
        icon: TrendingUp,
        value: '20%',
        label: 'more saved',
        description: 'Up to 20% more saved',
    },
    {
        icon: Clock,
        value: '2 min',
        label: 'per day',
        description: 'Track in under 2 minutes a day',
    },
    {
        icon: BarChart3,
        value: 'All-in-one',
        label: 'platform',
        description: 'All your spending in one place',
    },
];

const StatsCards = () => {
    return (
        <section id="stats" className="py-20 bg-bg-main relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e9_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e9_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        Why choose WalletWise AI?
                    </h2>
                    <p className="text-xl text-gray-300">
                        Real results from AI-powered finance management
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div
                                key={index}
                                className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-neon-mint/50 transition-all duration-300"
                            >
                                {/* Icon */}
                                <div className="flex justify-center mb-6">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-mint to-green-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Icon size={32} className="text-white" />
                                    </div>
                                </div>

                                {/* Value */}
                                <div className="text-center">
                                    <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-lg text-neon-mint font-semibold mb-3 border-b-2 border-neon-mint/30 inline-block pb-1">
                                        {stat.label}
                                    </div>
                                    <p className="text-gray-300">
                                        {stat.description}
                                    </p>
                                </div>

                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-neon-mint/0 via-neon-mint/5 to-neon-mint/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default StatsCards;
