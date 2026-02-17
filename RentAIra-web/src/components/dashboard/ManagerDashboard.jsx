import React from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import ExpenseForm from '../forms/ExpenseForm';
import MaintenanceScheduler from '../maintenance/MaintenanceScheduler';
import { CheckSquare, DollarSign, Plus, Calendar } from 'lucide-react';
import { useState } from 'react';

const ManagerDashboard = () => {
    const { maintenanceRequests } = useData();
    // Assuming manager sees all requests for now or assigned ones
    const activeRequests = maintenanceRequests.filter(r => r.status !== 'Completed');
    const [expenseModalOpen, setExpenseModalOpen] = useState(false);
    const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Property Manager Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <div className="bg-orange-100 p-3 rounded-full">
                                <CheckSquare className="h-6 w-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Pending Tasks</p>
                                <p className="font-semibold text-gray-900">{activeRequests.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setExpenseModalOpen(true)}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-green-100 p-3 rounded-full">
                                <DollarSign className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Log Expense</p>
                                <p className="text-sm text-gray-500">Record payments & repairs</p>
                            </div>
                        </div>
                        <Plus className="h-5 w-5 text-gray-400" />
                    </CardContent>
                </Card>

                <Card className="cursor-pointer hover:bg-gray-50 transition-colors" onClick={() => setScheduleModalOpen(true)}>
                    <CardContent className="p-6 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-full">
                                <Calendar className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">Schedule Task</p>
                                <p className="text-sm text-gray-500">Preventive maintenance</p>
                            </div>
                        </div>
                        <Plus className="h-5 w-5 text-gray-400" />
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Maintenance Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                    {activeRequests.length > 0 ? (
                        <div className="space-y-4">
                            {activeRequests.map(req => (
                                <div key={req.id} className="flex items-center justify-between border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                                    <div>
                                        <p className="font-medium text-gray-900">{req.title}</p>
                                        <p className="text-sm text-gray-500 ">{req.priority} Priority - {req.propertyId}</p>
                                    </div>
                                    <Badge>{req.status}</Badge>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">No pending tasks.</p>
                    )}
                </CardContent>
            </Card>

            <Modal
                isOpen={expenseModalOpen}
                onClose={() => setExpenseModalOpen(false)}
                title="Log Property Expense"
            >
                <ExpenseForm
                    propertyId="p1"
                    onCancel={() => setExpenseModalOpen(false)}
                    onSuccess={() => setExpenseModalOpen(false)}
                />
            </Modal>

            <Modal
                isOpen={scheduleModalOpen}
                onClose={() => setScheduleModalOpen(false)}
                title="Schedule Maintenance"
            >
                <MaintenanceScheduler
                    propertyId="p1"
                    onCancel={() => setScheduleModalOpen(false)}
                    onSuccess={() => setScheduleModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default ManagerDashboard;
