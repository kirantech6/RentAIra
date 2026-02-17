import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { UserPlus, CheckCircle } from 'lucide-react';

const AssignManagerForm = ({ propertyId, onCancel, onSuccess }) => {
    const { updateProperty } = useData();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate lookup and assignment
        setTimeout(() => {
            // In a real app, we'd look up the user by email to get their ID.
            // Here, we just blindly assign a dummy ID or 'u3' (our dummy manager)
            const mockManagerId = 'u3';

            updateProperty(propertyId, { managerId: mockManagerId });
            setLoading(false);
            setSubmitted(true);
            if (onSuccess) onSuccess();
        }, 1000);
    };

    if (submitted) {
        return (
            <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Manager Invited</h3>
                <p className="text-sm text-gray-500 mt-1">
                    An invitation has been sent to {email}. They will have access once they accept.
                </p>
                <Button className="mt-4" onClick={onCancel} variant="outline" size="sm">Close</Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-indigo-50 p-4 rounded-lg flex items-start">
                <UserPlus className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-indigo-700">
                    Delegating this property will give the manager access to maintenance requests and operational tasks.
                </p>
            </div>

            <Input
                label="Property Manager Email"
                type="email"
                placeholder="manager@example.com"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
            />

            <div className="flex space-x-3 pt-2">
                <Button type="submit" className="flex-1" isLoading={loading}>
                    Send Invitation
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
            </div>
        </form>
    );
};

export default AssignManagerForm;
