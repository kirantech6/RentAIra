import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/common/PropertyCard';
import { Property, User, Application } from '../../types';
import { calculateMatchScore, explainMatchScore, computeTenantProfileCompletion } from '../../utils/businessLogic';
import { Link } from 'react-router-dom';

const TenantProperties: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [properties, setProperties] = useState<(Property & { score: number; reasons: string[] })[]>([]);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [profileComplete, setProfileComplete] = useState(100);
  const [canApply, setCanApply] = useState(true);
  const [loading, setLoading] = useState(true);

  // Filters
  const [cityFilter, setCityFilter] = useState('');
  const [bhkFilter, setBhkFilter] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    
    const fetchData = async () => {
      // Fetch real profile from Firestore
      let profile: User = { 
        role: 'tenant', name: '', email: '', phone: '',
        preferredCities: [],
        budgetMin: 0, budgetMax: 0, 
        kycStatus: 'not_submitted', isVerified: false 
      };

      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          profile = { id: userDoc.id, ...userDoc.data() } as User;
        }
      } catch (_) {}

      setUserProfile(profile);
      const pct = computeTenantProfileCompletion(profile);
      setProfileComplete(pct);

      // Block apply if minimum profile fields (city + budget) are missing
      const hasMinProfile = (
        (profile.preferredCities?.length ?? 0) > 0 &&
        (profile.budgetMin ?? 0) > 0 &&
        (profile.budgetMax ?? 0) > 0
      );
      setCanApply(hasMinProfile);

      const propSnap = await getDocs(query(collection(db, 'properties'), where('isActive', '==', true)));
      const allProps = propSnap.docs.map(d => ({ id: d.id, ...d.data() } as Property));
      
      const scoredProps = allProps.map(p => ({
        ...p,
        score: calculateMatchScore(profile, p),
        reasons: explainMatchScore(profile, p),
      })).sort((a, b) => b.score - a.score);

      setProperties(scoredProps);
      setLoading(false);
    };

    fetchData();
  }, [currentUser]);

  const handleApply = async (propertyId: string, isPriority: boolean = false) => {
    try {
      if (!currentUser) return;

      if (!canApply) {
        alert('Please complete your profile (add preferred cities and budget) before applying.');
        return;
      }
      
      const newApp: Partial<Application> = {
        propertyId,
        tenantId: currentUser.uid,
        status: 'pending',
        message: 'I am highly interested in this property based on my match score.',
        isPriority,
        applicationFee: isPriority ? 500 : 0,
        createdAt: new Date()
      };
      
      await addDoc(collection(db, 'applications'), newApp);
      alert(`Application submitted ${isPriority ? '(Priority — ₹500 fee logged)' : ''}! The landlord will review it shortly.`);
    } catch (error) {
      console.error('Error applying to property:', error);
      alert('Failed to apply. You might have already applied or missing permissions.');
    }
  };

  const filteredProperties = properties.filter(p => {
    if (cityFilter && p.city.toLowerCase() !== cityFilter.toLowerCase()) return false;
    if (bhkFilter && p.bhk.toString() !== bhkFilter) return false;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Discover Properties</h1>
        <Link to="/tenant/dashboard" className="text-[#FF4D5A] font-semibold hover:underline text-sm">← Dashboard</Link>
      </div>

      {/* Profile completeness gate */}
      {profileComplete < 80 && (
        <div className={`mb-6 rounded-xl p-4 border flex items-center justify-between gap-4 ${
          !canApply ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'
        }`}>
          <div>
            <p className={`font-semibold text-sm ${!canApply ? 'text-red-700' : 'text-amber-800'}`}>
              {!canApply
                ? '⚠️ Add preferred cities and budget to unlock property applications'
                : `Your profile is ${profileComplete}% complete — match scores may not be accurate yet`}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">Complete your profile to improve match quality and see tailored results</p>
          </div>
          <Link
            to="/tenant/profile"
            className="shrink-0 bg-[#FF4D5A] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#e03e4a] transition-colors"
          >
            Complete Profile →
          </Link>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-wrap gap-3">
        <input 
          type="text" 
          placeholder="Filter by City (e.g. Bangalore)" 
          className="border p-2 rounded-lg flex-1 min-w-[160px] text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D5A]"
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
        />
        <select 
          className="border p-2 rounded-lg w-40 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D5A]"
          value={bhkFilter}
          onChange={e => setBhkFilter(e.target.value)}
        >
          <option value="">Any BHK</option>
          <option value="1">1 BHK</option>
          <option value="2">2 BHK</option>
          <option value="3">3 BHK</option>
          <option value="4">4+ BHK</option>
        </select>
        {userProfile?.preferredCities?.map(city => (
          <button
            key={city}
            onClick={() => setCityFilter(cityFilter === city ? '' : city)}
            className={`px-3 py-1.5 text-xs rounded-full font-semibold border transition-colors ${
              cityFilter === city ? 'bg-[#FF4D5A] text-white border-[#FF4D5A]' : 'border-gray-300 text-gray-600 hover:border-[#FF4D5A]'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading properties…</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map(prop => (
            <PropertyCard 
              key={prop.id} 
              property={prop} 
              matchScore={prop.score}
              matchReasons={prop.reasons}
              role="tenant" 
              onApply={handleApply}
            />
          ))}
          {filteredProperties.length === 0 && (
            <p className="text-gray-500 col-span-full text-center py-12">No properties found matching your criteria.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TenantProperties;
