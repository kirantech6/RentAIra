import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Input from '../components/ui/Input';
import LowIncomeApplicationForm from '../components/forms/LowIncomeApplicationForm';
import CommunityConsciousBadge from '../components/ui/CommunityConsciousBadge';
import { Building, Shield, User, Heart } from 'lucide-react';

const Profile = () => {
    const { user, logout, updateUser } = useAuth(); // Assume updateUser exists or we add it
    const { incomeApplications } = useData();
    const [isEditing, setIsEditing] = useState(false);
    const [showIncomeStatus, setShowIncomeStatus] = useState(false);

    // Derive status from user object or applications
    const activeApplication = incomeApplications.find(a => a.applicantId === user.id);
    const incomeStatus = user.incomeStatus || 'standard';

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        // Logic to update profile would go here
        setIsEditing(false);
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <Button variant="outline" onClick={logout}>Sign Out</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Profile Info */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-start mb-6">
                            <div className="bg-indigo-100 p-4 rounded-full mr-4">
                                <User className="h-8 w-8 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-gray-500 capitalize">{user.role}</p>
                                {user.role === 'landlord' && user.communityConscious && (
                                    <CommunityConsciousBadge className="mt-2" />
                                )}
                                {incomeStatus === 'verified_low_income' && (
                                    <Badge variant="success" className="mt-2">Verified Low-Income</Badge>
                                )}
                            </div>
                        </div>

                        <form className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Full Name" defaultValue={user.name} disabled={!isEditing} />
                                <Input label="Email" defaultValue={user.email} disabled />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <Input label="Phone" defaultValue="+1 (555) 000-0000" disabled={!isEditing} />
                                <Input label="Location" defaultValue="New York, NY" disabled={!isEditing} />
                            </div>
                            {isEditing ? (
                                <div className="flex space-x-2">
                                    <Button onClick={handleUpdateProfile}>Save Changes</Button>
                                    <Button variant="ghost" onClick={() => setIsEditing(false)}>Cancel</Button>
                                </div>
                            ) : (
                                <Button variant="outline" onClick={() => setIsEditing(true)}>Edit Profile</Button>
                            )}
                        </form>
                    </CardContent>
                </Card>

                {/* Status & Badges Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Trust Score</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="inline-flex items-center justify-center p-4 rounded-full bg-green-50 border-4 border-green-100 mb-2">
                                <Shield className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="text-3xl font-bold text-gray-900">Verified</div>
                            <p className="text-sm text-gray-500 mt-1">Identity & Email Confirmed</p>
                        </CardContent>
                    </Card>

                    {/* Economic Inclusion Section (Renters Only) */}
                    {user.role === 'renter' && (
                        <Card className={incomeStatus === 'verified_low_income' ? 'border-indigo-200 bg-indigo-50' : ''}>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    Economic Inclusion
                                    {incomeStatus === 'verified_low_income' && <CheckCircle className="ml-2 h-4 w-4 text-indigo-600" />}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {incomeStatus === 'verified_low_income' ? (
                                    <p className="text-sm text-indigo-800">
                                        You are verified as eligible for rent assistance programs and reduced deposits.
                                    </p>
                                ) : activeApplication ? (
                                    <div className="text-center">
                                        <Badge variant="warning">Application Pending</Badge>
                                        <p className="text-xs text-gray-500 mt-2">Submitted on {activeApplication.date}</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 mb-4">
                                            Apply for verified low-income status to access assistance programs.
                                        </p>
                                        <Button size="sm" onClick={() => setShowIncomeStatus(true)}>
                                            Apply Now
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>

            {/* Modal for Low Income Application */}
            {showIncomeStatus && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <Card className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <CardHeader className="flex justify-between items-center">
                            <CardTitle>Economic Inclusion Program</CardTitle>
                            <Button variant="ghost" size="sm" onClick={() => setShowIncomeStatus(false)}>Close</Button>
                        </CardHeader>
                        <CardContent>
                            <LowIncomeApplicationForm onSuccess={() => setShowIncomeStatus(false)} />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Profile;
