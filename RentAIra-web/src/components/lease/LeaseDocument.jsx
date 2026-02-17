import React, { useState } from 'react';
import Button from '../ui/Button';
import { FileText, CheckCircle, Download } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LeaseDocument = ({ lease, onSign }) => {
    const { user } = useAuth();
    const [signed, setSigned] = useState(false);

    const handleSign = () => {
        setSigned(true);
        if (onSign) onSign();
    };

    const isLandlord = user.role === 'landlord';
    const isTenant = user.role === 'renter';

    // Check if current user has already signed
    const alreadySigned = (isTenant && lease.signedByTenant) || (isLandlord && lease.signedByLandlord);

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <h3 className="font-semibold text-gray-900">Residential Lease Agreement</h3>
                </div>
                {alreadySigned ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircle className="w-3 h-3 mr-1" /> Signed
                    </span>
                ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending Signature
                    </span>
                )}
            </div>

            <div className="p-8 max-h-96 overflow-y-auto font-serif text-gray-700 leading-relaxed text-sm bg-gray-50/50">
                <p className="mb-4 text-center font-bold">RESIDENTIAL LEASE AGREEMENT</p>
                <p className="mb-4">
                    THIS LEASE AGREEMENT is made on this {new Date().getFullYear()} day by and between <strong>Landlord Name</strong> ("Landlord") and <strong>{user.name}</strong> ("Tenant").
                </p>
                <p className="mb-4">
                    1. <strong>PROPERTY</strong>. Landlord agrees to rent to Tenant the property located at [Property Address].
                </p>
                <p className="mb-4">
                    2. <strong>TERM</strong>. The term of this Lease shall begin on [Start Date] and end on [End Date].
                </p>
                <p className="mb-4">
                    3. <strong>RENT</strong>. Tenant agrees to pay rent in the amount of $[Amount] per month, due on the 1st of each month.
                </p>
                <p className="mb-4">
                    4. <strong>SECURITY DEPOSIT</strong>. Tenant deposits the sum of $[Amount] as security for performance of Tenant's obligations.
                </p>
                <p className="mb-4">
                    ... (Full legal text redacted for brevity) ...
                </p>
            </div>

            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" /> Download PDF
                </Button>

                {!alreadySigned && !signed && (
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-xs text-gray-500">By clicking Sign, you agree to the terms.</p>
                        </div>
                        <Button onClick={handleSign}>
                            Sign Agreement
                        </Button>
                    </div>
                )}

                {(alreadySigned || signed) && (
                    <div className="text-green-600 font-medium text-sm flex items-center">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Successfully Signed
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeaseDocument;
