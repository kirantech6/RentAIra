import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Property } from '../../types';
import PropertyCard from '../../components/common/PropertyCard';
import { getFairRentRange, computeRiskLevel } from '../../utils/businessLogic';
import { useLocale } from '../../context/LocaleContext';

const LandlordProperties: React.FC = () => {
  const { currentUser } = useAuth();
  
  const [properties, setProperties] = useState<Property[]>([]);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentProp, setCurrentProp] = useState<Partial<Property>>({
    title: '', description: '', city: '', locality: '', pincode: '', bhk: 1, rent: 0, deposit: 0,
    furnishing: 'unfurnished', amenities: [], allowBachelors: true, allowNonVeg: true, allowPets: false,
    isActive: true, isVerified: false, riskLevel: 'low'
  });
  const [fairRent, setFairRent] = useState<{ min: number, max: number, avg: number } | null>(null);
  const { formatCurrency, currentCurrency } = useLocale();

  useEffect(() => {
    if (!currentUser) return;
    fetchProperties();
  }, [currentUser]);

  const fetchProperties = async () => {
    const propSnap = await getDocs(query(collection(db, 'properties'), where('landlordId', '==', currentUser!.uid)));
    setProperties(propSnap.docs.map(d => ({ id: d.id, ...d.data() } as Property)));
  };

  const handleEdit = (id: string) => {
    const prop = properties.find(p => p.id === id);
    if (prop) {
      setCurrentProp(prop);
      setIsEditing(true);
      calculateFairRent(prop.city, prop.bhk);
    }
  };

  const calculateFairRent = async (city: string, bhk: number) => {
    if (!city || !bhk) return;
    const propSnap = await getDocs(query(collection(db, 'properties'), where('city', '==', city), where('bhk', '==', bhk)));
    const prices = propSnap.docs.map(d => d.data().rent);
    setFairRent(getFairRentRange(prices));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    // Recalculate risk on save based on ratio
    currentProp.riskLevel = computeRiskLevel(currentProp as Property, 0); // basic MVP risk

    if (currentProp.id) {
      await updateDoc(doc(db, 'properties', currentProp.id), currentProp as any);
      alert('Updated successfully');
    } else {
      currentProp.landlordId = currentUser.uid;
      currentProp.createdAt = new Date();
      await addDoc(collection(db, 'properties'), currentProp as any);
      alert('Created successfully');
    }
    
    setIsEditing(false);
    setCurrentProp({
      title: '', description: '', city: '', locality: '', pincode: '', bhk: 1, rent: 0, deposit: 0,
      furnishing: 'unfurnished', amenities: [], allowBachelors: true, allowNonVeg: true, allowPets: false,
      isActive: true, isVerified: false, riskLevel: 'low'
    });
    setFairRent(null);
    fetchProperties();
  };

  if (isEditing) {
    return (
      <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 mt-6">
        <h2 className="text-2xl font-bold mb-6">{currentProp.id ? 'Edit' : 'Create'} Property</h2>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Title" required className="border p-2 rounded col-span-2"
              value={currentProp.title} onChange={e => setCurrentProp({ ...currentProp, title: e.target.value })} />
            <input type="text" placeholder="Location / County" required className="border p-2 rounded"
              value={currentProp.city} onChange={e => {
                setCurrentProp({ ...currentProp, city: e.target.value });
                calculateFairRent(e.target.value, currentProp.bhk || 1);
              }} />
            <input type="text" placeholder="Locality or Neighborhood" required className="border p-2 rounded"
              value={currentProp.locality} onChange={e => setCurrentProp({ ...currentProp, locality: e.target.value })} />
            <input type="number" placeholder="BHK" required className="border p-2 rounded"
              value={currentProp.bhk || ''} onChange={e => {
                setCurrentProp({ ...currentProp, bhk: parseInt(e.target.value) });
                calculateFairRent(currentProp.city || '', parseInt(e.target.value));
              }} />
            <div className="flex gap-2">
              <input type="number" placeholder={`Rent (${currentCurrency.symbol})`} required className="border p-2 rounded w-full"
                value={currentProp.rent || ''} onChange={e => setCurrentProp({ ...currentProp, rent: parseInt(e.target.value) })} />
              <input type="number" placeholder={`Deposit (${currentCurrency.symbol})`} required className="border p-2 rounded w-full"
                value={currentProp.deposit || ''} onChange={e => setCurrentProp({ ...currentProp, deposit: parseInt(e.target.value) })} />
            </div>
            <select className="border p-2 rounded" value={currentProp.furnishing} onChange={e => setCurrentProp({ ...currentProp, furnishing: e.target.value as any })}>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi_furnished">Semi Furnished</option>
              <option value="fully_furnished">Fully Furnished</option>
            </select>
          </div>

          {/* AI Fair Rent Suggestion */}
          {fairRent && fairRent.avg > 0 && (
            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg my-4 flex justify-between items-center text-sm font-semibold">
              <span>🤖 Fair Rent Insight for {currentProp.bhk} BHK in {currentProp.city}:</span>
              <span>Suggested Range: {formatCurrency(fairRent.min)} - {formatCurrency(fairRent.max)} (Avg: {formatCurrency(fairRent.avg)})</span>
            </div>
          )}

          <div className="flex gap-4 border-t pt-4">
            <label className="flex items-center gap-1"><input type="checkbox" checked={currentProp.allowBachelors} onChange={e => setCurrentProp({ ...currentProp, allowBachelors: e.target.checked })} /> Bachelors</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={currentProp.allowNonVeg} onChange={e => setCurrentProp({ ...currentProp, allowNonVeg: e.target.checked })} /> Non-Veg</label>
            <label className="flex items-center gap-1"><input type="checkbox" checked={currentProp.allowPets} onChange={e => setCurrentProp({ ...currentProp, allowPets: e.target.checked })} /> Pets</label>
            <label className="flex items-center gap-1 ml-auto"><input type="checkbox" checked={currentProp.isActive} onChange={e => setCurrentProp({ ...currentProp, isActive: e.target.checked })} /> Active Listing</label>
          </div>
          
          <div className="flex gap-4">
            <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 border rounded font-semibold text-gray-600 hover:bg-gray-50 flex-1">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#FF4D5A] text-white rounded font-semibold hover:bg-[#e03946] flex-1 border border-transparent">Save Property</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Properties</h1>
        <button onClick={() => setIsEditing(true)} className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800">
          + Add Property
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map(p => (
          <PropertyCard key={p.id} property={p} role="landlord" onEdit={() => handleEdit(p.id as string)} />
        ))}
        {properties.length === 0 && <p className="text-gray-500 col-span-full">You haven't added any properties yet.</p>}
      </div>
    </div>
  );
};

export default LandlordProperties;
