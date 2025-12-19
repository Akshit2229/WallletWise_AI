import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            setIsMobileMenuOpen(false);
        }
    };

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? 'bg-white/95 backdrop-blur-md shadow-md'
                : 'bg-white/80 backdrop-blur-sm'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-blue-navy">WalletWise</span>
                        <span className="text-2xl font-bold text-purple-primary">AI</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <button
                            onClick={() => scrollToSection('features')}
                            className="text-text-main hover:text-blue-primary transition-colors font-medium"
                        >
                            Features
                        </button>
                        <button
                            onClick={() => scrollToSection('how-it-works')}
                            className="text-text-main hover:text-blue-primary transition-colors font-medium"
                        >
                            How it Works
                        </button>
                        <button
                            onClick={() => scrollToSection('stats')}
                            className="text-text-main hover:text-blue-primary transition-colors font-medium"
                        >
                            Benefits
                        </button>
                    </div>

                    {/* CTA Buttons */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="px-6 py-2 bg-gradient-to-r from-green-primary to-blue-primary text-white rounded-lg font-semibold hover:shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                            View Dashboard
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-border-subtle">
                        <div className="flex flex-col space-y-4">
                            <button
                                onClick={() => scrollToSection('features')}
                                className="text-left text-text-main hover:text-blue-primary transition-colors font-medium"
                            >
                                Features
                            </button>
                            <button
                                onClick={() => scrollToSection('how-it-works')}
                                className="text-left text-text-main hover:text-blue-primary transition-colors font-medium"
                            >
                                How it Works
                            </button>
                            <button
                                onClick={() => scrollToSection('stats')}
                                className="text-left text-text-main hover:text-blue-primary transition-colors font-medium"
                            >
                                Benefits
                            </button>
                            <button
                                onClick={() => {
                                    navigate('/dashboard');
                                    setIsMobileMenuOpen(false);
                                }}
                                className="px-6 py-2 bg-gradient-to-r from-green-primary to-blue-primary text-white rounded-lg font-semibold text-center"
                            >
                                View Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
