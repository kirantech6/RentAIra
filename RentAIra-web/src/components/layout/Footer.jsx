import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-white border-t border-gray-100 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    <div className="col-span-2 md:col-span-1">
                        <img src="/images/logo.png" alt="RentAIra" className="h-10 w-auto mb-8 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
                        <p className="text-gray-400 font-medium">Built to make renting human again.</p>
                    </div>
                    <div>
                        <h4 className="font-bold text-charcoal mb-6">Product</h4>
                        <ul className="space-y-4 text-gray-500 font-medium">
                            <li><a href="/listings" className="hover:text-primary transition-colors">Browse Rentals</a></li>
                            <li><a href="#how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
                            <li><a href="/pricing" className="hover:text-primary transition-colors">Pricing</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-charcoal mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-500 font-medium">
                            <li><a href="/about" className="hover:text-primary transition-colors">About</a></li>
                            <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
                            <li><a href="/careers" className="hover:text-primary transition-colors">Careers</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-charcoal mb-6">Legal</h4>
                        <ul className="space-y-4 text-gray-500 font-medium">
                            <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy</a></li>
                            <li><a href="/terms" className="hover:text-primary transition-colors">Terms</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 font-medium">© {new Date().getFullYear()} RentAIra. All rights reserved.</p>
                    <div className="flex space-x-6">
                        <div className="h-8 w-8 rounded-full bg-off-white" />
                        <div className="h-8 w-8 rounded-full bg-off-white" />
                        <div className="h-8 w-8 rounded-full bg-off-white" />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
