import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const Hero = () => {
    return (
        <section className="relative h-[90vh] flex items-center overflow-hidden">
            {/* Background Image with subtle zoom effect */}
            <div className="absolute inset-0 z-0">
                <img
                    src="/images/hero_warm.png"
                    alt="Warm modern apartment"
                    className="w-full h-full object-cover animate-slow-zoom"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-20">
                <div className="max-w-3xl">
                    <h1 className="text-[56px] md:text-[64px] font-bold tracking-tight text-white mb-6 leading-[1.1]">
                        Find a home without the stress
                    </h1>
                    <p className="text-xl md:text-[22px] text-white/90 mb-10 leading-[1.75] font-medium max-w-[65ch]">
                        Verified listings, digital leases, and easy maintenance — <br className="hidden md:block" />
                        everything you need to rent, all in one place.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                        <Link to="/signup" className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary-hover text-white rounded-full px-12 py-4 text-base font-medium shadow-xl transition-all hover:scale-105">
                                Find a home
                            </Button>
                        </Link>
                        <Link to="/landlords" className="w-full sm:w-auto">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-2 border-white/80 hover:bg-white/10 rounded-full px-12 py-4 text-base font-medium backdrop-blur-sm transition-all hover:scale-105">
                                List a property
                            </Button>
                        </Link>
                    </div>
                    <p className="mt-6 text-white/70 text-[14px] font-medium tracking-wide">
                        No fake listings • No spam • Free to browse
                    </p>
                </div>
            </div>
        </section>
    );
};

export default Hero;
