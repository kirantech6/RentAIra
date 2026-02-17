import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useLocale } from '../context/LocaleContext';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { MapPin, Bed, Bath, Check, ArrowLeft, Star } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import ReviewList from '../components/reviews/ReviewList';
import ReviewForm from '../components/reviews/ReviewForm';
import { useState } from 'react';

const PropertyDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { properties, addApplication, reviews } = useData();
    const { user } = useAuth();
    const { formatCurrency } = useLocale();
    const [showReviewForm, setShowReviewForm] = useState(false);

    const property = properties.find(p => p.id === id);
    const propertyReviews = reviews.filter(r => r.propertyId === id);

    if (!property) {
        return <div className="text-center py-12">Property not found</div>;
    }

    const handleApply = () => {
        if (!user) {
            navigate('/login?redirect=/properties/' + id);
            return;
        }
        const app = {
            propertyId: property.id,
            propertyTitle: property.title,
            propertyAddress: property.address,
            propertyRent: property.price,
            applicantId: user.id,
            applicantName: user.name,
        };
        addApplication(app);
        alert('Application submitted successfully! (Dummy)');
        navigate('/dashboard');
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6 pl-0 hover:bg-transparent hover:text-primary">
                <ArrowLeft className="mr-2 h-4 w-4" /> Back to Listings
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Images & Details */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-gray-100 rounded-2xl overflow-hidden shadow-sm aspect-video">
                        <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{property.title}</h1>
                                <div className="mt-2 flex items-center text-gray-500">
                                    <MapPin className="mr-2 h-5 w-5" />
                                    {property.address}
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-primary">{formatCurrency(property.price)}<span className="text-lg text-gray-400 font-normal">/mo</span></p>
                        </div>

                        <div className="flex items-center space-x-6 py-6 border-y border-gray-100">
                            <div className="flex items-center">
                                <Bed className="h-6 w-6 text-gray-400 mr-2" />
                                <span className="font-semibold">{property.bedrooms}</span> <span className="text-gray-500 ml-1">Bedrooms</span>
                            </div>
                            <div className="flex items-center">
                                <Bath className="h-6 w-6 text-gray-400 mr-2" />
                                <span className="font-semibold">{property.bathrooms}</span> <span className="text-gray-500 ml-1">Bathrooms</span>
                            </div>
                            <div className="flex items-center">
                                <Badge variant="default" className="text-sm px-3 py-1">{property.type}</Badge>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{property.description}</p>
                        </div>

                        <div className="mt-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Amenities</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {property.amenities.map(amenity => (
                                    <div key={amenity} className="flex items-center text-gray-600">
                                        <Check className="h-4 w-4 text-green-500 mr-2" />
                                        {amenity}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-semibold text-gray-900">Verified Reviews ({propertyReviews.length})</h3>
                            {user?.role === 'renter' && !showReviewForm && (
                                <Button variant="outline" size="sm" onClick={() => setShowReviewForm(true)}>Write a Review</Button>
                            )}
                        </div>

                        {showReviewForm && (
                            <div className="mb-6">
                                <ReviewForm propertyId={id} onCancel={() => setShowReviewForm(false)} />
                            </div>
                        )}

                        <ReviewList reviews={propertyReviews} />
                    </div>
                </div>

                {/* Right Column - Actions */}
                <div className="lg:col-span-1">
                    <Card className="sticky top-24">
                        <CardContent className="space-y-6 pt-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Interested in this property?</h3>
                                <p className="text-sm text-gray-500">Submit an application today to secure your spot.</p>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Monthly Rent</span>
                                    <span className="font-semibold">{formatCurrency(property.price)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Deposit</span>
                                    <span className="font-semibold">{formatCurrency(property.price)}</span>
                                </div>
                            </div>

                            {user?.role === 'landlord' || user?.role === 'manager' ? (
                                <Button className="w-full" disabled>Apply (Renters Only)</Button>
                            ) : (
                                <Button className="w-full" size="lg" onClick={handleApply} disabled={!property.available}>
                                    {property.available ? 'Apply Now' : 'Property Unavailable'}
                                </Button>
                            )}

                            <Button variant="outline" className="w-full">Schedule Viewing</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetails;
