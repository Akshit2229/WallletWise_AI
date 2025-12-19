import { Zap, Brain, Target, Sparkles } from 'lucide-react';

const features = [
    {
        icon: Zap,
        title: 'Automatic tracking',
        description: 'Upload statements or add expenses in seconds.',
        color: 'from-green-primary to-green-dark',
        bgColor: 'bg-green-soft',
    },
    {
        icon: Brain,
        title: 'Smart insights',
        description: 'See where your money really goes.',
        color: 'from-blue-primary to-blue-navy',
        bgColor: 'bg-blue-soft',
    },
    {
        icon: Target,
        title: 'Goal-driven',
        description: 'Tell us your savings target—get a plan.',
        color: 'from-purple-primary to-purple-600',
        bgColor: 'bg-purple-soft',
    },
    {
        icon: Sparkles,
        title: 'Agentic actions',
        description: 'Your AI adjusts budgets and nudges you when you drift.',
        color: 'from-neon-mint to-green-primary',
        bgColor: 'bg-green-soft',
    },
];

const FeatureSection = () => {
    return (
        <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-4">
                        Everything you need to build wealth
                    </h2>
                    <p className="text-xl text-text-muted max-w-2xl mx-auto">
                        Powered by AI, designed for simplicity
                    </p>
                </div>

                {/* Features Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={index}
                                className="group relative p-6 rounded-2xl border border-border-subtle bg-white hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                            >
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <Icon size={28} className="text-white" />
                                </div>

                                {/* Title */}
                                <h3 className="text-xl font-bold text-text-main mb-2">
                                    {feature.title}
                                </h3>

                                {/* Description */}
                                <p className="text-text-muted leading-relaxed">
                                    {feature.description}
                                </p>

                                {/* Hover Effect Background */}
                                <div className={`absolute inset-0 ${feature.bgColor} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity -z-10`}></div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeatureSection;
