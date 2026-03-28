import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';
import { Menu, X, User, LogOut, Home, Building, MessageSquare } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { locale, setLocale, availableLocales } = useLocale();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white sticky top-0 z-50 py-4 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left: Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 transition-all duration-300 hover:opacity-90">
                            <img src="/images/logo_icon.png" alt="RentAIra Icon" className="h-10 w-auto" />
                            <span className="text-2xl tracking-tight text-charcoal">
                                <span className="font-normal">Rent</span>
                                <span className="font-bold text-primary">AI</span>
                                <span className="font-normal">ra</span>
                            </span>
                        </Link>
                    </div>

                    {/* Center: Main Navigation */}
                    <div className="hidden md:flex flex-1 justify-center items-center space-x-12">
                        <Link to="/listings" className="text-charcoal hover:text-primary text-[15px] font-medium transition-colors">
                            Browse Rentals
                        </Link>
                        <a href="#how-it-works" className="text-charcoal hover:text-primary text-[15px] font-medium transition-colors">
                            How It Works
                        </a>
                        <Link to="/landlords" className="text-charcoal hover:text-primary text-[15px] font-medium transition-colors">
                            For Landlords
                        </Link>
                    </div>

                    {/* Locale Selector */}
                    <div className="hidden md:flex items-center mr-6">
                        <select
                            value={locale}
                            onChange={(e) => setLocale(e.target.value)}
                            className="bg-transparent text-sm font-medium text-charcoal border-none focus:ring-0 cursor-pointer"
                        >
                            {Object.entries(availableLocales).map(([code, data]) => (
                                <option key={code} value={code}>
                                    {data.flag} {code}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Right: Auth Actions */}
                    <div className="hidden md:flex items-center space-x-8">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                <Link
                                    to={user.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard'}
                                    className="text-charcoal hover:text-primary text-[15px] font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to={user.role === 'landlord' ? '/landlord/profile' : '/tenant/profile'}
                                    className="text-charcoal hover:text-primary text-[15px] font-medium transition-colors"
                                >
                                    My Profile
                                </Link>
                                <button onClick={handleLogout} className="text-charcoal hover:text-primary text-[15px] font-medium transition-colors">
                                    Logout
                                </button>
                                <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                    {user.name?.charAt(0).toUpperCase() ?? '?'}
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link to="/login" className="text-charcoal hover:text-primary text-[15px] font-medium transition-colors">
                                    Log in
                                </Link>
                                <Link to="/signup">
                                    <Button className="bg-primary hover:bg-primary-hover text-white rounded-full px-8 py-2.5 text-[15px] font-semibold transition-all shadow-sm hover:shadow-md">
                                        Sign up
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="bg-white p-2 rounded-md text-charcoal hover:bg-off-white focus:outline-none"
                        >
                            <span className="sr-only">Open main menu</span>
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t border-off-white px-4 pt-2 pb-6 space-y-4 shadow-xl animate-fade-in-down">
                    <Link to="/listings" className="block text-charcoal py-2 text-lg font-medium border-b border-off-white">
                        Browse Rentals
                    </Link>
                    <a href="#how-it-works" className="block text-charcoal py-2 text-lg font-medium border-b border-off-white">
                        How It Works
                    </a>
                    <Link to="/landlords" className="block text-charcoal py-2 text-lg font-medium border-b border-off-white">
                        For Landlords
                    </Link>

                    <div className="py-2 border-b border-off-white flex justify-between items-center">
                        <span className="text-lg font-medium text-charcoal">Region</span>
                        <select
                            value={locale}
                            onChange={(e) => setLocale(e.target.value)}
                            className="bg-transparent text-lg font-medium text-charcoal border-none focus:ring-0"
                        >
                            {Object.entries(availableLocales).map(([code, data]) => (
                                <option key={code} value={code}>
                                    {data.flag} {code} - {data.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {user ? (
                        <>
                            <Link
                                to={user.role === 'landlord' ? '/landlord/dashboard' : '/tenant/dashboard'}
                                className="block text-charcoal py-2 text-lg font-medium border-b border-off-white"
                            >
                                Dashboard
                            </Link>
                            <Link
                                to={user.role === 'landlord' ? '/landlord/profile' : '/tenant/profile'}
                                className="block text-charcoal py-2 text-lg font-medium border-b border-off-white"
                            >
                                My Profile
                            </Link>
                            <button onClick={handleLogout} className="block text-left w-full text-charcoal py-2 text-lg font-medium border-b border-off-white">
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="pt-4 space-y-4">
                            <Link to="/login" className="block text-center w-full py-3 text-lg font-medium text-charcoal bg-off-white rounded-xl">
                                Log in
                            </Link>
                            <Link to="/signup" className="block text-center w-full py-3 text-lg font-semibold text-white bg-primary rounded-xl shadow-lg">
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
