// app/api/profile/stats/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's reservation statistics
    const reservations = await prisma.reservation.findMany({
      where: {
        userId: session.user.id,
        paymentStatus: 'succeeded', // Only count successful reservations
      },
      select: {
        startDate: true,
        endDate: true,
        totalPrice: true,
      },
    });

    const now = new Date();
    const upcomingTrips = reservations.filter(
      (reservation) => new Date(reservation.startDate) > now
    ).length;

    const totalSpent = reservations.reduce(
      (sum, reservation) => sum + reservation.totalPrice,
      0
    );

    const stats = {
      totalReservations: reservations.length,
      upcomingTrips,
      totalSpent,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Profile stats error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}