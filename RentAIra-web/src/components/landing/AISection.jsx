import React from 'react';
import { Bot, Zap, ShieldCheck, Heart } from 'lucide-react';

const AISection = () => {
    return (
        <section className="py-24 bg-white overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 tracking-wide uppercase">
                            <Bot className="h-4 w-4 mr-2" />
                            Smarter Renting
                        </div>
                        <h2 className="text-[36px] md:text-[40px] font-bold text-charcoal mb-8 leading-[1.1]">
                            AI that works quietly <br />in the background
                        </h2>
                        <p className="text-base text-gray-500 font-medium leading-[1.75] mb-10 max-w-[65ch]">
                            Our AI helps match renters with the right homes, flags suspicious listings, and streamlines communication — so you spend less time searching and more time living.
                        </p>
                        <div className="space-y-6">
                            {[
                                { title: "Smarter matches", icon: Heart },
                                { title: "Faster approvals", icon: Zap },
                                { title: "Safer renting", icon: ShieldCheck }
                            ].map((item, id) => (
                                <div key={id} className="flex items-center space-x-4">
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                        <CheckIcon />
                                    </div>
                                    <span className="text-[24px] font-bold text-charcoal">{item.title}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-12 text-sm italic text-gray-400 font-medium">
                            💡 AI is a helper, not the hero.
                        </p>
                    </div>

                    <div className="relative">
                        <div className="bg-off-white rounded-[3rem] p-12 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-blue-100 rounded-full blur-3xl" />

                            <div className="relative z-10 space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 translate-x-4 group-hover:translate-x-0 transition-transform duration-700">
                                    <div className="flex items-center space-x-4 mb-2">
                                        <div className="h-10 w-10 rounded-full bg-primary/20" />
                                        <div className="h-4 w-32 bg-gray-100 rounded" />
                                    </div>
                                    <div className="h-3 w-full bg-gray-50 rounded" />
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-md border border-gray-100 -translate-x-4 group-hover:translate-x-0 transition-transform duration-700">
                                    <div className="flex items-center space-x-4 mb-2">
                                        <div className="h-10 w-10 rounded-full bg-blue-100" />
                                        <div className="h-4 w-40 bg-gray-100 rounded" />
                                    </div>
                                    <div className="h-3 w-4/5 bg-gray-50 rounded" />
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 translate-x-8 group-hover:translate-x-0 transition-transform duration-700">
                                    <div className="flex items-center space-x-4 mb-2">
                                        <div className="h-10 w-10 rounded-full bg-green-100" />
                                        <div className="h-4 w-24 bg-gray-100 rounded" />
                                    </div>
                                    <div className="h-3 w-3/4 bg-gray-50 rounded" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

const CheckIcon = () => (
    <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

export default AISection;
