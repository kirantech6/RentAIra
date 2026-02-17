import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLocale } from '../context/LocaleContext';
import { Card, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import { MapPin, Bed, Bath, Search } from 'lucide-react';

const Listings = () => {
    const { properties, loading } = useData();
    const { formatCurrency } = useLocale();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('All');

    if (loading) return <div className="p-8 text-center text-gray-500">Loading listings...</div>;

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            property.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = filterType === 'All' || property.type === filterType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Browse Rentals</h1>
                    <p className="mt-1 text-gray-500">Find your perfect home from our verified listings.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by location..."
                            className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm border p-2 bg-white"
                    >
                        <option value="All">All Types</option>
                        <option value="Apartment">Apartment</option>
                        <option value="House">House</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProperties.length > 0 ? (
                    filteredProperties.map((property) => (
                        <Link key={property.id} to={`/properties/${property.id}`} className="group">
                            <Card className="h-full hover:shadow-lg transition-shadow duration-200">
                                <div className="relative pb-48 overflow-hidden">
                                    <img
                                        className="absolute h-full w-full object-cover transition-transform duration-200 group-hover:scale-105"
                                        src={property.image}
                                        alt={property.title}
                                    />
                                    <div className="absolute top-2 right-2">
                                        <Badge variant={property.available ? 'success' : 'danger'}>
                                            {property.available ? 'Available' : 'Rented'}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-sm font-bold text-primary">{property.type}</p>
                                            <h3 className="mt-2 text-xl font-bold text-gray-900 group-hover:text-primary">
                                                {property.title}
                                            </h3>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900">{formatCurrency(property.price)}<span className="text-sm font-normal text-gray-500">/mo</span></p>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500">
                                        <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                                        {property.address}
                                    </div>
                                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500 bg-gray-50 rounded-lg p-2">
                                        <div className="flex items-center">
                                            <Bed className="mr-1.5 h-4 w-4" />
                                            {property.bedrooms} Beds
                                        </div>
                                        <div className="flex items-center">
                                            <Bath className="mr-1.5 h-4 w-4" />
                                            {property.bathrooms} Bath
                                        </div>
                                        <div>
                                            {property.price < 2000 && <span className="text-green-600 text-xs font-bold">Good Deal</span>}
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <Button variant="outline" className="w-full">View Details</Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No properties found</h3>
                        <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Listings;
