import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { useNavigate } from 'react-router-dom';

const MaintenancePage = () => {
    const { user } = useAuth();
    const { maintenanceRequests, addMaintenanceRequest, properties } = useData();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        priority: 'Low',
        propertyId: '' // Would be auto-selected if user is in a unit
    });
    const navigate = useNavigate();

    // Mock finding the user's property. In a real app we'd have a stored relationship.
    // For now the user needs to select which property if we want to be explicit, 
    // or we assume they are renting 'p1' for demo if they are 'u1'.
    // Let's add a property dropdown for simplicity or just hardcode if renter.

    // Actually, let's just let them pick from all properties effectively "simulating" they live there for this prototype.
    // Or better, filter properties if they are a landlord.

    const handleSubmit = (e) => {
        e.preventDefault();
        // Fallback property ID if not selected (just for safety in demo)
        const request = {
            ...formData,
            propertyId: formData.propertyId || properties[0]?.id,
            tenantId: user.id
        };
        addMaintenanceRequest(request);
        navigate('/dashboard');
    };

    const myRequests = maintenanceRequests.filter(r =>
        user.role === 'renter' ? r.tenantId === user.id : true // Managers see all
    );

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Maintenance Center</h1>

            {user.role === 'renter' && (
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle>Submit New Request</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Property</label>
                                <select
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                    value={formData.propertyId}
                                    onChange={e => setFormData({ ...formData, propertyId: e.target.value })}
                                    required
                                >
                                    <option value="">Select Property</option>
                                    {properties.map(p => (
                                        <option key={p.id} value={p.id}>{p.title}</option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="Issue Title"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Priority</label>
                                <select
                                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                                    value={formData.priority}
                                    onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                >
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Emergency">Emergency</option>
                                </select>
                            </div>
                            <Button type="submit">Submit Request</Button>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Request History</CardTitle>
                </CardHeader>
                <CardContent>
                    {myRequests.length > 0 ? (
                        <div className="space-y-4">
                            {myRequests.map(req => (
                                <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0 gap-4">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-gray-900">{req.title}</p>
                                            <Badge variant={req.status === 'Completed' ? 'success' : 'warning'}>{req.status}</Badge>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">{req.description}</p>
                                        <p className="text-xs text-gray-400 mt-1">Submitted on {req.date} • {req.priority} Priority</p>
                                    </div>
                                    {user.role !== 'renter' && req.status !== 'Completed' && (
                                        <Button size="sm" variant="outline">Mark Complete</Button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No requests found.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MaintenancePage;
