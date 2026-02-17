import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { Calendar, Clock } from 'lucide-react';

const MaintenanceScheduler = ({ propertyId, onCancel, onSuccess }) => {
    const { addScheduledTask } = useData();
    const [task, setTask] = useState({
        title: '',
        date: '',
        recurrence: 'One-time', // One-time, Monthly, Quarterly, Yearly
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addScheduledTask({
            propertyId,
            ...task,
            status: 'Scheduled'
        });
        if (onSuccess) onSuccess();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-blue-700">
                    Schedule preventive maintenance to keep properties in top condition. Automated reminders will be sent.
                </p>
            </div>

            <Input
                label="Task Title"
                placeholder="e.g. HVAC Filter Change"
                required
                value={task.title}
                onChange={e => setTask({ ...task, title: e.target.value })}
            />

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Date"
                    type="date"
                    required
                    value={task.date}
                    onChange={e => setTask({ ...task, date: e.target.value })}
                />

                <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Recurrence</label>
                    <select
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 h-[42px]"
                        value={task.recurrence}
                        onChange={e => setTask({ ...task, recurrence: e.target.value })}
                    >
                        <option>One-time</option>
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Yearly</option>
                    </select>
                </div>
            </div>

            <div className="flex space-x-3 pt-2">
                <Button type="submit" className="flex-1">
                    Schedule Task
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

export default MaintenanceScheduler;
