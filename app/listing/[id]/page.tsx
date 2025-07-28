// app/listing/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ListingHeader from "@/app/components/ListingHeader"; // Fixed import path
import ListingContent from "@/app/components/ListingContent"; // Fixed import path
import BookingCard from "@/app/components/BookingCard"; // Fixed import path
import ReviewsSummary from "@/app/components/ReviewsSummary"; // Fixed import path

// Define the Listing interface to match the database schema
interface Listing {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: number;
  rating: number;
  distance?: string;
  dateRange?: string;
  isNew?: boolean;
  guestFavorite?: boolean;
  bedrooms: number;
  bathrooms: number; // Changed from Float to number for consistency
  description: string;
  amenities: string[];
  reviews: number;
  host: string;
  maxGuests: number; // This matches the database schema
  createdAt: string;
}

export default function ListingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [listing, setListing] = useState<Listing | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Booking state
  const [checkInDate, setCheckInDate] = useState<Date | undefined>();
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>();
  const [guestCount, setGuestCount] = useState(1);

  useEffect(() => {
    async function fetchListing() {
      if (!id) {
        setError('No listing ID provided');
        setIsLoading(false);
        return;
      }

      try {
        console.log('🔵 Fetching listing details for ID:', id);
        
        const res = await fetch(`/api/listings/${id}`, {
          cache: 'no-store',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('🔵 Response status:', res.status);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Unknown error' }));
          console.error('❌ API Error:', res.status, errorData);
          
          if (res.status === 404) {
            setError('Listing not found');
          } else if (res.status === 400) {
            setError('Invalid listing ID');
          } else {
            setError('Failed to load listing details');
          }
          setIsLoading(false);
          return;
        }

        const data: Listing = await res.json();
        console.log('✅ Successfully fetched listing:', data.title);
        console.log('Listing data:', data); // Debug log
        
        // Ensure default values for missing fields
        const processedListing: Listing = {
          ...data,
          rating: data.rating || 4.5,
          reviews: data.reviews || 0,
          distance: data.distance || '',
          dateRange: data.dateRange || '',
          isNew: data.isNew || false,
          guestFavorite: data.guestFavorite || false,
          amenities: data.amenities || [],
          createdAt: data.createdAt || new Date().toISOString()
        };
        
        setListing(processedListing);
      } catch (err) {
        console.error('❌ Fetch listing error:', err);
        setError('Network error occurred');
      } finally {
        setIsLoading(false);
      }
    }

    fetchListing();
  }, [id]);

  const handleBack = () => {
    router.back();
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            {/* Header skeleton */}
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            
            {/* Image gallery skeleton */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 mb-8">
              <div className="col-span-2 row-span-2 bg-gray-200 rounded-2xl"></div>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg"></div>
              ))}
            </div>
            
            {/* Content skeleton */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 space-y-6">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-gray-200 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !listing) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">😞</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || 'Listing not found'}
          </h1>
          <p className="text-gray-600 mb-6">
            The listing you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <div className="space-x-4">
            <button
              onClick={handleBack}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
            >
              Browse Listings
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ListingHeader
        title={listing.title}
        rating={listing.rating}
        reviews={listing.reviews}
        location={listing.location}
        listingId={listing.id}
        onBack={handleBack}
      />

      <div className="container mx-auto px-4 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <ListingContent
            images={listing.images}
            title={listing.title}
            host={listing.host}
            bedrooms={listing.bedrooms}
            bathrooms={listing.bathrooms}
            guests={listing.maxGuests}
            description={listing.description}
            amenities={listing.amenities}
            location={listing.location}
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onCheckInSelect={setCheckInDate}
            onCheckOutSelect={setCheckOutDate}
          />

          <div className="space-y-6">
            <div className="sticky top-24">
              <BookingCard
                listingId={listing.id}
                price={listing.price}
                maxGuests={listing.maxGuests}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                guestCount={guestCount}
                onCheckInSelect={setCheckInDate}
                onCheckOutSelect={setCheckOutDate}
                onGuestChange={setGuestCount}
              />
            </div>
          </div>
        </div>

        <ReviewsSummary
          rating={listing.rating}
          reviews={listing.reviews}
        />
      </div>
    </div>
  );
}



