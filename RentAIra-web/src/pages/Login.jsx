import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            setLoading(true);
            await login(email, password);
            setLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid email or password');
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50 px-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-center text-2xl font-bold text-indigo-700">Welcome Back</CardTitle>
                    <p className="text-center text-sm text-gray-500">Log in to your RentAIra account</p>
                </CardHeader>
                <CardContent>
                    {error && <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            label="Email Address"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                        <Input
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                            </div>
                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                            </div>
                        </div>
                        <Button type="submit" className="w-full" isLoading={loading}>
                            Sign In
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-indigo-600 hover:text-indigo-500 font-medium">Sign up</Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Login;
