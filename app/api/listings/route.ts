// api/listings/[id]/route.ts - للحصول على listing واحد
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    console.log('🔵 Fetching listing with ID:', id);

    // Validate ObjectId format
    if (!isValidObjectId(id)) {
      console.log('❌ Invalid ObjectId format:', id);
      return NextResponse.json({ 
        error: 'Invalid listing ID format',
        details: `Provided ID "${id}" is not a valid MongoDB ObjectId. Expected 24 character hex string.`
      }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      console.log('❌ Listing not found:', id);
      return NextResponse.json({ 
        error: 'Listing not found',
        details: `Listing with ID "${id}" does not exist`
      }, { status: 404 });
    }

    console.log('✅ Listing found:', listing.title);

    return NextResponse.json(listing);
  } catch (error) {
    console.error('❌ Fetch Listing Error:', error);
    
    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}