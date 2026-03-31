import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { User, Property, Agreement, Ticket } from '../../types';
import { computeLandlordProfileCompletion } from '../../utils/businessLogic';
import { Loader } from '../../components/common/UIStates';
import { Link } from 'react-router-dom';

const CITY_OPTIONS = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Gurgaon', 'Noida', 'Ahmedabad'];

interface PortfolioStats {
  activePropertiesCount: number;
  activeTenantsCount: number;
  openTicketsCount: number;
  expectedMonthlyRentTotal: number;
}

const LandlordProfile: React.FC = () => {
  const { user } = useAuth();
  const currentUser = user;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [stats, setStats] = useState<PortfolioStats>({
    activePropertiesCount: 0, activeTenantsCount: 0, openTicketsCount: 0, expectedMonthlyRentTotal: 0
  });

  const [form, setForm] = useState<Partial<User>>({
    name: '', phone: '', businessName: '',
    primaryCity: '', operatingCities: [],
    panMasked: '', aadhaarLast4: '',
    ownershipDocsUploaded: false,
    typicalTenantType: 'mixed',
    ruleAllowBachelors: true,
    ruleAllowNonVeg: true,
    ruleAllowPets: false,
    preferredLeaseDurationMonths: 11,
    defaultRentDueDay: 5,
  });

  useEffect(() => {
    if (!currentUser) return;
    const uid = currentUser.uid || currentUser.id;
    if (!uid) {
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        // Profile
        const ref = doc(db, 'users', uid);
        const snap = await getDoc(ref);
        if (snap.exists()) setForm(prev => ({ ...prev, ...snap.data() }));

        // Portfolio stats
        const propSnap = await getDocs(query(collection(db, 'properties'), where('landlordId', '==', uid)));
        const props = propSnap.docs.map(d => ({ id: d.id, ...d.data() } as Property));
        const activeProps = props.filter(p => p.isActive);
        const propIds = props.map(p => p.id!).filter(Boolean);

        let openTickets = 0;
        if (propIds.length > 0) {
          const ticketSnap = await getDocs(query(collection(db, 'tickets'), where('propertyId', 'in', propIds.slice(0, 10))));
          openTickets = ticketSnap.docs.filter(d => d.data().status === 'open').length;
        }

        const agreeSnap = await getDocs(query(collection(db, 'agreements'), where('landlordId', '==', uid), where('status', '==', 'active')));
        const activeAgreements = agreeSnap.docs.map(d => d.data() as Agreement);

        setStats({
          activePropertiesCount: activeProps.length,
          activeTenantsCount: activeAgreements.length,
          openTicketsCount: openTickets,
          expectedMonthlyRentTotal: activeAgreements.reduce((sum, a) => sum + (a.monthlyRent ?? 0), 0),
        });
      } catch (err) {
        console.error('Error fetching profile data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [currentUser]);

  const completion = computeLandlordProfileCompletion(form);

  const validate = (): boolean => {
    const errs: string[] = [];
    if ((form.preferredLeaseDurationMonths ?? 0) <= 0) errs.push('Lease duration must be > 0 months.');
    const dueDay = form.defaultRentDueDay ?? 0;
    if (dueDay < 1 || dueDay > 28) errs.push('Rent due day must be between 1 and 28.');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = async () => {
    if (!currentUser || !validate()) return;
    const uid = currentUser.uid || currentUser.id;
    if (!uid) return;
    setSaving(true);
    try {
      const ref = doc(db, 'users', uid);
      await setDoc(ref, {
        ...form,
        role: 'landlord',
        profileCompletionPercent: computeLandlordProfileCompletion(form),
        lastProfileUpdatedAt: new Date(),
      }, { merge: true });
      setSaveMsg('Profile saved!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      console.error(e);
      setSaveMsg('Error saving profile.');
    } finally {
      setSaving(false);
    }
  };

  const toggleCity = (city: string) => {
    const curr = form.operatingCities ?? [];
    setForm(prev => ({
      ...prev,
      operatingCities: curr.includes(city) ? curr.filter(c => c !== city) : [...curr, city],
    }));
  };

  const input = (key: keyof User, type = 'text', placeholder = '') => (
    <input
      type={type}
      placeholder={placeholder}
      value={(form[key] as string | number) ?? ''}
      onChange={e => setForm(prev => ({ ...prev, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D5A]"
    />
  );

  const sel = (key: keyof User, options: { value: string; label: string }[]) => (
    <select
      value={(form[key] as string) ?? ''}
      onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D5A]"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );

  const toggle = (key: keyof User, label: string) => (
    <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
      <input
        type="checkbox"
        checked={!!(form[key])}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.checked }))}
        className="rounded"
      />
      {label}
    </label>
  );

  const fieldWrap = (label: string, children: React.ReactNode) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {children}
    </div>
  );

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form.businessName || form.name || 'Your Name'}</h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <span>Landlord</span>
              {form.isVerified && <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-0.5 rounded">✓ VERIFIED</span>}
              <span>· {form.primaryCity || 'City not set'}</span>
              <span className={`font-semibold ${
                form.kycStatus === 'verified' ? 'text-green-600' :
                form.kycStatus === 'pending' ? 'text-yellow-600' : 'text-gray-400'
              }`}>
                KYC: {(form.kycStatus ?? 'not_submitted').replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
          <Link to="/landlord/dashboard" className="text-sm text-[#FF4D5A] font-medium hover:underline">
            ← Dashboard
          </Link>
        </div>
        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Profile Completeness</span>
            <span className="font-bold">{completion}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${completion >= 80 ? 'bg-green-500' : completion >= 50 ? 'bg-yellow-400' : 'bg-[#FF4D5A]'}`}
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
      </div>

      {/* Portfolio Stats (read-only) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Properties', value: stats.activePropertiesCount, color: 'text-gray-900' },
          { label: 'Active Tenants', value: stats.activeTenantsCount, color: 'text-blue-700' },
          { label: 'Open Tickets', value: stats.openTicketsCount, color: 'text-red-600' },
          { label: 'Expected Rent', value: `₹${stats.expectedMonthlyRentTotal.toLocaleString()}`, color: 'text-green-700' },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 text-center">
            <p className="text-xs text-gray-500 font-semibold uppercase">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 space-y-1">
          {errors.map((e, i) => <p key={i}>⚠ {e}</p>)}
        </div>
      )}

      {/* ── Basic Info ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldWrap('Full Name', input('name', 'text', 'Full name'))}
          {fieldWrap('Business Name (optional)', input('businessName', 'text', 'e.g. My Properties Ltd'))}
          {fieldWrap('Phone', input('phone', 'text', '+91 98765 43210'))}
          {fieldWrap('Primary City', input('primaryCity', 'text', 'e.g. Bangalore'))}
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Operating Cities</label>
          <div className="flex flex-wrap gap-2">
            {CITY_OPTIONS.map(city => (
              <button
                key={city}
                type="button"
                onClick={() => toggleCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  (form.operatingCities ?? []).includes(city)
                    ? 'bg-[#FF4D5A] text-white border-[#FF4D5A]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#FF4D5A]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── KYC & Verification ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">KYC & Verification</h2>
        <p className="text-xs text-gray-400">These fields are masked for security. Provide only masked/partial values.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldWrap('PAN (masked)', input('panMasked', 'text', 'e.g. ABCPXXXXD'))}
          {fieldWrap('Aadhaar Last 4 Digits', input('aadhaarLast4', 'text', 'e.g. 1234'))}
        </div>
        <div className="flex gap-6">
          {toggle('ownershipDocsUploaded', 'Ownership documents uploaded / on file')}
        </div>
      </div>

      {/* ── Policies ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Policies & Preferences</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fieldWrap('Typical Tenant Type', sel('typicalTenantType', [
            { value: 'families', label: 'Families' },
            { value: 'students', label: 'Students' },
            { value: 'working_professionals', label: 'Working Professionals' },
            { value: 'mixed', label: 'Mixed / Any' },
          ]))}
          {fieldWrap('Preferred Lease Duration (months)', input('preferredLeaseDurationMonths', 'number', '11'))}
          {fieldWrap('Rent Due Day (1–28)', input('defaultRentDueDay', 'number', '5'))}
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          {toggle('ruleAllowBachelors', 'Allow bachelors')}
          {toggle('ruleAllowNonVeg', 'Allow non-vegetarian food')}
          {toggle('ruleAllowPets', 'Allow pets')}
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#FF4D5A] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#e03e4a] transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving…' : 'Save Profile'}
        </button>
        {saveMsg && <p className={`text-sm font-medium ${saveMsg.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>{saveMsg}</p>}
      </div>
    </div>
  );
};

export default LandlordProfile;
