import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { DollarSign } from 'lucide-react';

const ExpenseForm = ({ propertyId, onCancel, onSuccess }) => {
    const { addExpense } = useData();
    const [formData, setFormData] = useState({
        description: '',
        amount: '',
        category: 'Maintenance',
        date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addExpense({
            propertyId,
            ...formData,
            amount: parseFloat(formData.amount)
        });
        if (onSuccess) onSuccess();
        if (onCancel) onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Description"
                placeholder="e.g. Broken Pipe Repair"
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Amount ($)"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    required
                    value={formData.amount}
                    onChange={e => setFormData({ ...formData, amount: e.target.value })}
                />
                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 h-[42px]"
                        value={formData.category}
                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                    >
                        <option>Maintenance</option>
                        <option>Supplies</option>
                        <option>Contractor Fee</option>
                        <option>Utilities</option>
                        <option>Other</option>
                    </select>
                </div>
            </div>

            <Input
                label="Date"
                type="date"
                required
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
            />

            <div className="flex space-x-3 pt-2">
                <Button type="submit" className="flex-1">
                    Log Expense
                </Button>
                {onCancel && (
                    <Button type="button" variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                )}
            </div>
        </form>
    );
};

export default ExpenseForm;
