import React from 'react';
import { Ticket } from '../../types';

interface TicketCardProps {
  ticket: Ticket;
  role: 'tenant' | 'landlord';
  onStatusUpdate?: (ticketId: string, newStatus: string) => void;
}

const statusColors = {
  open: 'bg-red-100 text-red-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  closed: 'bg-green-100 text-green-800',
};

const priorityColors = {
  high: 'text-red-600',
  medium: 'text-yellow-600',
  low: 'text-green-600',
};

const TicketCard: React.FC<TicketCardProps> = ({ ticket, role, onStatusUpdate }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-3">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="text-md font-bold text-gray-900">{ticket.title}</h4>
          <p className="text-sm text-gray-500 mt-1">{ticket.description}</p>
        </div>
        <div className="text-right ml-4">
          <span className={`px-2 py-1 rounded text-xs font-semibold ${statusColors[ticket.status]}`}>
            {ticket.status.toUpperCase()}
          </span>
          <p className={`text-xs mt-2 font-semibold capitalize ${priorityColors[ticket.priority]}`}>
            {ticket.priority} Priority
          </p>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
        <span>Created: {new Date(ticket.createdAt?.seconds * 1000 || ticket.createdAt).toLocaleDateString()}</span>
        
        {role === 'landlord' && onStatusUpdate && ticket.status !== 'closed' && (
          <select 
            className="border-gray-300 rounded text-xs text-gray-700 bg-gray-50 border p-1"
            value={ticket.status}
            onChange={(e) => onStatusUpdate(ticket.id as string, e.target.value)}
          >
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="closed">Closed</option>
          </select>
        )}
      </div>
    </div>
  );
};

export default TicketCard;
