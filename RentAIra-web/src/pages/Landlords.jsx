import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Button from '../components/ui/Button';
import { Check, Shield, Zap, DollarSign } from 'lucide-react';

const Landlords = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="bg-charcoal text-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Stress-Free Property Management with <span className="text-primary">AI</span>
                    </h1>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-10">
                        Automate tenant screening, rent collection, and maintenance requests. Maximize your ROI while minimizing the hassle.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup">
                            <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg">
                                Start for Free
                            </Button>
                        </Link>
                        <Link to="/contact">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-4 text-lg border-gray-600 text-white hover:bg-white/10">
                                Contact Sales
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-charcoal">Why Landlords Choose RentAIra</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-charcoal mb-3">Guaranteed Rent</h3>
                            <p className="text-gray-500">
                                Never worry about late payments again. Our AI predicts cash flow and insures your income.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <Zap className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-charcoal mb-3">Smart Screening</h3>
                            <p className="text-gray-500">
                                Find the perfect tenant in seconds with our advanced AI background checks and credit analysis.
                            </p>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                                <DollarSign className="h-6 w-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold text-charcoal mb-3">Automated Maintenance</h3>
                            <p className="text-gray-500">
                                AI handles 24/7 maintenance requests, dispatching trusted pros only when necessary.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landlords;
