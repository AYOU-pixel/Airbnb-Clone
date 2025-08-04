// app/search/page.tsx
"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, Grid, List, MapPin, Star, Heart } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Card, CardContent } from "@/app/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Slider } from "@/app/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/components/ui/sheet";
import Link from "next/link";
import { CldImage } from 'next-cloudinary';

interface Listing {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: number;
  rating: number;
  distance: string;
  dateRange: string;
  isNew: boolean;
  guestFavorite: boolean;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  reviews: number;
  host: string;
  maxGuests: number;
  createdAt: string;
  availabilityInfo?: {
    isAvailable: boolean | null;
    searchedDates: { checkIn: string; checkOut: string } | null;
  };
}

interface SearchStats {
  total: number;
  filters: {
    destination: string | null;
    dateRange: { checkIn: string; checkOut: string } | null;
    guests: number | null;
    priceRange: { min: number; max: number } | null;
    bedrooms: number | null;
    bathrooms: number | null;
    amenities: string[] | null;
  };
  sortBy: string;
}

interface SearchResponse {
  listings: Listing[];
  stats: SearchStats;
  success: boolean;
}

function SearchResultsContent() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [stats, setStats] = useState<SearchStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // استخراج معاملات البحث
  const destination = searchParams.get('destination') || '';

  // قائمة الخدمات المتاحة للفلترة
  const availableAmenities = [
    'WiFi', 'Kitchenette', 'Beach Access', 'Free Parking', 'Full Kitchen',
    'Air Conditioning', 'City View', 'Hot Tub', 'Fireplace', 'Mountain View',
    'Pet-friendly', 'Rooftop Pool', 'Gym', 'Parking', 'Concierge',
    'Lake Access', 'Fire Pit', 'Boat Dock', 'BBQ Grill', 'Vineyard Views',
    'Wine Tasting nearby', 'Private Patio', 'Large Garden', 'Kid-friendly',
    'Washing Machine', 'Workspace', 'Near Galleries', 'Stargazing Deck',
    'Hiking Trails nearby', 'Ski-in/Ski-out', 'Heated Pool', 'Private Balcony',
    'Garden', 'Farm Animals', 'Outdoor Shower', 'Surfboard Storage',
    'Historic Charm', 'Near Public Transport', 'Private Beach', 'Snorkeling Gear',
    'Chef Services', 'Boat Tours', 'Spa Services'
  ];

  // جلب نتائج البحث
  useEffect(() => {
    const fetchSearchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams(searchParams.toString());
        
        // إضافة فلاتر إضافية
        if (sortBy !== 'relevance') {
          params.set('sortBy', sortBy);
        }
        
        if (priceRange[0] > 0) {
          params.set('minPrice', priceRange[0].toString());
        }
        
        if (priceRange[1] < 2000) {
          params.set('maxPrice', priceRange[1].toString());
        }
        
        if (selectedAmenities.length > 0) {
          params.set('amenities', selectedAmenities.join(','));
        }

        const response = await fetch(`/api/search?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Search failed: ${response.status}`);
        }

        const data: SearchResponse = await response.json();
        
        setListings(data.listings);
        setStats(data.stats);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed');
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchParams, sortBy, priceRange, selectedAmenities]);

  // مكون البطاقة للقائمة
  const ListingCard = ({ listing }: { listing: Listing }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className={viewMode === 'grid' ? '' : 'flex'}>
          {/* الصور */}
          <div className={`relative ${viewMode === 'grid' ? 'h-64' : 'w-80 h-48 flex-shrink-0'}`}>
            {listing.images && listing.images.length > 0 ? (
              <CldImage
                src={listing.images[0]}
                alt={listing.title}
                width={viewMode === 'grid' ? 400 : 320}
                height={viewMode === 'grid' ? 400 : 320}
                crop="fill"
                quality="auto"
                loading="lazy"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-gray-400" />
              </div>
            )}
            
            {/* شارات */}
            <div className="absolute top-2 left-2 flex gap-2">
              {listing.isNew && (
                <Badge className="bg-rose-500 text-white">New</Badge>
              )}
              {listing.guestFavorite && (
                <Badge className="bg-amber-500 text-white">Guest favorite</Badge>
              )}
            </div>
            
            {/* أيقونة القلب */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            >
              <Heart className="w-4 h-4" />
            </Button>
          </div>

          {/* المحتوى */}
          <CardContent className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg truncate">{listing.title}</h3>
              <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                <Star className="w-4 h-4 fill-current text-yellow-500" />
                <span className="text-sm font-medium">{listing.rating}</span>
                <span className="text-sm text-gray-500">({listing.reviews})</span>
              </div>
            </div>
            
            <p className="text-gray-600 text-sm mb-2 truncate">{listing.location}</p>
            
            {listing.distance && (
              <p className="text-gray-500 text-sm mb-2">{listing.distance}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
              <span>{listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''}</span>
              <span>{listing.bathrooms} bathroom{listing.bathrooms > 1 ? 's' : ''}</span>
              <span>Up to {listing.maxGuests} guests</span>
            </div>
            
            {/* الخدمات */}
            {listing.amenities && listing.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {listing.amenities.slice(0, 3).map((amenity) => (
                  <Badge key={amenity} variant="secondary" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {listing.amenities.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{listing.amenities.length - 3} more
                  </Badge>
                )}
              </div>
            )}
            
            <div className="flex justify-between items-end mt-auto">
              <div>
                <span className="text-xl font-bold">${listing.price}</span>
                <span className="text-gray-600"> night</span>
              </div>
              <Link href={`/listing/${listing.id}`}>
                <Button size="sm">View Details</Button>
              </Link>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Searching for amazing places...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* رأس النتائج */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {destination ? `Places in ${destination}` : 'Search Results'}
        </h1>
        
        {stats && (
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
            <span>{stats.total} places found</span>
            {stats.filters.dateRange && (
              <span>• {new Date(stats.filters.dateRange.checkIn).toLocaleDateString()} - {new Date(stats.filters.dateRange.checkOut).toLocaleDateString()}</span>
            )}
            {stats.filters.guests && (
              <span>• {stats.filters.guests} guest{stats.filters.guests > 1 ? 's' : ''}</span>
            )}
          </div>
        )}

        {/* أشرطة التحكم */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* فلاتر */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filter Results</SheetTitle>
                  <SheetDescription>
                    Narrow down your search results
                  </SheetDescription>
                </SheetHeader>
                
                <div className="space-y-6 mt-6">
                  {/* نطاق السعر */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Price Range: ${priceRange[0]} - ${priceRange[1] === 2000 ? '2000+' : priceRange[1]}
                    </label>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={2000}
                      min={0}
                      step={50}
                      className="w-full"
                    />
                  </div>
                  
                  {/* الخدمات */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Amenities</label>
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                      {availableAmenities.map((amenity) => (
                        <label key={amenity} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={selectedAmenities.includes(amenity)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedAmenities([...selectedAmenities, amenity]);
                              } else {
                                setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                              }
                            }}
                            className="rounded border-gray-300 text-rose-500 focus:ring-rose-500"
                          />
                          <span className="text-sm">{amenity}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>

            {/* الترتيب */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Most Relevant</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="reviews">Most Reviews</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* وضع العرض */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="icon"
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* النتائج */}
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No places found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
        }>
          <AnimatePresence>
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading search...</p>
        </div>
      </div>
    }>
      <SearchResultsContent />
    </Suspense>
  );
}