// app/page.tsx (or HomePage.tsx)
'use client';

import { useState, useEffect } from 'react';
import ListingCard from '@/app/components/listing/ListingCard';

// Define the Listing interface to match the database schema
interface Listing {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: number; // Keep as number from database
  rating: number;
  distance: string;
  dateRange: string;
  isNew?: boolean;
  guestFavorite?: boolean;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  reviews: number;
  host: string;
  maxGuests: number; // Changed from guests to maxGuests to match schema
  createdAt: string;
}

export default function HomePage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchListings() {
      try {
        console.log('🔵 Fetching listings from API...');
        const res = await fetch('/api/listings', { 
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        console.log('🔵 Response status:', res.status);
        
        if (!res.ok) {
          console.error('❌ API Error:', res.status, res.statusText);
          if (res.status === 404) {
            setError('No listings found.');
          } else {
            setError('Failed to load listings.');
          }
          setIsLoading(false);
          return;
        }

        const data = await res.json();
        console.log('✅ Fetched listings:', data.length, 'items');
        console.log('Sample listing:', data[0]); // Log first listing for debugging
        
        setListings(data);
      } catch (err) {
        console.error('❌ Fetch listings error:', err);
        setError('Unexpected error occurred.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchListings();
  }, []);

  // Handle loading state
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  // Handle error state
  if (error) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <p className="text-gray-600 mb-6">
            We&apos;re having trouble loading the listings. Please try again.
          </p>
          <button
            onClick={() => {
              setError(null);
              setIsLoading(true);
              window.location.reload();
            }}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  // Handle empty listings
  if (listings.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">No listings available</h1>
          <p className="text-gray-600 mb-6">
            Check back later for new listings or try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
          >
            Refresh
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Explore amazing places
        </h1>
        <p className="text-gray-600">
          Discover unique homes and experiences around the world
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
        {listings.map((item) => {
          console.log('🔵 Rendering listing:', item.id, item.title); // Debug log
          return (
            <ListingCard
              key={item.id}
              id={item.id}
              title={item.title}
              location={item.location}
              images={item.images}
              price={item.price.toString()} // Convert number to string for ListingCard
              rating={item.rating}
              distance={item.distance}
              dateRange={item.dateRange}
              isNew={item.isNew}
              guestFavorite={item.guestFavorite}
            />
          );
        })}
      </div>
      
      <div className="mt-12 text-center">
        <p className="text-gray-500">
          Showing {listings.length} listings
        </p>
      </div>
    </main>
  );
}
