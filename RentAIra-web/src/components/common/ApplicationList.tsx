import React from 'react';
import { Application, User } from '../../types';
import { computeTenantTrustScore, getTenantTrustLabel } from '../../utils/businessLogic';

interface ApplicationListProps {
  applications: Application[];
  role: 'tenant' | 'landlord';
  tenantProfiles?: Record<string, Partial<User>>; // landlord passes fetched tenant data
  onAccept?: (applicationId: string) => void;
  onReject?: (applicationId: string) => void;
}

const statusColors = {
  pending:  'bg-yellow-100 text-yellow-800',
  accepted: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
};

const trustColors: Record<string, string> = {
  High:   'bg-green-100 text-green-800',
  Medium: 'bg-amber-100 text-amber-800',
  Low:    'bg-red-100 text-red-700',
};

const ApplicationList: React.FC<ApplicationListProps> = ({
  applications, role, tenantProfiles = {}, onAccept, onReject,
}) => {
  if (!applications || applications.length === 0) {
    return <p className="text-gray-500 py-4">No applications found.</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <ul className="divide-y divide-gray-200">
        {applications.map((app) => {
          // Compute Trust Score if landlord view and we have the tenant profile
          const tenantProfile = tenantProfiles[app.tenantId];
          const trustScore = tenantProfile ? computeTenantTrustScore(tenantProfile) : null;
          const trustLabel = trustScore !== null ? getTenantTrustLabel(trustScore) : null;

          return (
            <li key={app.id} className={`p-4 hover:bg-gray-50 transition-colors flex items-center justify-between gap-3 ${app.isPriority ? 'border-l-4 border-purple-400' : ''}`}>
              <div className="flex-1 min-w-0">
                {/* Primary label row */}
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {role === 'landlord' ? `Tenant: ${app.tenantId.slice(0, 8)}…` : `Property: ${app.propertyId.slice(0, 8)}…`}
                  </p>

                  {/* Priority badge */}
                  {app.isPriority && (
                    <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0">
                      ⭐ Priority
                    </span>
                  )}

                  {/* Tenant Trust Score — landlord view only */}
                  {role === 'landlord' && trustLabel && (
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide shrink-0 ${trustColors[trustLabel]}`}>
                      Trust: {trustLabel} ({trustScore})
                    </span>
                  )}
                </div>

                {/* Message */}
                <p className="text-sm text-gray-500 truncate">"{app.message || 'No message provided'}"</p>

                {/* Tenant fee info */}
                {role === 'tenant' && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    Application fee: ₹{app.applicationFee ?? 0}
                  </p>
                )}

                {/* Trust score legend hint – landlord only */}
                {role === 'landlord' && trustLabel && (
                  <p className="text-[10px] text-gray-400 mt-0.5 italic">
                    Based on profile completeness, rental history & verification
                  </p>
                )}

                {/* Status + date */}
                <div className="flex items-center gap-2 mt-1.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[app.status]}`}>
                    {app.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {new Date(app.createdAt?.seconds * 1000 || app.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Accept / Reject buttons */}
              {role === 'landlord' && app.status === 'pending' && (
                <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                  <button
                    onClick={() => onAccept && onAccept(app.id as string)}
                    className="bg-green-600 text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onReject && onReject(app.id as string)}
                    className="bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ApplicationList;
