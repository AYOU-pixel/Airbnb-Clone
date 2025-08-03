// app/api/reservations/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

/**
 * GET - Fetch all reservations for the authenticated user
 */
export async function GET() {
  try {
    console.log('=== Reservations API GET Started ===');
    
    const session = await getServerSession(authOptions);
    console.log('Session:', session ? 'Found' : 'Not found');
    console.log('User ID:', session?.user?.id);

    if (!session?.user?.id) {
      console.log('Unauthorized - no session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching reservations for user:', session.user.id);

    // First, let's check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: session.user.id }
    });
    
    if (!user) {
      console.log('User not found in database');
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User found:', user.email);

    // Fetch ALL reservations for this user (remove paymentStatus filter temporarily)
    const allReservations = await prisma.reservation.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            price: true,
            images: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('All reservations found:', allReservations.length);
    console.log('Reservations details:', allReservations.map(r => ({
      id: r.id,
      paymentStatus: r.paymentStatus,
      listingTitle: r.listing?.title
    })));

    // Filter for successful payments
    const successfulReservations = allReservations.filter(r => r.paymentStatus === 'succeeded');
    console.log('Successful reservations:', successfulReservations.length);

    return NextResponse.json(successfulReservations);
  } catch (error) {
    console.error('=== Reservations API Error ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      {
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

/**
 * POST - Create a new reservation or fetch specific reservation
 */
export async function POST(req: NextRequest) {
  try {
    console.log('=== Reservations API POST Started ===');
    
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      console.log('POST Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('POST Request body:', body);
    
    // If reservationId is provided, fetch specific reservation
    if (body.reservationId) {
      const { reservationId } = body;

      const reservation = await prisma.reservation.findFirst({
        where: {
          id: reservationId,
          userId: session.user.id,
        },
        include: {
          listing: {
            select: {
              id: true,
              title: true,
              location: true,
              price: true,
              images: true,
              description: true,
              amenities: true,
              host: true,
              bedrooms: true,
              bathrooms: true,
            },
          },
        },
      });

      if (!reservation) {
        return NextResponse.json({ error: 'Reservation not found' }, { status: 404 });
      }

      return NextResponse.json(reservation);
    }

    // Create new reservation
    const { listingId, startDate, endDate, guestCount, totalPrice, paymentStatus } = body;

    if (!listingId || !startDate || !endDate || !guestCount || !totalPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if listing exists
    const listing = await prisma.listing.findUnique({
      where: { id: listingId }
    });

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    const reservation = await prisma.reservation.create({
      data: {
        listingId,
        userId: session.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        guestCount: parseInt(guestCount),
        totalPrice: parseFloat(totalPrice),
        paymentStatus: paymentStatus || 'pending'
      },
      include: {
        listing: {
          select: {
            id: true,
            title: true,
            location: true,
            price: true,
            images: true,
          },
        },
      },
    });

    console.log('Created reservation:', reservation.id);
    return NextResponse.json(reservation);
  } catch (error) {
    console.error('POST Reservation error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}



