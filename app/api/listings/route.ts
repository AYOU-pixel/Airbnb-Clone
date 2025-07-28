// app/api/listings/route.ts (تأكد من المسار الصحيح)
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    console.log('🔵 Fetching all listings...');
    
    const listings = await prisma.listing.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('🔵 Found listings:', listings.length);

    if (listings.length === 0) {
      console.log('⚠️ No listings found in database');
      return NextResponse.json([], { status: 200 });
    }

    // Process listings to ensure all required fields are present
    const processedListings = listings.map(listing => ({
      id: listing.id,
      title: listing.title,
      location: listing.location,
      images: listing.images || [],
      price: listing.price,
      rating: listing.rating || 4.5,
      distance: listing.distance || '',
      dateRange: listing.dateRange || '',
      isNew: listing.isNew || false,
      guestFavorite: listing.guestFavorite || false,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      description: listing.description,
      amenities: listing.amenities || [],
      reviews: listing.reviews || 0,
      host: listing.host,
      maxGuests: listing.maxGuests, // تأكد من أن هذا يطابق schema
      createdAt: listing.createdAt.toISOString()
    }));

    console.log('✅ Successfully processed listings');
    return NextResponse.json(processedListings, { status: 200 });
    
  } catch (error) {
    console.error('❌ Fetch Listings Error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: process.env.NODE_ENV === 'development' 
          ? (error instanceof Error ? error.message : 'Unknown error')
          : 'Something went wrong',
      },
      { status: 500 }
    );
  }
}