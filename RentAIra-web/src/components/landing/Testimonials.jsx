import React from 'react';

const Testimonials = () => {
    const reviews = [
        {
            quote: "I found my apartment in two days. No scams, no stress.",
            author: "Sarah M.",
            role: "Renter"
        },
        {
            quote: "Tenant screening and leases are now effortless.",
            author: "James L.",
            role: "Landlord"
        }
    ];

    return (
        <section className="py-24 bg-off-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-[36px] md:text-[40px] font-bold text-charcoal">People love renting with RentAIra</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {reviews.map((rev, idx) => (
                        <div key={idx} className="bg-white p-12 rounded-[2.5rem] shadow-sm flex flex-col justify-between hover:scale-[1.02] transition-transform duration-300">
                            <p className="text-3xl font-medium text-charcoal italic mb-8 leading-relaxed">
                                "{rev.quote}"
                            </p>
                            <div>
                                <div className="h-px bg-gray-100 w-12 mb-6" />
                                <div className="font-bold text-xl text-charcoal">{rev.author}</div>
                                <div className="text-gray-400 font-medium">{rev.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
