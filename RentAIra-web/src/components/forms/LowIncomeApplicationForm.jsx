import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../ui/Card';
import { Upload, AlertCircle, CheckCircle } from 'lucide-react';

const LowIncomeApplicationForm = ({ onSuccess }) => {
    const { user } = useAuth();
    const { submitIncomeApplication } = useData();
    const [formData, setFormData] = useState({
        annualIncome: '',
        householdSize: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            submitIncomeApplication({
                applicantId: user.id,
                applicantName: user.name,
                ...formData,
                proofDocument: 'dummy_document.pdf' // Simulated upload
            });
            setLoading(false);
            setSubmitted(true);
            if (onSuccess) onSuccess();
        }, 1500);
    };

    if (submitted) {
        return (
            <div className="text-center py-6">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900">Application Submitted</h3>
                <p className="text-sm text-gray-500 mt-1">
                    Your documents have been received and are under review. You will be notified once your status is verified.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                    Verified low-income status may qualify you for reduced deposits, rent assistance programs, and priority listing access.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Annual Household Income ($)"
                    type="number"
                    placeholder="e.g. 25000"
                    required
                    value={formData.annualIncome}
                    onChange={e => setFormData({ ...formData, annualIncome: e.target.value })}
                />
                <Input
                    label="Household Size"
                    type="number"
                    placeholder="e.g. 3"
                    required
                    value={formData.householdSize}
                    onChange={e => setFormData({ ...formData, householdSize: e.target.value })}
                />
            </div>

            <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Additional Context</label>
                <textarea
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    rows={3}
                    placeholder="Describe your current situation..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-900">Upload Proof of Income</span>
                <span className="mt-1 block text-xs text-gray-500">Pay stubs, Tax returns, or Benefits letters</span>
                <Button type="button" variant="outline" size="sm" className="mt-4">Choose File</Button>
            </div>

            <Button type="submit" className="w-full" isLoading={loading}>
                Submit Application
            </Button>
        </form>
    );
};

export default LowIncomeApplicationForm;
