import { Link } from 'react-router-dom';
import { TrendingUp, PieChart } from 'lucide-react';

const Hero = () => {
    return (
        <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-soft via-green-soft to-purple-soft opacity-60"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(109,40,217,0.1),transparent_50%)]"></div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="animate-fadeInUp">
                        {/* Agentic Badge */}
                        <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full border border-neon-mint/30 mb-6">
                            <div className="w-2 h-2 bg-neon-mint rounded-full animate-pulse-glow"></div>
                            <span className="text-sm font-semibold text-purple-primary">
                                Agentic Finance Assistant
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-text-main mb-6 leading-tight">
                            Take control of your money with{' '}
                            <span className="bg-gradient-to-r from-green-primary via-blue-primary to-purple-primary bg-clip-text text-transparent">
                                AI
                            </span>
                        </h1>

                        {/* Subtext */}
                        <p className="text-xl text-text-muted mb-8 leading-relaxed">
                            WalletWise AI tracks your expenses, spots overspending, and helps you hit your
                            savings goals—automatically.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <Link
                                to="/dashboard"
                                className="px-8 py-4 bg-gradient-to-r from-green-primary to-blue-primary text-white rounded-lg font-semibold text-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-center"
                            >
                                View Dashboard
                            </Link>
                            <button
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                                className="px-8 py-4 border-2 border-blue-navy text-blue-navy rounded-lg font-semibold text-lg hover:bg-blue-navy hover:text-white transition-all text-center"
                            >
                                Learn More
                            </button>
                        </div>

                        {/* Reassurance Text */}
                        <p className="text-sm text-text-muted">
                            No complex setup. Just connect your data and let the agent work.
                        </p>
                    </div>

                    {/* Right: Mock Dashboard Preview */}
                    <div className="relative animate-fadeInUp animation-delay-200">
                        <div className="relative z-10 space-y-4">
                            {/* Main Card */}
                            <div className="bg-white rounded-2xl shadow-2xl p-6 border border-border-subtle">
                                <h3 className="text-lg font-semibold text-text-main mb-4">
                                    Monthly Spending Summary
                                </h3>
                                <div className="flex items-baseline space-x-2 mb-3">
                                    <span className="text-4xl font-bold text-text-main">₹38,200</span>
                                    <span className="text-text-muted">spent</span>
                                </div>
                                <div className="inline-flex items-center space-x-2 bg-green-soft px-3 py-1 rounded-full">
                                    <TrendingUp size={16} className="text-green-primary" />
                                    <span className="text-sm font-semibold text-green-dark">
                                        Within budget
                                    </span>
                                </div>

                                {/* Simple Chart Placeholder */}
                                <div className="mt-6 flex items-center justify-center">
                                    <div className="relative">
                                        <PieChart size={120} className="text-blue-primary opacity-20" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-center">
                                                <div className="text-2xl font-bold text-text-main">65%</div>
                                                <div className="text-xs text-text-muted">Tracked</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* AI Insights Card */}
                            <div className="bg-gradient-to-br from-purple-primary to-blue-navy rounded-2xl shadow-xl p-6 text-white">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold">AI Insights</h3>
                                    <span className="px-3 py-1 bg-neon-mint/20 border border-neon-mint rounded-full text-neon-mint text-xs font-semibold animate-pulse-glow">
                                        AI
                                    </span>
                                </div>
                                <ul className="space-y-3 text-sm">
                                    <li className="flex items-start space-x-2">
                                        <span className="text-neon-mint mt-1">•</span>
                                        <span>You spent 32% on Food this month (+8% vs last month).</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-neon-mint mt-1">•</span>
                                        <span>Cut ₹1,500 from eating out to hit your goal.</span>
                                    </li>
                                    <li className="flex items-start space-x-2">
                                        <span className="text-neon-mint mt-1">•</span>
                                        <span>Your subscriptions total ₹1,800/month.</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-primary/20 rounded-full blur-2xl"></div>
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-primary/20 rounded-full blur-2xl"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
