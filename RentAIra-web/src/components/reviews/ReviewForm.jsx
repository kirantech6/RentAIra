import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../ui/Button';
import { Star } from 'lucide-react';

const ReviewForm = ({ propertyId, onCancel }) => {
    const { user } = useAuth();
    const { addReview } = useData();
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoveredStar, setHoveredStar] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (rating === 0) return alert('Please select a rating');

        addReview({
            propertyId,
            tenantId: user.id,
            tenantName: user.name,
            rating,
            comment
        });
        // Reset form
        setRating(0);
        setComment('');
        if (onCancel) onCancel();
    };

    return (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoveredStar(star)}
                            onMouseLeave={() => setHoveredStar(0)}
                            className="focus:outline-none"
                        >
                            <Star
                                className={`w-6 h-6 transition-colors ${star <= (hoveredStar || rating)
                                        ? 'text-yellow-400 fill-current'
                                        : 'text-gray-300'
                                    }`}
                            />
                        </button>
                    ))}
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                    rows={3}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience..."
                    required
                />
            </div>
            <div className="flex space-x-2">
                <Button type="submit" size="sm">Submit Review</Button>
                {onCancel && <Button type="button" variant="ghost" size="sm" onClick={onCancel}>Cancel</Button>}
            </div>
        </form>
    );
};

export default ReviewForm;
