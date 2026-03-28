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
        role: 'tenant', // default to tenant (was 'renter')
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

            // After signup, send to role-appropriate profile page to complete setup
            if (formData.role === 'landlord') {
                navigate('/landlord/profile');
            } else {
                navigate('/tenant/profile');
            }
        } catch (err) {
            setError('Failed to create an account.');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold" style={{ color: '#FF4D5A' }}>Join RentAIra</CardTitle>
                    <p className="text-center text-sm text-gray-500 mt-1">Smart Renting Made Simple</p>
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
                            <label className="block text-sm font-medium text-gray-700">I am a…</label>
                            <div className="grid grid-cols-2 gap-3 mt-1">
                                {[
                                    { value: 'tenant', label: '🏠 Tenant', sub: 'Looking to rent' },
                                    { value: 'landlord', label: '🏢 Landlord', sub: 'Listing properties' },
                                ].map(opt => (
                                    <label
                                        key={opt.value}
                                        className={`flex flex-col items-center justify-center p-3 border-2 rounded-xl cursor-pointer transition-all ${
                                            formData.role === opt.value
                                                ? 'border-[#FF4D5A] bg-red-50'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="role"
                                            value={opt.value}
                                            checked={formData.role === opt.value}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className="text-xl mb-0.5">{opt.label.split(' ')[0]}</span>
                                        <span className="text-sm font-semibold text-gray-800">{opt.label.slice(2)}</span>
                                        <span className="text-[10px] text-gray-400">{opt.sub}</span>
                                    </label>
                                ))}
                            </div>
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
                        <p className="text-xs text-center text-gray-400">
                            After signup you'll be guided to complete your profile to get better matches.
                        </p>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#FF4D5A] hover:underline font-medium">Log in</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Signup;
