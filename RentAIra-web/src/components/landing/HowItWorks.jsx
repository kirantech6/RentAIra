import React from 'react';
import { Search, PenTool, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: Search,
            title: "1. Browse Verified Homes",
            desc: "Only real listings from trusted landlords and managers."
        },
        {
            icon: PenTool,
            title: "2. Apply & Sign Digitally",
            desc: "No paperwork. No confusion. Everything online."
        },
        {
            icon: CheckCircle,
            title: "3. Move In With Confidence",
            desc: "Payments, leases, and maintenance — handled in one place."
        }
    ];

    return (
        <section id="how-it-works" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-[36px] md:text-[40px] font-bold text-charcoal mb-4">Renting, made simple</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
                    {steps.map((step, idx) => (
                        <div key={idx} className="flex flex-col items-center text-center">
                            <div className="h-20 w-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 rotate-3 hover:rotate-0 transition-transform duration-300">
                                <step.icon className="h-10 w-10 text-primary" strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[24px] md:text-[28px] font-bold text-charcoal mb-4">{step.title}</h3>
                            <p className="text-base text-gray-500 font-medium leading-[1.75] max-w-[65ch]">
                                {step.desc}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <a href="/listings" className="text-base font-medium text-primary hover:underline flex items-center justify-center">
                        See available rentals <span className="ml-2 text-xl">→</span>
                    </a>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
