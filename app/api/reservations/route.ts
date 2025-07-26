// api/reservations/route.ts - Fixed with ObjectId validation
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// Function to validate MongoDB ObjectId
function isValidObjectId(id: string): boolean {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}

export async function POST(req: Request) {
  try {
    console.log('🔵 Starting reservation process...');
    
    const session = await getServerSession(authOptions);
    console.log('🔵 Session:', session);

    if (!session?.user?.id) {
      console.log('❌ No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('🔵 Request body:', body);
    
    const { listingId, startDate, endDate, guestCount, totalPrice } = body;

    // Enhanced validation
    if (!listingId || !startDate || !endDate || !totalPrice) {
      console.log('❌ Missing required fields');
      return NextResponse.json({ 
        error: 'Missing required fields',
        details: {
          listingId: !listingId ? 'Missing' : 'OK',
          startDate: !startDate ? 'Missing' : 'OK',
          endDate: !endDate ? 'Missing' : 'OK',
          totalPrice: !totalPrice ? 'Missing' : 'OK'
        }
      }, { status: 400 });
    }

    // Validate ObjectId format
    if (!isValidObjectId(listingId)) {
      console.log('❌ Invalid listingId format:', listingId);
      return NextResponse.json({ 
        error: 'Invalid listing ID format',
        details: `Provided ID "${listingId}" is not a valid MongoDB ObjectId. Expected 24 character hex string.`
      }, { status: 400 });
    }

    // Validate user ID format
    if (!isValidObjectId(session.user.id)) {
      console.log('❌ Invalid userId format:', session.user.id);
      return NextResponse.json({ 
        error: 'Invalid user session',
        details: 'User ID is not properly formatted'
      }, { status: 400 });
    }

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      console.log('❌ Invalid date format');
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
    }
    
    if (start >= end) {
      console.log('❌ Invalid dates - end date must be after start date');
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    if (start < new Date()) {
      console.log('❌ Start date cannot be in the past');
      return NextResponse.json({ error: 'Start date cannot be in the past' }, { status: 400 });
    }

    console.log('🔵 Checking if listing exists...');
    
    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      console.log('❌ Listing not found');
      return NextResponse.json({ 
        error: 'Listing not found',
        details: `Listing with ID "${listingId}" does not exist`
      }, { status: 404 });
    }

    console.log('✅ Listing found:', listing.title);

    // Validate guest count
    const guestCountNum = parseInt(guestCount?.toString()) || 1;
    if (guestCountNum < 1 || guestCountNum > listing.maxGuests) {
      console.log('❌ Invalid guest count');
      return NextResponse.json({ 
        error: `Guest count must be between 1 and ${listing.maxGuests}` 
      }, { status: 400 });
    }

    console.log('🔵 Checking for overlapping reservations...');
    
    // Check for overlapping reservations
    const overlappingReservation = await prisma.reservation.findFirst({
      where: {
        listingId,
        OR: [
          {
            startDate: {
              lt: end,
            },
            endDate: {
              gt: start,
            },
          },
        ],
      },
    });

    if (overlappingReservation) {
      console.log('❌ Dates already booked');
      return NextResponse.json({ 
        error: 'Property is already booked for those dates',
        conflictingReservation: {
          startDate: overlappingReservation.startDate,
          endDate: overlappingReservation.endDate
        }
      }, { status: 409 });
    }

    console.log('🔵 Creating reservation...');

    // Create reservation
    const reservation = await prisma.reservation.create({
      data: {
        listingId,
        userId: session.user.id,
        startDate: start,
        endDate: end,
        guestCount: guestCountNum,
        totalPrice: parseFloat(totalPrice.toString()),
      },
      include: {
        listing: {
          select: {
            title: true,
            price: true,
          },
        },
      },
    });

    console.log('✅ Reservation created successfully:', reservation.id);

    return NextResponse.json(reservation, { status: 201 });
  } catch (error) {
    console.error('❌ Reservation Error:', error);
    
    // More detailed error information
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        timestamp: new Date().toISOString()
      }, { status: 500 });
    }
    
    return NextResponse.json({ 
      error: 'Internal Server Error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    console.log('🔵 Fetching reservations...');
    
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('❌ Unauthorized GET request');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate user ID format
    if (!isValidObjectId(session.user.id)) {
      console.log('❌ Invalid userId format:', session.user.id);
      return NextResponse.json({ 
        error: 'Invalid user session',
        details: 'User ID is not properly formatted'
      }, { status: 400 });
    }

    console.log('🔵 Getting reservations for user:', session.user.id);

    const reservations = await prisma.reservation.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('✅ Found reservations:', reservations.length);

    return NextResponse.json(reservations);
  } catch (error) {
    console.error('❌ Fetch Reservations Error:', error);
    
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json({ 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, { status: 500 });
    }
    
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



