export const USERS = [
    {
        id: 'u1',
        name: 'John Renter',
        email: 'renter@test.com',
        password: 'password',
        role: 'renter',
        incomeStatus: 'standard', // 'standard', 'pending', 'verified_low_income'
    },
    {
        id: 'u2',
        name: 'Jane Landlord',
        email: 'landlord@test.com',
        password: 'password',
        role: 'landlord',
        communityConscious: true, // New flag
    },
    {
        id: 'u3',
        name: 'Bob Manager',
        email: 'manager@test.com',
        password: 'password',
        role: 'manager',
    },
];

export const PROPERTIES = [
    {
        id: 'p1',
        title: 'Modern Apartment in Downtown',
        address: '123 Main St, New York, NY',
        price: 2500,
        bedrooms: 2,
        bathrooms: 2,
        type: 'Apartment',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
        description: 'A beautiful modern apartment in the heart of the city.',
        landlordId: 'u2',
        available: true,
        amenities: ['Gym', 'Pool', 'Parking'],
        rating: 4.5,
        managerId: 'u3', // Assigned to Bob Manager
    },
    {
        id: 'p2',
        title: 'Cozy Suburban House',
        address: '456 Oak Ln, Austin, TX',
        price: 1800,
        bedrooms: 3,
        bathrooms: 2,
        type: 'House',
        image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
        description: 'Perfect for families, this house has a large backyard.',
        landlordId: 'u2',
        available: true,
        amenities: ['Garden', 'Garage', 'Pet Friendly'],
        rating: 4.8,
    },
    {
        id: 'p3',
        title: 'Luxury Penthouse',
        address: '789 High Rise Blvd, Chicago, IL',
        price: 5000,
        bedrooms: 4,
        bathrooms: 3.5,
        type: 'Apartment',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
        description: 'Experience luxury living with stunning city views.',
        landlordId: 'u2',
        available: false,
        amenities: ['Concierge', 'Spa', 'Rooftop Deck'],
        rating: 5.0,
    },
];

export const APPLICATIONS = [];

export const MAINTENANCE_REQUESTS = [
    {
        id: 'm1',
        title: 'Leaky Faucet',
        description: 'The kitchen faucet is dripping constantly.',
        propertyId: 'p1',
        tenantId: 'u1',
        priority: 'Low',
        status: 'Pending',
        date: '2023-10-25',
    },
];

export const REVIEWS = [
    {
        id: 'r1',
        propertyId: 'p1',
        tenantId: 'u1',
        tenantName: 'John Renter',
        rating: 4,
        comment: 'Great apartment, very clean.',
        date: '2023-11-01',
        verified: true,
    }
];

export const MESSAGES = [
    {
        id: 'msg1',
        senderId: 'u1',
        receiverId: 'u2',
        content: 'Hi, is this property still available?',
        timestamp: '2023-10-20T10:00:00Z',
        read: true,
    },
    {
        id: 'msg2',
        senderId: 'u2',
        receiverId: 'u1',
        content: 'Yes, it is! When would you like to view it?',
        timestamp: '2023-10-20T10:30:00Z',
        read: false,
    }
];

export const INCOME_APPLICATIONS = [];

export const EXPENSES = [
    {
        id: 'e1',
        propertyId: 'p1',
        description: 'Plumbing Repair',
        amount: 150.00,
        date: '2023-10-26',
        category: 'Maintenance'
    }
];

export const SCHEDULED_TASKS = [
    {
        id: 'st1',
        propertyId: 'p1',
        title: 'Quarterly Hvac Check',
        date: '2023-11-15',
        recurrence: 'Quarterly',
        status: 'Scheduled'
    }
];

export const LEASES = [
    {
        id: 'l1',
        propertyId: 'p1',
        tenantId: 'u1',
        startDate: '2023-01-01',
        endDate: '2023-12-31',
        signedByTenant: true,
        signedByLandlord: true,
        rentAmount: 2500,
        documentUrl: '#'
    }
];
