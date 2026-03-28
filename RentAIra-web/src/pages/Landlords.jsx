import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { 
  CreditCard, ShieldCheck, FileSignature, 
  Wrench, PieChart, Megaphone, Users, 
  ArrowRight, CheckCircle2 
} from 'lucide-react';

const Landlords = () => {
    const features = [
        {
            title: 'Rent Collection',
            description: 'Tenants can pay online (cards, bank transfer, UPI, etc.) fully automated.',
            icon: <CreditCard className="w-6 h-6 text-emerald-500" />,
            bgColor: 'bg-emerald-500/10',
            borderColor: 'border-emerald-500/20'
        },
        {
            title: 'Tenant Screening',
            description: 'Comprehensive background, credit, and eviction checks in one click.',
            icon: <ShieldCheck className="w-6 h-6 text-blue-500" />,
            bgColor: 'bg-blue-500/10',
            borderColor: 'border-blue-500/20'
        },
        {
            title: 'Lease Management',
            description: 'Create, template, and e-sign rental agreements legally and seamlessly.',
            icon: <FileSignature className="w-6 h-6 text-purple-500" />,
            bgColor: 'bg-purple-500/10',
            borderColor: 'border-purple-500/20'
        },
        {
            title: 'Maintenance Tracking',
            description: 'Manage repair requests, dispatch vendors, and track progress effortlessly.',
            icon: <Wrench className="w-6 h-6 text-amber-500" />,
            bgColor: 'bg-amber-500/10',
            borderColor: 'border-amber-500/20'
        },
        {
            title: 'Accounting & Reports',
            description: 'Track income, expenses, cash flow, and generate tax-ready reports.',
            icon: <PieChart className="w-6 h-6 text-indigo-500" />,
            bgColor: 'bg-indigo-500/10',
            borderColor: 'border-indigo-500/20'
        },
        {
            title: 'Listings & Marketing',
            description: 'Post properties to sites like Zillow instantly to fill vacancies faster.',
            icon: <Megaphone className="w-6 h-6 text-rose-500" />,
            bgColor: 'bg-rose-500/10',
            borderColor: 'border-rose-500/20'
        },
        {
            title: 'Tenant & Owner Portals',
            description: 'Dedicated portals for communication, document sharing, and announcements.',
            icon: <Users className="w-6 h-6 text-cyan-500" />,
            bgColor: 'bg-cyan-500/10',
            borderColor: 'border-cyan-500/20'
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-charcoal text-white pt-24 pb-32">
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-50"></div>
                    <div className="absolute top-40 -left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl opacity-40"></div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-8">
                        <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-sm font-medium">The All-in-One Property OS</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight leading-tight">
                        Manage Every Property.<br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                            All In One Place.
                        </span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
                        Stop juggling multiple tools. From listings to leases, rent to repairs—RentAIra handles almost every part of managing rentals seamlessly.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link to="/signup">
                            <Button size="lg" className="w-full sm:w-auto px-8 py-4 text-lg bg-primary hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all">
                                Get Started Free <ArrowRight className="inline w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* 7 Core Pillars - Bento Style Layout */}
            <section className="py-24 bg-gray-50 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Everything you need to scale your portfolio
                        </h2>
                        <p className="text-lg text-gray-500">
                            Experience a truly unified ecosystem designed to automate your tedious workflows and give you back your time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className={`
                                    ${index === 3 || index === 4 ? 'lg:col-span-1 border border-gray-100' : 'border border-gray-100'} 
                                    bg-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1
                                `}
                            >
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${feature.bgColor} ${feature.borderColor}`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-500 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                        
                        {/* CTA Card in the Grid */}
                        <div className="lg:col-span-2 bg-gradient-to-br from-charcoal to-slate-800 rounded-3xl p-8 md:p-12 text-white flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <ShieldCheck className="w-48 h-48" />
                            </div>
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-4">Ready to hit autopilot?</h3>
                                <ul className="space-y-3 mb-8">
                                    {['No hidden fees', 'Setup in 5 minutes', '24/7 Priority Support'].map((item, i) => (
                                        <li key={i} className="flex items-center text-gray-300">
                                            <CheckCircle2 className="w-5 h-5 text-primary mr-3" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                                <Link to="/signup">
                                    <Button className="bg-white text-charcoal hover:bg-gray-100 rounded-full px-8 py-3 font-bold border-none">
                                        Create your free account
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landlords;
