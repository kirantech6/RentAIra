import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Rocket, Sparkles, CheckCircle2 } from 'lucide-react';
import Button from '../components/ui/Button';

const FeaturePage = () => {
  const { category, featureId } = useParams();

  // Convert URL slugs back to readable titles
  const formatTitle = (slug) => slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  const categoryTitle = formatTitle(category);
  const featureTitle = formatTitle(featureId);

  return (
    <div className="min-h-screen bg-gray-50 pt-8 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center text-sm font-medium text-gray-500 mb-8">
          <Link to="/" className="hover:text-primary transition-colors flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back Home
          </Link>
          <span className="mx-3 text-gray-300">|</span>
          <span className="text-gray-400">Features</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-gray-400">{categoryTitle}</span>
          <ChevronRight className="w-4 h-4 mx-1" />
          <span className="text-charcoal font-semibold">{featureTitle}</span>
        </nav>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Sparkles className="w-64 h-64" />
          </div>
          
          <div className="px-8 py-16 md:p-20 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-xs uppercase tracking-wider mb-6">
              <Rocket className="w-4 h-4" /> {categoryTitle} Module
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-charcoal tracking-tight mb-6">
              {featureTitle}
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mb-10 leading-relaxed">
              We are currently fine-tuning the <strong>{featureTitle}</strong> module for the {categoryTitle} suite. This feature will give you unprecedented control and automation for your property management workflows.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg shadow-primary/30">
                Request Early Access
              </Button>
              <Button variant="outline" className="rounded-full px-8 py-4 text-lg font-semibold border-gray-200 text-charcoal hover:bg-gray-50">
                View Documentation
              </Button>
            </div>
          </div>
        </div>

        {/* Dummy Dashboard Preview */}
        <div className="mt-12">
          <h3 className="text-xl font-bold text-charcoal mb-6">Sneak Peek: What to expect</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center opacity-60 hover:opacity-100 transition-opacity">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-8 h-8 text-gray-300" />
                </div>
                <div className="h-4 bg-gray-100 rounded w-3/4 mb-3"></div>
                <div className="h-3 bg-gray-50 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturePage;
