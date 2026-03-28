import React from 'react';
import { Property, User } from '../../types';
import { explainMatchScore } from '../../utils/businessLogic';

interface PropertyCardProps {
  property: Property;
  matchScore?: number;
  matchReasons?: string[];   // pre-computed reasons; if absent we show generic UI
  onApply?: (propertyId: string, isPriority: boolean) => void;
  onEdit?: (propertyId: string) => void;
  role: 'tenant' | 'landlord';
}

const severityColors = {
  low:    'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high:   'bg-red-100 text-red-800',
};

const matchScoreColor = (score: number) => {
  if (score >= 70) return 'bg-green-500';
  if (score >= 45) return 'bg-yellow-400';
  return 'bg-red-400';
};

const PropertyCard: React.FC<PropertyCardProps> = ({
  property, matchScore, matchReasons, onApply, onEdit, role,
}) => {
  const [isPriority, setIsPriority] = React.useState(false);
  const [showWhy, setShowWhy] = React.useState(false);

  const isNearlyDisqualified = matchScore !== undefined && matchScore <= 40;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
      {/* Image area */}
      <div className="h-48 bg-gray-200 relative">
        {/* Match Score badge – top right */}
        {matchScore !== undefined && (
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1.5">
            <div
              className={`${matchScoreColor(matchScore)} text-white px-3 py-1 rounded-full text-sm font-bold shadow-sm flex items-center gap-1.5`}
            >
              <span>{matchScore}%</span>
              <span className="text-xs font-normal opacity-90">Match</span>
            </div>
            {/* Why this match? button – only for tenants */}
            {role === 'tenant' && (matchReasons?.length ?? 0) > 0 && (
              <button
                onClick={() => setShowWhy(!showWhy)}
                className="bg-white/90 backdrop-blur text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-sm hover:bg-white transition-colors"
              >
                {showWhy ? 'Hide ×' : 'Why this match?'}
              </button>
            )}
          </div>
        )}

        {/* Risk badge – top left */}
        <div className="absolute top-2 left-2 flex gap-1">
          <span className={`px-2 py-1 rounded-md text-xs font-semibold shadow-sm ${severityColors[property.riskLevel] ?? severityColors.low}`}>
            Risk: {property.riskLevel?.toUpperCase()}
          </span>
          {!property.isActive && (
            <span className="bg-gray-600 text-white px-2 py-1 rounded-md text-xs font-semibold shadow-sm">INACTIVE</span>
          )}
        </div>

        <img
          src="https://via.placeholder.com/400x200"
          alt={property.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* "Why this match?" expandable panel */}
      {showWhy && matchReasons && matchReasons.length > 0 && (
        <div className="bg-gray-50 border-b border-gray-100 px-4 py-3 space-y-1">
          <p className="text-xs font-bold text-gray-600 uppercase tracking-wide mb-1">Why this match?</p>
          {matchReasons.map((r, i) => (
            <p key={i} className="text-xs text-gray-700">{r}</p>
          ))}
        </div>
      )}

      {/* Lifestyle warning banner */}
      {isNearlyDisqualified && role === 'tenant' && (
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 flex items-center gap-1.5">
          <span className="text-amber-600 text-xs font-semibold">⚠ Might not fit your lifestyle preferences</span>
        </div>
      )}

      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-900 mb-0.5">{property.title}</h3>
        <p className="text-sm text-gray-500 mb-3">{property.locality}, {property.city}</p>

        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-xl font-bold text-[#FF4D5A]">
              ₹{property.rent.toLocaleString()}
              <span className="text-sm font-normal text-gray-500">/mo</span>
            </p>
            <p className="text-xs text-gray-500">Deposit: ₹{property.deposit.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-700">{property.bhk} BHK</p>
            <p className="text-xs text-gray-500 capitalize">{property.furnishing?.replace(/_/g, ' ')}</p>
          </div>
        </div>

        {/* Match score progress bar for tenants */}
        {matchScore !== undefined && role === 'tenant' && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] text-gray-400 mb-0.5">
              <span>Match quality</span>
              <span className="font-semibold">{matchScore}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${matchScoreColor(matchScore)}`}
                style={{ width: `${matchScore}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {role === 'tenant' && onApply && (
            <>
              <label className="flex items-start gap-2 text-sm text-gray-700 bg-gray-50 p-2 rounded-md cursor-pointer">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={isPriority}
                  onChange={(e) => setIsPriority(e.target.checked)}
                />
                <span>
                  <strong>Priority Application (₹500 fee)</strong>
                  <br />
                  <span className="text-xs text-gray-500">Highlight your application — landlords see it first!</span>
                </span>
              </label>
              <button
                onClick={() => onApply(property.id as string, isPriority)}
                className="flex-1 bg-[#FF4D5A] text-white py-2 rounded-lg font-semibold hover:bg-[#e03e4a] transition-colors"
                title="Priority applications will be highlighted for the landlord"
              >
                Apply Now
              </button>
            </>
          )}
          {role === 'landlord' && onEdit && (
            <button
              onClick={() => onEdit(property.id as string)}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Edit Property
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
