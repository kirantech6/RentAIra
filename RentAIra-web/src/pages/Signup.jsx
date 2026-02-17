import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'renter', // default
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        if (formData.password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        try {
            setLoading(true);
            const { confirmPassword, ...dataToSubmit } = formData;
            await register(dataToSubmit);
            setLoading(false);
            navigate('/login'); // Redirect to login
        } catch (err) {
            setError('Failed to create an account.');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-indigo-700">Join RentAIra</CardTitle>
                    <p className="text-center text-sm text-gray-500">The AI-Powered Era of Renting</p>
                </CardHeader>
                <CardContent>
                    {error && <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                        <div className="space-y-1">
                            <label className="block text-sm font-medium text-gray-700">I am a...</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2 bg-white"
                            >
                                <option value="renter">Renter</option>
                                <option value="landlord">Landlord</option>
                                <option value="manager">Property Manager</option>
                            </select>
                        </div>
                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />
                        <Button type="submit" className="w-full" isLoading={loading}>
                            Create Account
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-indigo-600 hover:text-indigo-500 font-medium">Log in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
