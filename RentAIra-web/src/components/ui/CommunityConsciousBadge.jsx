import React from 'react';
import { Heart } from 'lucide-react';
import { cn } from '../../lib/utils';

const CommunityConsciousBadge = ({ className, size = 'sm' }) => {
    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-1.5',
        lg: 'text-base px-4 py-2',
    };

    return (
        <div className={cn(
            'inline-flex items-center rounded-full bg-rose-100 text-rose-800 font-medium',
            sizeClasses[size],
            className
        )}>
            <Heart className={cn('fill-current mr-1.5', size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
            Community Conscious
        </div>
    );
};

export default CommunityConsciousBadge;
