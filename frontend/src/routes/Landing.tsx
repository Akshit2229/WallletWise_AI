import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import FeatureSection from '../components/FeatureSection';
import StatsCards from '../components/StatsCards';
import Footer from '../components/Footer';
import { CheckCircle2, Upload, Brain, Shield, Zap, TrendingUp, Eye, Lock, Cpu } from 'lucide-react';

const Landing = () => {
    return (
        <div className="min-h-screen bg-bg-light">
            <Navbar />
            <Hero />

            {/* About WalletWise Section */}
            <section id="about" className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Left: Text Content */}
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-6">
                                About WalletWise
                            </h2>
                            <p className="text-lg text-text-muted mb-6 leading-relaxed">
                                WalletWise is an AI-powered financial management platform designed to help you take control of your money effortlessly. We combine cutting-edge artificial intelligence with intuitive design to transform how you track, analyze, and optimize your finances.
                            </p>
                            <p className="text-lg text-text-muted mb-6 leading-relaxed">
                                Our mission is simple: <span className="font-semibold text-text-main">make financial wellness accessible to everyone</span>. Whether you're saving for a dream vacation, paying off debt, or building your emergency fund, WalletWise provides the insights and guidance you need to achieve your goals.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-green-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                    <p className="text-text-muted">
                                        <span className="font-semibold text-text-main">Intelligent Automation:</span> Let AI handle the tedious work of categorizing and analyzing transactions
                                    </p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-blue-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                    <p className="text-text-muted">
                                        <span className="font-semibold text-text-main">Actionable Insights:</span> Receive personalized recommendations based on your unique spending patterns
                                    </p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-6 h-6 bg-purple-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                        <CheckCircle2 size={16} className="text-white" />
                                    </div>
                                    <p className="text-text-muted">
                                        <span className="font-semibold text-text-main">Goal-Oriented:</span> Set savings targets and watch as we help you achieve them faster
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Visual Element */}
                        <div className="relative">
                            <div className="bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 rounded-3xl p-8 shadow-2xl">
                                <div className="bg-white rounded-2xl p-6 shadow-lg mb-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold text-text-main">Financial Overview</h4>
                                        <span className="px-3 py-1 bg-green-soft text-green-dark text-sm font-semibold rounded-full">Healthy</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-text-muted text-sm">Monthly Savings</span>
                                            <span className="font-bold text-green-primary">₹15,000</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-gradient-to-r from-green-primary to-blue-primary h-2 rounded-full" style={{ width: '75%' }}></div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-text-muted text-sm">Budget Utilization</span>
                                            <span className="font-bold text-text-main">75%</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-primary to-blue-navy rounded-2xl p-6 text-white shadow-lg">
                                    <p className="text-sm font-semibold mb-2 flex items-center">
                                        <Brain size={16} className="mr-2" />
                                        AI Recommendation
                                    </p>
                                    <p className="text-sm opacity-90">
                                        You can save an extra ₹3,000 this month by reducing dining out expenses by 20%.
                                    </p>
                                </div>
                            </div>
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-primary/20 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-primary/20 rounded-full blur-2xl"></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Choose WalletWise Section */}
            <section className="py-20 bg-gradient-to-b from-bg-light to-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-4">
                            Why Choose WalletWise?
                        </h2>
                        <p className="text-xl text-text-muted max-w-3xl mx-auto">
                            Experience the future of personal finance management with features designed for modern life
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {/* Benefit 1 */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border-subtle hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-primary to-purple-600 rounded-xl flex items-center justify-center mb-4">
                                <Cpu size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-3">AI-Powered Intelligence</h3>
                            <p className="text-text-muted leading-relaxed">
                                Advanced machine learning algorithms analyze your spending patterns and provide intelligent recommendations tailored to your financial behavior.
                            </p>
                        </div>

                        {/* Benefit 2 */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border-subtle hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-primary to-blue-navy rounded-xl flex items-center justify-center mb-4">
                                <Zap size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-3">Fully Automated</h3>
                            <p className="text-text-muted leading-relaxed">
                                Upload your CSV statements and let WalletWise do the heavy lifting. Automatic categorization, trend analysis, and budget tracking—no manual work required.
                            </p>
                        </div>

                        {/* Benefit 3 */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border-subtle hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-primary to-green-dark rounded-xl flex items-center justify-center mb-4">
                                <TrendingUp size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-3">Real-Time Insights</h3>
                            <p className="text-text-muted leading-relaxed">
                                Get instant visibility into your financial health with dynamic dashboards, spending breakdowns, and goal progress tracking updated in real-time.
                            </p>
                        </div>

                        {/* Benefit 4 */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border-subtle hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-neon-mint to-green-primary rounded-xl flex items-center justify-center mb-4">
                                <Lock size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-3">Bank-Level Security</h3>
                            <p className="text-text-muted leading-relaxed">
                                Your financial data is protected with enterprise-grade encryption and security measures. We never share your information with third parties.
                            </p>
                        </div>

                        {/* Benefit 5 */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border-subtle hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-primary to-blue-primary rounded-xl flex items-center justify-center mb-4">
                                <Eye size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-3">Complete Transparency</h3>
                            <p className="text-text-muted leading-relaxed">
                                Understand every insight and recommendation with clear explanations. No black-box algorithms—just transparent, actionable advice.
                            </p>
                        </div>

                        {/* Benefit 6 */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-border-subtle hover:shadow-xl transition-all hover:-translate-y-1">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-primary to-blue-primary rounded-xl flex items-center justify-center mb-4">
                                <Shield size={24} className="text-white" />
                            </div>
                            <h3 className="text-xl font-bold text-text-main mb-3">No Hidden Fees</h3>
                            <p className="text-text-muted leading-relaxed">
                                Simple, straightforward pricing with no surprises. Access powerful financial tools without worrying about unexpected charges or premium tiers.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <FeatureSection />

            {/* How It Works Section */}
            <section id="how-it-works" className="py-20 bg-gradient-to-b from-white to-bg-light">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-text-main mb-4">
                            How it works
                        </h2>
                        <p className="text-xl text-text-muted">
                            Three simple steps to financial clarity
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-green-primary to-green-dark rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Upload size={36} className="text-white" />
                            </div>
                            <div className="text-6xl font-bold text-green-primary/20 mb-4">01</div>
                            <h3 className="text-2xl font-bold text-text-main mb-3">Connect your data</h3>
                            <p className="text-text-muted leading-relaxed">
                                Upload bank statements or manually add expenses. We make it quick and secure.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-primary to-blue-navy rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <Brain size={36} className="text-white" />
                            </div>
                            <div className="text-6xl font-bold text-blue-primary/20 mb-4">02</div>
                            <h3 className="text-2xl font-bold text-text-main mb-3">AI analyzes everything</h3>
                            <p className="text-text-muted leading-relaxed">
                                Our agent categorizes spending, finds patterns, and identifies opportunities to save.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-purple-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                <CheckCircle2 size={36} className="text-white" />
                            </div>
                            <div className="text-6xl font-bold text-purple-primary/20 mb-4">03</div>
                            <h3 className="text-2xl font-bold text-text-main mb-3">Take action</h3>
                            <p className="text-text-muted leading-relaxed">
                                Get personalized insights and recommendations. Watch your savings grow automatically.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <StatsCards />
            <Footer />
        </div>
    );
};

export default Landing;
