import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Property, Application, Ticket, Agreement, User } from '../../types';
import ApplicationList from '../../components/common/ApplicationList';
import TicketCard from '../../components/common/TicketCard';
import AgreementCard from '../../components/common/AgreementCard';
import { Loader, EmptyState } from '../../components/common/UIStates';
import { Link } from 'react-router-dom';
import { computeLandlordProfileCompletion } from '../../utils/businessLogic';
import { useLocale } from '../../context/LocaleContext';

const LandlordDashboard: React.FC = () => {
  const { currentUser } = useAuth();

  const [properties, setProperties] = useState<Property[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [agreements, setAgreements] = useState<Agreement[]>([]);
  const [landlordProfile, setLandlordProfile] = useState<User | null>(null);
  const [tenantProfiles, setTenantProfiles] = useState<Record<string, Partial<User>>>({});
  const [loading, setLoading] = useState(true);
  const { formatCurrency } = useLocale();

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      const uid = currentUser?.uid || currentUser?.id;
      if (!uid) {
        setLoading(false);
        return;
      }
      
      try {
        // 0. Landlord Profile
        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) setLandlordProfile({ id: userDoc.id, ...userDoc.data() } as User);
        } catch (_) {}

        // 1. Properties
        const propSnap = await getDocs(query(collection(db, 'properties'), where('landlordId', '==', uid)));
        const props = propSnap.docs.map(d => ({ id: d.id, ...d.data() } as Property));
        setProperties(props);

        if (props.length === 0) return;

        const propIds = props.map(p => p.id);
        
        // 2. Applications (Firestore IN query limitation requires chunking if >10, assuming MVP <10 for now just query all or simple loops)
        const apps = await Promise.all(
          propIds.map(async pid => {
            const qObj = query(collection(db, 'applications'), where('propertyId', '==', pid));
            const snap = await getDocs(qObj);
            return snap.docs.map(d => ({ id: d.id, ...d.data() } as Application));
          })
        );
        // Sort applications to prioritize 'isPriority' == true
        const allApps = apps.flat().sort((a, b) => {
          if (a.isPriority && !b.isPriority) return -1;
          if (!a.isPriority && b.isPriority) return 1;
          return 0;
        });
        setApplications(allApps);

        // Fetch tenant profiles for Trust Score display (best-effort)
        const uniqueTenantIds = [...new Set(allApps.map(a => a.tenantId))].slice(0, 10);
        if (uniqueTenantIds.length > 0) {
          const profileMap: Record<string, Partial<User>> = {};
          await Promise.all(
            uniqueTenantIds.map(async tid => {
              try {
                const tSnap = await getDoc(doc(db, 'users', tid));
                if (tSnap.exists()) profileMap[tid] = tSnap.data() as Partial<User>;
              } catch (_) {}
            })
          );
          setTenantProfiles(profileMap);
        }

        // 3. Tickets
        const ticks = await Promise.all(
          propIds.map(async pid => {
            const qObj = query(collection(db, 'tickets'), where('propertyId', '==', pid), where('status', '!=', 'closed'));
            const snap = await getDocs(qObj);
            return snap.docs.map(d => ({ id: d.id, ...d.data() } as Ticket));
          })
        );
        setTickets(ticks.flat());
        
        // 4. Agreements
        const agreeSnap = await getDocs(query(collection(db, 'agreements'), where('landlordId', '==', uid)));
        setAgreements(agreeSnap.docs.map(d => ({ id: d.id, ...d.data() } as Agreement)));
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [currentUser]);

  if (loading) return <Loader />;

  const activePropertiesCount = properties.filter(p => p.isActive).length;
  const expectedRent = agreements.filter(a => a.status === 'active').reduce((acc, curr) => acc + curr.monthlyRent, 0);
  const totalPlatformFeesTheoretical = agreements.filter(a => a.status === 'active').reduce((acc, curr) => acc + (curr.platformFeeAmount || 0), 0);

  const handleAcceptApplication = async (appId: string) => {
    try {
      const application: Application | undefined = applications.find(a => a.id === appId);
      if (!application) return;

      const property: Property | undefined = properties.find(p => p.id === application.propertyId);
      if (!property) return;

      // 1. Accept Application
      await updateDoc(doc(db, 'applications', appId), { status: 'accepted' });

      // 2. Draft Agreement with Platform Fees
      const monthlyRent = property.rent;
      const platformFeePercent = 1;
      const platformFeeAmount = Math.round(monthlyRent * (platformFeePercent / 100));

      const draftAgreement: Partial<Agreement> = {
        propertyId: property.id,
        landlordId: currentUser!.uid,
        tenantId: application.tenantId,
        startDate: new Date(),
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
        monthlyRent,
        deposit: property.deposit,
        platformFeePercent,
        platformFeeAmount,
        status: 'draft',
        createdAt: new Date()
      };
      
      const agreementRef = await addDoc(collection(db, 'agreements'), draftAgreement);

      // Optional: Add to platformRevenues
      await addDoc(collection(db, 'platformRevenues'), {
        agreementId: agreementRef.id,
        landlordId: currentUser!.uid,
        tenantId: application.tenantId,
        propertyId: property.id,
        platformFeeAmount,
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        createdAt: new Date()
      });

      // Optimistic update
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: 'accepted' } : a));
      alert('Application accepted! A draft agreement has been created.');
      // A reload or optimistic setAgreements would apply here
      window.location.reload();
      
    } catch (e) {
      console.error(e);
      alert('Failed to process application');
    }
  };

  const handleRejectApplication = async (appId: string) => {
    try {
      await updateDoc(doc(db, 'applications', appId), { status: 'rejected' });
      setApplications(apps => apps.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Landlord Dashboard</h1>
        <Link to="/landlord/properties" className="text-[#FF4D5A] font-semibold hover:underline">Manage Properties →</Link>
      </div>

      {/* ── Landlord Profile Summary Card ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-800 text-white flex items-center justify-center text-lg font-bold shrink-0">
            {(landlordProfile?.businessName || landlordProfile?.name || 'L').charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-gray-900">{landlordProfile?.businessName || landlordProfile?.name || 'Complete your profile'}</p>
              {landlordProfile?.isVerified && (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded">✓ VERIFIED</span>
              )}
            </div>
            <p className="text-xs text-gray-500">
              📍 {landlordProfile?.primaryCity || 'Location / County not set'} ·{' '}
              Completion: <strong>{computeLandlordProfileCompletion(landlordProfile ?? {})}%</strong>
            </p>
            <p className="text-[10px] text-amber-700 bg-amber-50 rounded px-2 py-0.5 mt-1 inline-block">
              💡 Tenant Trust Score = profile completeness + rental history, references &amp; employment verification
            </p>
          </div>
        </div>
        <Link to="/landlord/profile" className="shrink-0 text-sm font-semibold text-[#FF4D5A] hover:underline">
          View Full Profile →
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-gray-500 text-sm font-semibold uppercase">Active Properties</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{activePropertiesCount}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-gray-500 text-sm font-semibold uppercase">Agreements / Tenants</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{agreements.filter(a => a.status === 'active').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-gray-500 text-sm font-semibold uppercase">Open Tickets</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{tickets.filter(t => t.status === 'open').length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
          <p className="text-gray-500 text-sm font-semibold uppercase">Exp. Monthly Rent</p>
          <p className="text-3xl font-bold text-green-600 mt-2">{formatCurrency(expectedRent)}</p>
        </div>
        <div className="bg-purple-50 p-6 rounded-xl shadow-sm border border-purple-100 flex flex-col items-center">
          <p className="text-purple-600 text-sm font-semibold uppercase">Platform Fees (Model)</p>
          <p className="text-3xl font-bold text-purple-900 mt-2">{formatCurrency(totalPlatformFeesTheoretical)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">Pending Applications</h2>
          <ApplicationList 
            applications={applications.filter(a => a.status === 'pending')} 
            role="landlord"
            tenantProfiles={tenantProfiles}
            onAccept={handleAcceptApplication}
            onReject={handleRejectApplication}
          />
          {applications.filter(a => a.status === 'pending').length === 0 && (
             <EmptyState message="No new applications to review." />
          )}
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">Action Required: Agreements</h2>
          {agreements.length > 0 ? (
            <div className="space-y-4">
              {agreements.filter(a => a.status === 'draft').map(agr => (
                <AgreementCard 
                  key={agr.id} 
                  agreement={agr} 
                  role="landlord" 
                  onGenerateSuccess={() => window.location.reload()}
                />
              ))}
            </div>
          ) : (
            <EmptyState message="All agreements processed." />
          )}
        </section>
      </div>

    </div>
  );
};

export default LandlordDashboard;
