import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Link } from 'react-router-dom';
import Modal from '../ui/Modal';
import LeaseDocument from '../lease/LeaseDocument';
import { Home, Wrench, CreditCard, FileText } from 'lucide-react';

const RenterDashboard = () => {
    const { user } = useAuth();
    const { applications, maintenanceRequests, properties, leases, addLease } = useData();
    const [leaseModalOpen, setLeaseModalOpen] = useState(false);

    // Find active lease
    const myLease = leases.find(l => l.tenantId === user.id);

    const myRequests = maintenanceRequests.filter(r => r.tenantId === user.id);
    const myApplications = applications.filter(a => a.applicantId === user.id);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">My Home</h1>
                <Link to="/maintenance">
                    <Button>Request Maintenance</Button>
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-indigo-100 mb-1">Current Balance</p>
                                <h2 className="text-3xl font-bold">$0.00</h2>
                            </div>
                            <CreditCard className="h-10 w-10 text-indigo-200 opacity-50" />
                        </div>
                        <Link to="/payments">
                            <Button variant="secondary" size="sm" className="mt-4 w-full bg-white/10 border-white/20 text-white hover:bg-white/20">
                                Make Payment
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => myLease && setLeaseModalOpen(true)}>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-purple-100 p-3 rounded-full">
                                <FileText className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Lease Agreement</p>
                                <p className="font-semibold text-gray-900">
                                    {myLease ? (myLease.signedByTenant ? 'Active' : 'Pending Sign') : 'No Lease'}
                                </p>
                            </div>
                        </div>
                        {myLease && (
                            <Button variant="ghost" size="sm" className="mt-4 w-full">
                                {myLease.signedByTenant ? 'View Document' : 'Sign Now'}
                            </Button>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-orange-100 p-3 rounded-full">
                                <Wrench className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Active Requests</p>
                                <p className="font-semibold text-gray-900">{myRequests.filter(r => r.status !== 'Completed').length} Open</p>
                            </div>
                        </div>
                        <Link to="/maintenance">
                            <Button variant="outline" size="sm" className="mt-4 w-full">View All</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                            <p className="font-medium text-gray-900">{app.propertyTitle}</p>
                                            <p className="text-sm text-gray-500 ">{app.propertyAddress}</p>
                                        </div>
                                        <Badge>{app.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No recent applications.</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Maintenance History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {myRequests.length > 0 ? (
                            <div className="space-y-4">
                                {myRequests.slice(0, 3).map(req => (
                                    <div key={req.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{req.title}</p>
                                            <p className="text-sm text-gray-500 ">{req.priority} Priority</p>
                                        </div>
                                        <Badge variant={req.status === 'Completed' ? 'success' : 'warning'}>{req.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-sm">No maintenance requests.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Modal
                isOpen={leaseModalOpen}
                onClose={() => setLeaseModalOpen(false)}
                title="My Lease Agreement"
                className="max-w-4xl"
            >
                {myLease && (
                    <LeaseDocument
                        lease={myLease}
                        onSign={() => {
                            // Update lease in context (mock)
                            // In real app, call updateLease
                            alert('Signed successfully! (Mock)');
                            setLeaseModalOpen(false);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
};

export default RenterDashboard;
