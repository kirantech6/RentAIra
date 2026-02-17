import React from 'react';
import { Star, ShieldCheck } from 'lucide-react';
import Badge from '../ui/Badge';

const ReviewList = ({ reviews = [] }) => {
    return (
        <div className="space-y-6">
            {reviews.length > 0 ? (
                reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center">
                                <span className="font-semibold text-gray-900 mr-2">{review.tenantName}</span>
                                {review.verified && (
                                    <div className="flex items-center text-green-600 text-xs font-medium" title="Verified Tenant">
                                        <ShieldCheck className="w-3 h-3 mr-0.5" /> Verified
                                    </div>
                                )}
                            </div>
                            <div className="flex text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600 text-sm">{review.comment}</p>
                        <p className="text-gray-400 text-xs mt-2">{new Date(review.date).toLocaleDateString()}</p>
                    </div>
                ))
            ) : (
                <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience!</p>
            )}
        </div>
    );
};

export default ReviewList;
