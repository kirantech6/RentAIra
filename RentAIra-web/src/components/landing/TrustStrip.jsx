import React from 'react';
import { Star, ShieldCheck, Wrench } from 'lucide-react';

const TrustStrip = () => {
    return (
        <section className="bg-off-white py-8 border-y border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4">
                    <div className="flex items-center justify-center space-x-3">
                        <Star className="h-6 w-6 text-primary" fill="currentColor" />
                        <span className="text-lg font-medium text-charcoal">Trusted by 10,000+ renters & landlords</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                        <span className="text-lg font-medium text-charcoal">Verified homes & secure digital leases</span>
                    </div>
                    <div className="flex items-center justify-center space-x-3">
                        <Wrench className="h-6 w-6 text-primary" />
                        <span className="text-lg font-medium text-charcoal">Fast maintenance support</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustStrip;
