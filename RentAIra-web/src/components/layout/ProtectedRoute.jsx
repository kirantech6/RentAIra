import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Navbar from './Navbar';
import Footer from './Footer';

const ProtectedRoute = ({ allowedRoles = [] }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading...</div>; // Could be a Spinner
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />; // Redirect to their own dashboard
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export const PublicLayout = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <Footer />
        </div>
    )
}

export default ProtectedRoute;
