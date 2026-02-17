import { useLocale } from '../../context/LocaleContext';

const FeaturedListings = () => {
    const { locale, formatCurrency } = useLocale();

    const listingsByLocale = {
        'US': [
            {
                id: 1,
                title: "Modern Minimalist Loft",
                price: 3200,
                location: "Chelsea, NY",
                beds: 1,
                baths: 1,
                img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800"
            },
            {
                id: 2,
                title: "Cozy Garden Apartment",
                price: 2850,
                location: "Brooklyn, NY",
                beds: 2,
                baths: 1,
                img: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800"
            },
            {
                id: 3,
                title: "Bright Studio Sanctuary",
                price: 2400,
                location: "Long Island City, NY",
                beds: 0,
                baths: 1,
                img: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=800"
            }
        ],
        'UK': [
            {
                id: 1,
                title: "Elegant Victorian Flat",
                price: 3000, // ~£2400
                location: "Kensington, London",
                beds: 2,
                baths: 2,
                img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800"
            },
            {
                id: 2,
                title: "Modern Canal-side Apartment",
                price: 2200, // ~£1800
                location: "Manchester, UK",
                beds: 1,
                baths: 1,
                img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800"
            },
            {
                id: 3,
                title: "Charming Cotswold Cottage",
                price: 2800, // ~£2300
                location: "Gloucestershire, UK",
                beds: 3,
                baths: 2,
                img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800"
            }
        ],
        'IN': [
            {
                id: 1,
                title: "Luxury Sea-view Apartment",
                price: 1500, // ~₹1.2 Lakh
                location: "Bandra West, Mumbai",
                beds: 3,
                baths: 3,
                img: "https://images.unsplash.com/photo-1626177196020-0f04c7c8c383?auto=format&fit=crop&q=80&w=800"
            },
            {
                id: 2,
                title: "Spacious Garden Villa",
                price: 1000, // ~₹83k
                location: "Whitefield, Bangalore",
                beds: 4,
                baths: 4,
                img: "https://images.unsplash.com/photo-1599809275671-b5942cabc7a2?auto=format&fit=crop&q=80&w=800"
            },
            {
                id: 3,
                title: "Modern High-rise Studio",
                price: 600, // ~₹50k
                location: "Gurgaon, NCR",
                beds: 1,
                baths: 1,
                img: "https://images.unsplash.com/photo-1613553507747-5f8d62ad5904?auto=format&fit=crop&q=80&w=800"
            }
        ]
    };

    const currentListings = listingsByLocale[locale] || listingsByLocale['US'];

    return (
        <section className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div>
                        <h2 className="text-[36px] md:text-[40px] font-bold text-charcoal mb-4">Featured homes</h2>
                        <p className="text-lg text-gray-500 font-medium max-w-[65ch]">Explore hand-picked, verified listings from our community.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {currentListings.map((listing) => (
                        <div key={listing.id} className="group cursor-pointer">
                            <div className="relative overflow-hidden rounded-3xl aspect-[4/3] mb-6">
                                <img
                                    src={listing.img}
                                    alt={listing.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center shadow-sm">
                                    <ShieldCheck className="h-4 w-4 text-primary mr-1.5" />
                                    <span className="text-xs font-bold text-charcoal uppercase tracking-wider">Verified</span>
                                </div>
                                <div className="absolute bottom-4 left-4 right-4 translate-y-20 group-hover:translate-y-0 transition-transform duration-500">
                                    <Button className="w-full bg-white/90 backdrop-blur-md text-charcoal font-bold rounded-xl py-3 shadow-lg">View details</Button>
                                </div>
                            </div>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-[20px] md:text-[24px] font-bold text-charcoal mb-1">{listing.title}</h3>
                                    <div className="flex items-center text-gray-400 font-medium mb-3">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {listing.location}
                                    </div>
                                    <div className="flex items-center space-x-6 text-gray-500 font-medium">
                                        <div className="flex items-center"><Bed className="h-5 w-5 mr-2" />{listing.beds === 0 ? 'Studio' : listing.beds}</div>
                                        <div className="flex items-center"><Bath className="h-5 w-5 mr-2" />{listing.baths}</div>
                                    </div>
                                </div>
                                <div className="text-[20px] md:text-[24px] font-bold text-primary">{formatCurrency(listing.price)}<span className="text-sm font-medium text-gray-500">/mo</span></div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-20 text-center">
                    <Button variant="outline" size="lg" className="rounded-full px-12 py-4 text-base font-medium border-gray-200 text-charcoal hover:bg-off-white">
                        Browse all rentals →
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default FeaturedListings;
