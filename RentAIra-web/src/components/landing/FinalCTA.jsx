import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const FinalCTA = () => {
    return (
        <section className="py-32 px-4">
            <div className="max-w-6xl mx-auto rounded-[3.5rem] bg-gradient-to-br from-primary to-[#ff6b85] p-12 md:p-24 text-center shadow-2xl relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mr-24 -mt-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 -ml-24 -mb-24 w-96 h-96 bg-black/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <h2 className="text-[48px] md:text-[64px] font-bold text-white mb-8 leading-[1.1]">
                        Your next home is waiting
                    </h2>
                    <p className="text-lg md:text-[22px] text-white/90 mb-12 max-w-3xl mx-auto leading-[1.75] font-medium">
                        Join thousands of renters and landlords using a smarter, safer way to rent.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link to="/signup" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-off-white rounded-full px-16 py-5 text-base font-medium shadow-xl transition-all hover:scale-105">
                                Find a home
                            </Button>
                        </Link>
                        <Link to="/landlords" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-2 border-white/50 hover:bg-white/10 rounded-full px-16 py-5 text-base font-medium transition-all hover:scale-105">
                                List a property
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default FinalCTA;
