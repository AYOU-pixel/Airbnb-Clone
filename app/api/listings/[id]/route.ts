// app/api/listings/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// في Next.js 15, المعامل الثاني يجب أن يكون Promise
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // تغيير مهم: params الآن Promise
) {
  try {
    // الآن نحتاج إلى await params
    const { id } = await params;
    
    console.log('🔵 Fetching listing with ID:', id);
    
    // Validate that ID is provided
    if (!id) {
      console.log('❌ No ID provided');
      return NextResponse.json(
        { error: 'Listing ID is required' },
        { status: 400 }
      );
    }

    // Validate MongoDB ObjectId format (24 character hex string)
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      console.log('❌ Invalid ID format:', id);
      return NextResponse.json(
        { error: 'Invalid listing ID format' },
        { status: 400 }
      );
    }

    // Fetch the listing from database
    const listing = await prisma.listing.findUnique({
      where: {
        id: id,
      },
    });

    console.log('🔵 Database query result:', listing ? 'Found' : 'Not found');

    if (!listing) {
      console.log('❌ Listing not found in database');
      return NextResponse.json(
        { error: 'Listing not found' },
        { status: 404 }
      );
    }

    console.log('✅ Successfully found listing:', listing.title);
    
    // Process the listing data to ensure all required fields are present
    const processedListing = {
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
      maxGuests: listing.maxGuests,
      createdAt: listing.createdAt.toISOString()
    };
    
    return NextResponse.json(processedListing, { status: 200 });
  } catch (error) {
    console.error('❌ Fetch Single Listing Error:', error);
    
    // Handle Prisma-specific errors
    if (error instanceof Error) {
      if (error.message.includes('Invalid ObjectId')) {
        return NextResponse.json(
          { error: 'Invalid listing ID format' },
          { status: 400 }
        );
      }
    }
    
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