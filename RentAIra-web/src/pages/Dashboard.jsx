import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

/**
 * Generic /dashboard route now redirects to the role-specific dashboard.
 * This handles deep-link cases and legacy nav links.
 */
const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return null;

    if (user.role === 'tenant') return <Navigate to="/tenant/dashboard" replace />;
    if (user.role === 'landlord') return <Navigate to="/landlord/dashboard" replace />;

    // Legacy roles (renter/manager) — keep old behavior
    if (user.role === 'renter') return <Navigate to="/tenant/dashboard" replace />;

    return (
        <div className="p-10 text-center text-gray-500">
            Unknown role. Please contact support.
        </div>
    );
};

export default Dashboard;
