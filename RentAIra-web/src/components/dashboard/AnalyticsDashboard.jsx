import React from 'react';
import { useData } from '../../context/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';

const AnalyticsDashboard = () => {
    const { properties, expenses } = useData();

    // Mock calculations
    const totalProperties = properties.length;
    const occupiedProperties = properties.filter(p => !p.available).length;
    const occupancyRate = totalProperties > 0 ? Math.round((occupiedProperties / totalProperties) * 100) : 0;

    // Calculate total expenses for current month
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    const monthlyExpenses = expenses
        .filter(e => e.date.startsWith(currentMonth))
        .reduce((sum, e) => sum + e.amount, 0);

    // Mock Income (since we don't have full rent roll)
    const mockTotalRent = 2500 * occupiedProperties;
    const netIncome = mockTotalRent - monthlyExpenses;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Financial Overview</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-gray-500">Gross Income (Mo)</p>
                                <h3 className="text-xl font-bold text-gray-900">${mockTotalRent.toLocaleString()}</h3>
                            </div>
                            <TrendingUp className="h-4 w-4 text-green-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-gray-500">Expenses (Mo)</p>
                                <h3 className="text-xl font-bold text-gray-900">${monthlyExpenses.toLocaleString()}</h3>
                            </div>
                            <DollarSign className="h-4 w-4 text-red-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-gray-500">Net Operating Income</p>
                                <h3 className="text-xl font-bold text-gray-900">${netIncome.toLocaleString()}</h3>
                            </div>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-xs text-gray-500">Occupancy Rate</p>
                                <h3 className="text-xl font-bold text-gray-900">{occupancyRate}%</h3>
                            </div>
                            <Users className="h-4 w-4 text-purple-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Income vs Expenses (YTD)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Simple CSS Bar Chart Mock */}
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Income</span>
                                    <span>$85,000</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-green-500 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Expenses</span>
                                    <span>$32,000</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5">
                                    <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '32%' }}></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Expense Breakdown</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center text-sm border-b py-2">
                                <span>Maintenance</span>
                                <span className="font-medium">$15,200</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b py-2">
                                <span>Utilities</span>
                                <span className="font-medium">$8,450</span>
                            </div>
                            <div className="flex justify-between items-center text-sm border-b py-2">
                                <span>Insurance</span>
                                <span className="font-medium">$5,100</span>
                            </div>
                            <div className="flex justify-between items-center text-sm py-2">
                                <span>Other</span>
                                <span className="font-medium">$3,250</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
