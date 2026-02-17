import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { CheckCircle } from 'lucide-react';

const PaymentsPage = () => {
    const [amount, setAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    // Dummy values
    const rentAmount = 2500;
    const serviceFee = 10;
    const total = rentAmount + serviceFee;

    const handlePayment = (e) => {
        e.preventDefault();
        setProcessing(true);
        setTimeout(() => {
            if (parseFloat(amount) === total) {
                setSuccess(true);
            } else {
                alert(`Please enter the exact amount: ${total}`);
            }
            setProcessing(false);
        }, 1500);
    };

    if (success) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center p-4">
                <Card className="max-w-md w-full text-center">
                    <CardContent className="pt-6">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                        <p className="text-gray-500 mb-6">Your transaction has been processed successfully.</p>

                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Transaction ID</span>
                                <span className="font-mono text-gray-900">TXN-{Date.now()}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Date</span>
                                <span className="text-gray-900">{new Date().toLocaleDateString()}</span>
                            </div>
                            <div className="flex justify-between font-bold pt-2 border-t border-gray-200">
                                <span className="text-gray-900">Total Paid</span>
                                <span className="text-gray-900">${total.toFixed(2)}</span>
                            </div>
                        </div>

                        <Button onClick={() => navigate('/dashboard')} className="w-full">Back to Dashboard</Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto px-4 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Pay Rent</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Monthly Rent</span>
                            <span className="font-medium">${rentAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Platform Fee</span>
                            <span className="font-medium">${serviceFee.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-200 mt-2">
                            <span className="text-gray-900">Total Due</span>
                            <span className="text-indigo-600">${total.toFixed(2)}</span>
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                        <Input
                            label="Enter Amount"
                            type="number"
                            placeholder="0.00"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                        />
                        <Button type="submit" className="w-full" isLoading={processing}>
                            Pay Now
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center">
                    <p className="text-xs text-gray-400 text-center">
                        This is a secure 256-bit SSL encrypted payment (Dummy).
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
};

export default PaymentsPage;
