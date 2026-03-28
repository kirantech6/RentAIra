import React from 'react';
import Hero from '../components/landing/Hero';
import TrustStrip from '../components/landing/TrustStrip';
import ProblemSolution from '../components/landing/ProblemSolution';
import HowItWorks from '../components/landing/HowItWorks';
import BenefitsSection from '../components/landing/BenefitsSection';
import AISection from '../components/landing/AISection';
import Testimonials from '../components/landing/Testimonials';
import FeaturedListings from '../components/landing/FeaturedListings';
import FinalCTA from '../components/landing/FinalCTA';

const Landing = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Hero />
            <TrustStrip />
            <ProblemSolution />
            <HowItWorks />
            <BenefitsSection />
            <AISection />
            <Testimonials />
            <FeaturedListings />
            <FinalCTA />
        </div>
    );
};

export default Landing;
