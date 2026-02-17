import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import Button from '../ui/Button';

const BenefitsSection = () => {
    const renterBenefits = [
        "No fake listings",
        "Transparent pricing",
        "Digital lease signing",
        "Easy maintenance requests"
    ];

    const landlordBenefits = [
        "Verified tenants",
        "Faster applications",
        "Automated leases",
        "Centralized management"
    ];

    return (
        <section className="py-24 bg-off-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Renters */}
                    <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-500">
                        <h3 className="text-[24px] md:text-[28px] font-bold text-charcoal mb-8">For renters</h3>
                        <ul className="space-y-6 mb-12">
                            {renterBenefits.map((benefit, i) => (
                                <li key={i} className="flex items-center text-lg font-medium text-gray-600">
                                    <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-4">
                                        <Check className="h-4 w-4 text-green-600" strokeWidth={3} />
                                    </div>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        <Link to="/signup?role=renter">
                            <Button size="lg" className="bg-charcoal text-white rounded-xl px-10 py-5 text-base font-medium shadow-lg hover:bg-black transition-all">
                                Find your next home →
                            </Button>
                        </Link>
                    </div>

                    {/* Landlords */}
                    <div className="bg-white p-12 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-shadow duration-500">
                        <h3 className="text-[24px] md:text-[28px] font-bold text-charcoal mb-8">For landlords</h3>
                        <ul className="space-y-6 mb-12">
                            {landlordBenefits.map((benefit, i) => (
                                <li key={i} className="flex items-center text-lg font-medium text-gray-600">
                                    <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                        <Check className="h-4 w-4 text-blue-600" strokeWidth={3} />
                                    </div>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                        <Link to="/signup?role=landlord">
                            <Button size="lg" className="bg-primary text-white rounded-xl px-10 py-5 text-base font-medium shadow-lg hover:bg-primary-hover transition-all">
                                List your property →
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
