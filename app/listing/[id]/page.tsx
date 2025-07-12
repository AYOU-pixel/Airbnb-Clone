'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { listings } from "@/lib/mockListings";
import { Listing } from "@/app/types/listing";
import ListingHeader from "@/app/components/Card_details/ListingHeader";
import ListingContent from "@/app/components/Card_details/ListingContent";
import BookingCard from "@/app/components/Card_details/BookingCard";
import ReviewsSummary from "@/app/components/Card_details/ReviewsSummary";

export default function ListingDetailPage() {
  const router = useRouter();
  const params = useParams();

  // State for dates
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [listing, setListing] = useState<Listing | null>(null);

  // Extract and validate listing ID
  const listingId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  // Find listing with proper loading state
  useEffect(() => {
    if (!listingId) {
      setIsLoading(false);
      return;
    }

    const foundListing = listings.find((item) => item.id === listingId);
    setListing(foundListing || null);
    setIsLoading(false);
  }, [listingId]);

  // Handle loading state
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  // Handle missing listing ID
  if (!listingId) {
    return <InvalidUrl onGoHome={() => router.push('/')} />;
  }

  // Handle listing not found
  if (!listing) {
    return <ListingNotFound onGoHome={() => router.push('/')} />;
  }

  // Handle date selection with validation
  const handleCheckInSelect = (date: Date | undefined) => {
    setCheckInDate(date);
    if (date && checkOutDate && date >= checkOutDate) {
      setCheckOutDate(undefined);
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    if (date && checkInDate && date > checkInDate) {
      setCheckOutDate(date);
    } else if (date && !checkInDate) {
      return;
    }
    setCheckOutDate(date);
  };

  return (
    <div className="min-h-screen bg-white">
      <ListingHeader
        title={listing.title}
        rating={listing.rating}
        reviews={listing.reviews}
        location={listing.location}
        listingId={listing.id}
        onBack={() => router.back()}
      />

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-2">
            <ListingContent
              images={listing.images}
              title={listing.title}
              host={listing.host}
              bedrooms={listing.bedrooms}
              bathrooms={listing.bathrooms}
              guests={listing.guests}
              description={listing.description}
              amenities={listing.amenities}
              location={listing.location}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              onCheckInSelect={handleCheckInSelect}
              onCheckOutSelect={handleCheckOutSelect}
            />
          </div>

          <div className="xl:col-span-1">
            <div className="sticky top-24 space-y-6">
              <BookingCard
                price={listing.price}
                maxGuests={listing.guests}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                onCheckInSelect={handleCheckInSelect}
                onCheckOutSelect={handleCheckOutSelect}
              />
              <ReviewsSummary
                rating={listing.rating}
                reviews={listing.reviews}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper components
function LoadingSkeleton() {
  return (
    <div className="container mx-auto py-12 text-center">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3 mx-auto"></div>
      </div>
    </div>
  );
}

function InvalidUrl({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-2xl font-bold text-red-600">Invalid URL</h1>
      <p className="mt-4 text-gray-500">No listing ID provided in the URL.</p>
      <button
        onClick={onGoHome}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Home
      </button>
    </div>
  );
}

function ListingNotFound({ onGoHome }: { onGoHome: () => void }) {
  return (
    <div className="container mx-auto py-12 text-center">
      <h1 className="text-2xl font-bold text-red-600">Listing not found</h1>
      <p className="mt-4 text-gray-500">
        The listing you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <button
        onClick={onGoHome}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Go Home
      </button>
    </div>
  );
}
