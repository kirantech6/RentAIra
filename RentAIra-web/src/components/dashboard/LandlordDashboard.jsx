import React from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Modal from '../ui/Modal';
import AssignManagerForm from '../forms/AssignManagerForm';
import AnalyticsDashboard from './AnalyticsDashboard';
import { Building, Users, AlertTriangle, UserPlus } from 'lucide-react';
import { useState } from 'react';

const LandlordDashboard = () => {
    const { user } = useAuth();
    const { properties, maintenanceRequests, applications } = useData();
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedPropertyId, setSelectedPropertyId] = useState(null);

    const handleInviteManager = (propertyId) => {
        setSelectedPropertyId(propertyId);
        setAssignModalOpen(true);
    };

    const myProperties = properties.filter(p => p.landlordId === user.id);
    const myRequests = maintenanceRequests.filter(r => myProperties.some(p => p.id === r.propertyId));
    const myApplications = applications.filter(a => myProperties.some(p => p.id === a.propertyId));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Landlord Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-indigo-100 p-3 rounded-full">
                                <Building className="h-6 w-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Properties</p>
                                <p className="font-semibold text-gray-900">{myProperties.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <Users className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Applications</p>
                                <p className="font-semibold text-gray-900">{myApplications.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-red-100 p-3 rounded-full">
                                <AlertTriangle className="h-6 w-6 text-red-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Open Requests</p>
                                <p className="font-semibold text-gray-900">{myRequests.filter(r => r.status !== 'Completed').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Properties</CardTitle>
                        <Button size="sm">Add Property</Button>
                    </CardHeader>
                    <CardContent>
                        {myProperties.length > 0 ? (
                            <div className="space-y-4">
                                {myProperties.map(prop => (
                                    <div key={prop.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{prop.title}</p>
                                            <p className="text-sm text-gray-500 ">{prop.address}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            {prop.managerId ? (
                                                <Badge variant="outline" className="text-xs">Manager Assigned</Badge>
                                            ) : (
                                                <Button size="sm" variant="outline" className="text-xs" onClick={() => handleInviteManager(prop.id)}>
                                                    <UserPlus className="h-3 w-3 mr-1" /> Delegate
                                                </Button>
                                            )}
                                            <Badge variant={prop.available ? 'success' : 'secondary'}>
                                                {prop.available ? 'Available' : 'Occupied'}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No properties listed.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {myApplications.length > 0 ? (
                            <div className="space-y-4">
                                {myApplications.map(app => (
                                    <div key={app.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{app.applicantName}</p>
                                            <p className="text-sm text-gray-500 ">For: {app.propertyTitle}</p>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Button size="sm" variant="outline" className="text-xs">View</Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No new applications.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="border-t border-gray-200 pt-6">
                <AnalyticsDashboard />
            </div>

            <Modal
                isOpen={assignModalOpen}
                onClose={() => setAssignModalOpen(false)}
                title="Delegate Property Management"
            >
                <AssignManagerForm
                    propertyId={selectedPropertyId}
                    onCancel={() => setAssignModalOpen(false)}
                    onSuccess={() => setAssignModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default LandlordDashboard;
