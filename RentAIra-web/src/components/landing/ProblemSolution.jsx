import React from 'react';
import { ShieldCheck, FileText, Lock, Users, Wrench, BadgeCheck, AlertTriangle, CreditCard, Clock } from 'lucide-react';

const ProblemSolution = () => {
    const solutions = [
        {
            icon: <CreditCard className="h-8 w-8 text-primary" />,
            problem: "High Upfront Costs",
            solution: "Zero-Deposit Connect",
            description: "Bypass typical 1st and last month rent hurdles and hefty security deposits with our flexible installment plans."
        },
        {
            icon: <AlertTriangle className="h-8 w-8 text-primary" />,
            problem: "Junk Fees & Portals",
            solution: "100% Transparent Pricing",
            description: "No hidden 'convenience' fees or mandatory app charges. What you see is exactly what you pay, directly via our platform."
        },
        {
            icon: <Users className="h-8 w-8 text-primary" />,
            problem: "Application Barriers",
            solution: "Alternative Credit Scoring",
            description: "We look beyond strict '3x rent' thresholds, evaluating reliability fairly for students, young professionals, and minorities."
        },
        {
            icon: <ShieldCheck className="h-8 w-8 text-primary" />,
            problem: "Tenant Discrimination",
            solution: "Blind Profile Matchmaking",
            description: "An unbiased system that guarantees equal housing opportunities, preventing rejections based on demographics or backgrounds."
        },
        {
            icon: <Lock className="h-8 w-8 text-primary" />,
            problem: "Unpredictable Renewals",
            solution: "Rent Lock Guarantee",
            description: "Smart digital contracts that cap arbitrary yearly hikes and eliminate unexpected lease changes at renewal time."
        },
        {
            icon: <Clock className="h-8 w-8 text-primary" />,
            problem: "Maintenance Delays",
            solution: "Escrow-Backed SLAs",
            description: "Rent is securely held in escrow until landlords resolve property repairs (like HVAC or pests) within guaranteed timeframes."
        },
        {
            icon: <FileText className="h-8 w-8 text-primary" />,
            problem: "Ambiguous Agreements",
            solution: "Smart Digital Leases",
            description: "Fully registered, standardized digital contracts that keep terms crystal clear and mutually protective."
        },
        {
            icon: <BadgeCheck className="h-8 w-8 text-primary" />,
            problem: "Broker & Scam Risks",
            solution: "Verified Direct Owners",
            description: "Zero broker fees. Every landlord and listing is aggressively KYC-verified to eliminate scams and fake ads entirely."
        },
        {
            icon: <Wrench className="h-8 w-8 text-primary" />,
            problem: "Eviction & Privacy Risks",
            solution: "Legal Guard & Scheduling",
            description: "Gain built-in tenant rights guidance, block unannounced visits via in-app scheduling, and stop arbitrary evictions."
        }
    ];

    return (
        <section className="py-24 bg-white border-t border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-charcoal mb-4">Fixing the Global Renting Mess</h2>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Whether in localized urban centers or major U.S. cities, renting shouldn't drain your savings or compromise your rights. RentAIra dismantles these barriers for good.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {solutions.map((item, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <div className="bg-primary/10 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                                {item.icon}
                            </div>
                            <div className="mb-4">
                                <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">The Problem</span>
                                <h3 className="text-xl font-bold text-charcoal mt-1 line-through opacity-70">{item.problem}</h3>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-primary uppercase tracking-wider">The Solution</span>
                                <h4 className="text-xl font-bold text-charcoal mt-1 mb-3">{item.solution}</h4>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProblemSolution;
