const Footer = () => {
    return (
        <footer className="bg-bg-main text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center">
                    {/* Logo */}
                    <div className="mb-6 md:mb-0">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-green-primary">WalletWise</span>
                            <span className="text-2xl font-bold text-purple-primary">AI</span>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex space-x-8 mb-6 md:mb-0">
                        <a href="#" className="text-gray-300 hover:text-green-primary transition-colors">
                            Privacy
                        </a>
                        <a href="#" className="text-gray-300 hover:text-green-primary transition-colors">
                            Terms
                        </a>
                        <a href="#" className="text-gray-300 hover:text-green-primary transition-colors">
                            Contact
                        </a>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>&copy; 2025 WalletWise AI. Built for smarter money decisions.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
