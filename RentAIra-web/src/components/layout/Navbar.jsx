import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLocale } from '../../context/LocaleContext';
import Button from '../ui/Button';
import { 
    Menu, X, ChevronDown, Calculator, RefreshCw, FileText, BookOpen, 
    FileSignature, UserCheck, Layout, Users, Sparkles, 
    Wrench, Smartphone, User, Database, Workflow, DollarSign, 
    UserCog, ShieldCheck, MessageSquare
} from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { locale, setLocale, availableLocales } = useLocale();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [isFeaturesOpen, setIsFeaturesOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const megaMenuData = [
        {
            category: 'Accounting',
            items: [
                { name: 'Bookkeeping', icon: <Calculator className="w-5 h-5 text-blue-600" /> },
                { name: 'Bank Sync', icon: <RefreshCw className="w-5 h-5 text-blue-600" /> },
                { name: 'Financial Reports', icon: <FileText className="w-5 h-5 text-blue-600" /> },
                { name: 'QuickBooks Integration', icon: <BookOpen className="w-5 h-5 text-blue-600" /> }
            ]
        },
        {
            category: 'Leasing',
            items: [
                { name: 'Listings & Advertising', icon: <FileText className="w-5 h-5 text-blue-600" /> },
                { name: 'Application & eSign', icon: <FileSignature className="w-5 h-5 text-blue-600" /> },
                { name: 'Tenant Screening', icon: <UserCheck className="w-5 h-5 text-blue-600" /> },
                { name: 'Websites', icon: <Layout className="w-5 h-5 text-blue-600" /> },
                { name: 'CRM', icon: <Users className="w-5 h-5 text-blue-600" /> },
                { name: 'AI Inspections', icon: <Sparkles className="w-5 h-5 text-blue-600" />, badge: 'NEW' }
            ]
        },
        {
            category: 'Operations',
            items: [
                { name: 'Maintenance', icon: <Wrench className="w-5 h-5 text-blue-600" /> },
                { name: 'Mobile App', icon: <Smartphone className="w-5 h-5 text-blue-600" /> },
                { name: 'Owner Portal', icon: <User className="w-5 h-5 text-blue-600" /> },
                { name: 'File Storage', icon: <Database className="w-5 h-5 text-blue-600" /> },
                { name: 'Workflows', icon: <Workflow className="w-5 h-5 text-blue-600" /> }
            ]
        },
        {
            category: 'Resident Experience',
            items: [
                { name: 'Rent Collection', icon: <DollarSign className="w-5 h-5 text-blue-600" /> },
                { name: 'Tenant Management', icon: <UserCog className="w-5 h-5 text-blue-600" /> },
                { name: 'Renters Insurance', icon: <ShieldCheck className="w-5 h-5 text-blue-600" /> },
                { name: 'Communications Tools', icon: <MessageSquare className="w-5 h-5 text-blue-600" /> }
            ]
        }
    ];

    return (
        <nav className="bg-white sticky top-0 z-50 border-b border-gray-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-[72px]">
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
                    <div className="hidden md:flex flex-1 justify-center items-center h-full space-x-10">
                        {/* Features Dropdown Menu */}
                        <div 
                            className="h-full flex items-center relative group"
                            onMouseEnter={() => setIsFeaturesOpen(true)}
                            onMouseLeave={() => setIsFeaturesOpen(false)}
                        >
                            <button className={`flex items-center space-x-1 text-[15px] font-medium transition-colors ${
                                isFeaturesOpen ? 'text-primary' : 'text-charcoal hover:text-primary'
                            }`}>
                                <span>Features</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isFeaturesOpen ? 'rotate-180' : ''}`} />
                            </button>
                            
                            {/* Mega Menu Overlay */}
                            <div className={`absolute top-full -translate-x-[40%] bg-white border border-gray-100 shadow-2xl rounded-2xl p-8 w-[1000px] transition-all duration-300 origin-top ${
                                isFeaturesOpen ? 'opacity-100 visible scale-100' : 'opacity-0 invisible scale-95'
                            }`}>
                                <div className="grid grid-cols-4 gap-8">
                                    {megaMenuData.map((col, idx) => (
                                        <div key={idx}>
                                            <h3 className="text-gray-900 font-bold mb-6 text-[15px]">{col.category}</h3>
                                            <ul className="space-y-5">
                                                {col.items.map((item, itemIdx) => (
                                                    <li key={itemIdx}>
                                                        <Link to="#" className="flex items-center group/item outline-none">
                                                            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center mr-4 transition-colors group-hover/item:bg-blue-100">
                                                                {item.icon}
                                                            </div>
                                                            <span className="text-gray-600 text-sm font-medium transition-colors group-hover/item:text-gray-900">
                                                                {item.name}
                                                            </span>
                                                            {item.badge && (
                                                                <span className="ml-3 bg-indigo-500 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                                                                    <Sparkles className="w-3 h-3" /> {item.badge}
                                                                </span>
                                                            )}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <Link to="/listings" className="text-charcoal hover:text-primary text-[15px] font-medium transition-colors">
                            Browse Rentals
                        </Link>
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
                    <div className="hidden md:flex items-center space-x-6">
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
                                    <Button className="bg-primary hover:bg-primary-hover text-white rounded-full px-7 py-2.5 text-[15px] font-semibold transition-all shadow-sm hover:shadow-md">
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
                <div className="md:hidden bg-white border-t border-off-white px-4 pt-2 pb-6 space-y-4 shadow-xl animate-fade-in-down absolute w-full max-h-[80vh] overflow-y-auto">
                    {/* Mobile Features List */}
                    <div className="mt-2 text-charcoal py-2 text-lg font-bold border-b border-off-white mb-2">Features Menu</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-6 px-4 pb-4 border-b border-off-white">
                        {megaMenuData.map((col, idx) => (
                            <div key={idx}>
                                <h3 className="text-gray-900 font-bold mb-3 text-sm">{col.category}</h3>
                                <ul className="space-y-3">
                                    {col.items.map((item, itemIdx) => (
                                        <li key={itemIdx}>
                                            <Link to="#" className="flex items-center text-sm text-gray-500">
                                                <div className="w-6 h-6 rounded bg-blue-50 flex items-center justify-center mr-2">
                                                    {React.cloneElement(item.icon, { className: "w-3 h-3 text-blue-600" })}
                                                </div>
                                                {item.name}
                                                {item.badge && <span className="ml-1 text-[8px] font-bold text-indigo-500 uppercase">New</span>}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>

                    <Link to="/listings" className="block text-charcoal py-2 text-lg font-medium border-b border-off-white">
                        Browse Rentals
                    </Link>
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
