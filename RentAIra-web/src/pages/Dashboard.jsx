import React from 'react';
import { useAuth } from '../context/AuthContext';
import RenterDashboard from '../components/dashboard/RenterDashboard';
import LandlordDashboard from '../components/dashboard/LandlordDashboard';
import ManagerDashboard from '../components/dashboard/ManagerDashboard';

const Dashboard = () => {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {user.role === 'renter' && <RenterDashboard />}
            {user.role === 'landlord' && <LandlordDashboard />}
            {user.role === 'manager' && <ManagerDashboard />}
        </div>
    );
};

export default Dashboard;
