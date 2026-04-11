import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { User } from '../../types';
import { computeTenantProfileCompletion } from '../../utils/businessLogic';
import { Loader } from '../../components/common/UIStates';
import { Link } from 'react-router-dom';
import { useLocale } from '../../context/LocaleContext';

const CITY_OPTIONS = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai', 'Kolkata', 'Gurgaon', 'Noida', 'Ahmedabad'];

const TenantProfile: React.FC = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const { currentCurrency } = useLocale();

  const [form, setForm] = useState<Partial<User>>({
    name: '', phone: '', currentCity: '', ageRange: '',
    occupation: 'working_professional',
    preferredCities: [],
    budgetMin: 10000, budgetMax: 30000,
    desiredBhkMin: 1, desiredBhkMax: 3,
    desiredFurnishing: 'any',
    moveInDatePreference: 'flexible',
    isBachelor: false,
    foodPreference: 'veg_non_veg',
    hasPets: false, smokes: false,
    guestPolicyPreference: 'open',
    yearsRenting: 0, lastRentedCity: '',
    hasReferences: false,
  });

  useEffect(() => {
    if (!currentUser) return;
    const fetchProfile = async () => {
      try {
        const ref = doc(db, 'users', currentUser.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setForm(prev => ({ ...prev, ...snap.data() }));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [currentUser]);

  const completion = computeTenantProfileCompletion(form);

  const validate = (): boolean => {
    const errs: string[] = [];
    if ((form.budgetMin ?? 0) > (form.budgetMax ?? 0)) errs.push('Budget Min must be ≤ Budget Max.');
    if ((form.desiredBhkMin ?? 0) > (form.desiredBhkMax ?? 0)) errs.push('BHK Min must be ≤ BHK Max.');
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSave = async () => {
    if (!currentUser || !validate()) return;
    setSaving(true);
    try {
      const ref = doc(db, 'users', currentUser.uid);
      const payload: Partial<User> = {
        ...form,
        role: 'tenant',
        profileCompletionPercent: computeTenantProfileCompletion(form),
        lastProfileUpdatedAt: new Date(),
      };
      await setDoc(ref, payload, { merge: true });
      setSaveMsg('Profile saved successfully!');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e) {
      console.error(e);
      setSaveMsg('Error saving profile.');
    } finally {
      setSaving(false);
    }
  };

  const toggleCity = (city: string) => {
    const curr = form.preferredCities ?? [];
    setForm(prev => ({
      ...prev,
      preferredCities: curr.includes(city) ? curr.filter(c => c !== city) : [...curr, city],
    }));
  };

  const field = (label: string, children: React.ReactNode, hint?: string) => (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1">{label}</label>
      {hint && <p className="text-xs text-gray-400 mb-1">{hint}</p>}
      {children}
    </div>
  );

  const input = (key: keyof User, type = 'text', placeholder = '') => (
    <input
      type={type}
      placeholder={placeholder}
      value={(form[key] as string | number) ?? ''}
      onChange={e => setForm(prev => ({ ...prev, [key]: type === 'number' ? Number(e.target.value) : e.target.value }))}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF4D5A]"
    />
  );

  const select = (key: keyof User, options: { value: string; label: string }[]) => (
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

  if (loading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{form.name || 'Your Name'}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Tenant · {form.currentCity || 'Location / County not set'} ·{' '}
              <span className={`font-semibold ${
                form.kycStatus === 'verified' ? 'text-green-600' :
                form.kycStatus === 'pending' ? 'text-yellow-600' : 'text-gray-400'
              }`}>
                KYC: {(form.kycStatus ?? 'not_submitted').replace('_', ' ').toUpperCase()}
              </span>
            </p>
          </div>
          <Link to="/tenant/dashboard" className="text-sm text-[#FF4D5A] font-medium hover:underline">
            ← Dashboard
          </Link>
        </div>
        {/* Progress bar */}
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
          {completion < 80 && (
            <p className="text-xs text-[#FF4D5A] mt-1 font-medium">Complete your profile to see better property matches!</p>
          )}
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700 space-y-1">
          {errors.map((e, i) => <p key={i}>⚠ {e}</p>)}
        </div>
      )}

      {/* ── Section 1: Basic Info ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Basic Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Full Name', input('name', 'text', 'Your full name'))}
          {field('Phone', input('phone', 'text', '+1 234 567 8900'))}
          {field('Current Location/County', input('currentCity', 'text', 'e.g. Cook County, IL'))}
          {field('Age Range', select('ageRange', [
            { value: '', label: 'Prefer not to say' },
            { value: '18-24', label: '18–24' },
            { value: '25-34', label: '25–34' },
            { value: '35-44', label: '35–44' },
            { value: '45+', label: '45+' },
          ]))}
          {field('Occupation', select('occupation', [
            { value: 'student', label: 'Student' },
            { value: 'working_professional', label: 'Working Professional' },
            { value: 'self_employed', label: 'Self-employed' },
            { value: 'other', label: 'Other' },
          ]))}
        </div>
      </div>

      {/* ── Section 2: Rental Preferences ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Rental Preferences</h2>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Locations / Counties</label>
          <div className="flex flex-wrap gap-2">
            {CITY_OPTIONS.map(city => (
              <button
                key={city}
                type="button"
                onClick={() => toggleCity(city)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  (form.preferredCities ?? []).includes(city)
                    ? 'bg-[#FF4D5A] text-white border-[#FF4D5A]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-[#FF4D5A]'
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field(`Budget Min (${currentCurrency.symbol}/mo)`, input('budgetMin', 'number', '1000'))}
          {field(`Budget Max (${currentCurrency.symbol}/mo)`, input('budgetMax', 'number', '3000'))}
          {field('Desired BHK Min', input('desiredBhkMin', 'number', '1'))}
          {field('Desired BHK Max', input('desiredBhkMax', 'number', '3'))}
          {field('Desired Furnishing', select('desiredFurnishing', [
            { value: 'any', label: 'Any' },
            { value: 'unfurnished', label: 'Unfurnished' },
            { value: 'semi_furnished', label: 'Semi-furnished' },
            { value: 'fully_furnished', label: 'Fully Furnished' },
          ]))}
          {field('Move-in Preference', input('moveInDatePreference', 'text', 'flexible or YYYY-MM-DD'))}
        </div>
      </div>

      {/* ── Section 3: Lifestyle ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Lifestyle & Constraints</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Food Preference', select('foodPreference', [
            { value: 'veg_only', label: '🌱 Vegetarian only' },
            { value: 'veg_non_veg', label: '🍗 Veg & Non-veg' },
          ]))}
          {field('Guest Policy Preference', select('guestPolicyPreference', [
            { value: 'open', label: 'Open (guests welcome)' },
            { value: 'limited', label: 'Limited guests' },
            { value: 'strict', label: 'Strict (no overnight)' },
          ]))}
        </div>
        <div className="flex flex-wrap gap-6 pt-2">
          {toggle('isBachelor', 'I am a bachelor / unmarried')}
          {toggle('hasPets', 'I have pets')}
          {toggle('smokes', 'I smoke')}
        </div>
      </div>

      {/* ── Section 4: Rental History (optional) ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <h2 className="text-lg font-bold text-gray-900 border-b pb-2">Rental History <span className="text-xs font-normal text-gray-400">(optional)</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {field('Years Renting', input('yearsRenting', 'number', '0'))}
          {field('Last Rented Location / County', input('lastRentedCity', 'text', 'e.g. Orange County'))}
        </div>
        <div className="flex gap-6">
          {toggle('hasReferences', 'I have rental references')}
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

export default TenantProfile;
