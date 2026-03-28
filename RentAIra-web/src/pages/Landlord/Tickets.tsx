import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { Ticket } from '../../types';
import TicketCard from '../../components/common/TicketCard';

const LandlordTickets: React.FC = () => {
  const { currentUser } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    if (!currentUser) return;
    const fetchTickets = async () => {
      // Find properties
      const propSnap = await getDocs(query(collection(db, 'properties'), where('landlordId', '==', currentUser.uid)));
      const propIds = propSnap.docs.map(d => d.id);
      
      if (propIds.length > 0) {
        const ticks = await Promise.all(
          propIds.map(async pid => {
            const snap = await getDocs(query(collection(db, 'tickets'), where('propertyId', '==', pid)));
            return snap.docs.map(d => ({ id: d.id, ...d.data() } as Ticket));
          })
        );
        setTickets(ticks.flat());
      }
    };
    fetchTickets();
  }, [currentUser]);

  const handleStatusUpdate = async (ticketId: string, newStatus: string) => {
    await updateDoc(doc(db, 'tickets', ticketId), { status: newStatus });
    setTickets(ticks => ticks.map(t => t.id === ticketId ? { ...t, status: newStatus as any } : t));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Maintenance Tickets</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {tickets.sort((a,b) => b.createdAt - a.createdAt).map(t => (
          <TicketCard key={t.id} ticket={t} role="landlord" onStatusUpdate={handleStatusUpdate} />
        ))}
        {tickets.length === 0 && <p className="text-gray-500">No maintenance tickets received.</p>}
      </div>
    </div>
  );
};

export default LandlordTickets;
