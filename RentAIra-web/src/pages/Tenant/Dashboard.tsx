import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import PropertyCard from '../../components/common/PropertyCard';
import ApplicationList from '../../components/common/ApplicationList';
import AgreementCard from '../../components/common/AgreementCard';
import TicketCard from '../../components/common/TicketCard';
import { Loader, EmptyState } from '../../components/common/UIStates';
import { Property, Application, Agreement, Ticket, User } from '../../types';
import { calculateMatchScore, computeTenantProfileCompletion, explainMatchScore } from '../../utils/businessLogic';
import { Link } from 'react-router-dom';

const TenantDashboard: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [recommended, setRecommended] = useState<(Property & { score: number; reasons: string[] })[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;
    const fetchData = async () => {
      // 1. Fetch Tenant Profile from Firestore
      let profile: User = {
        role: 'tenant', name: '', email: '', phone: '',
        preferredCities: ['Bangalore', 'Mumbai'],
        budgetMin: 10000, budgetMax: 30000,
        kycStatus: 'not_submitted', isVerified: false
      };
      try {
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) profile = { id: userDoc.id, ...userDoc.data() } as User;
      } catch (_) {}
      setUserProfile(profile);

      // 2. Active Properties with match scores
      const propSnap = await getDocs(query(collection(db, 'properties'), where('isActive', '==', true)));
      const allProps = propSnap.docs.map(d => ({ id: d.id, ...d.data() } as Property));
      const scoredProps = allProps
        .map(p => ({ ...p, score: calculateMatchScore(profile, p), reasons: explainMatchScore(profile, p) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      setRecommended(scoredProps);

      // 3. Applications
      const appSnap = await getDocs(query(collection(db, 'applications'), where('tenantId', '==', currentUser.uid)));
      setApplications(appSnap.docs.map(d => ({ id: d.id, ...d.data() } as Application)));

      // 4. Agreements
      const agreeSnap = await getDocs(query(collection(db, 'agreements'), where('tenantId', '==', currentUser.uid)));
      setAgreements(agreeSnap.docs.map(d => ({ id: d.id, ...d.data() } as Agreement)));

      // 5. Tickets
      const ticketSnap = await getDocs(query(collection(db, 'tickets'), where('tenantId', '==', currentUser.uid)));
      setTickets(ticketSnap.docs.map(d => ({ id: d.id, ...d.data() } as Ticket)));

      setLoading(false);
    };
    fetchData();
  }, [currentUser]);

  if (loading) return <Loader />;

  const completion = computeTenantProfileCompletion(userProfile ?? {});

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Tenant Dashboard</h1>
        <Link to="/tenant/properties" className="text-[#FF4D5A] font-semibold hover:underline">Browse All Properties →</Link>
      </div>

      {/* ── Profile Summary Card ── */}
      <div className={`rounded-2xl border p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 ${
        completion < 80 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-10 w-10 rounded-full bg-[#FF4D5A] text-white flex items-center justify-center text-lg font-bold shrink-0">
              {(userProfile?.name || 'T').charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-bold text-gray-900">{userProfile?.name || 'Set up your profile'}</p>
              <p className="text-xs text-gray-500">
                {userProfile?.currentCity ? `📍 ${userProfile.currentCity}` : 'City not set'} ·{' '}
                Budget ₹{(userProfile?.budgetMin ?? 0).toLocaleString()}–₹{(userProfile?.budgetMax ?? 0).toLocaleString()} ·{' '}
                {userProfile?.desiredBhkMin ?? '?'}–{userProfile?.desiredBhkMax ?? '?'} BHK
              </p>
              <p className="text-[10px] text-gray-400 mt-0.5 italic">Match quality improves as your profile completes</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-full h-2 border border-gray-200">
              <div
                className={`h-2 rounded-full transition-all ${completion >= 80 ? 'bg-green-500' : completion >= 50 ? 'bg-yellow-400' : 'bg-[#FF4D5A]'}`}
                style={{ width: `${completion}%` }}
              />
            </div>
            <span className="text-xs font-bold text-gray-600 w-10 text-right">{completion}% complete</span>
          </div>
        </div>
        {completion < 80 ? (
          <Link to="/tenant/profile" className="shrink-0 bg-[#FF4D5A] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#e03e4a] transition-colors whitespace-nowrap">
            Complete Profile →
          </Link>
        ) : (
          <Link to="/tenant/profile" className="shrink-0 text-green-700 text-sm font-semibold hover:underline">
            View Profile →
          </Link>
        )}
      </div>

      {/* Suggested Properties */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recommended.map(prop => (
            <PropertyCard key={prop.id} property={prop} matchScore={prop.score} matchReasons={prop.reasons} role="tenant" />
          ))}
        </div>
        {recommended.length === 0 && <EmptyState message="No recommendations yet — complete your profile for better matches!" />}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Agreements */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Rental Agreements</h2>
          {agreements.length > 0 ? (
            <div className="space-y-4">
              {agreements.map(agr => <AgreementCard key={agr.id} agreement={agr} role="tenant" />)}
            </div>
          ) : (
            <EmptyState message="No active agreements." />
          )}
        </section>

        {/* Maintenance */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Maintenance Tickets</h2>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 min-h-[16rem]">
            {tickets.length > 0 ? (
              tickets.map(t => <TicketCard key={t.id} ticket={t} role="tenant" />)
            ) : (
              <EmptyState message="No tickets submitted." />
            )}
          </div>
        </section>
      </div>

      {/* Applications */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Your Property Applications</h2>
        <ApplicationList applications={applications} role="tenant" />
      </section>
    </div>
  );
};

export default TenantDashboard;
