// app/api/verify-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/authOptions';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { sessionId } = body;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
    }

    console.log('Verifying payment for session:', sessionId);

    // Retrieve the Stripe session with expanded payment intent
    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent']
    });
    
    console.log('Stripe session retrieved:', {
      id: stripeSession.id,
      payment_status: stripeSession.payment_status,
      metadata: stripeSession.metadata
    });

    if (!stripeSession.payment_intent) {
      return NextResponse.json({ error: 'Payment intent not found' }, { status: 400 });
    }

    let reservation = null;

    // Strategy 1: Find by payment intent ID
    try {
      reservation = await prisma.reservation.findFirst({
        where: {
          paymentIntentId: stripeSession.payment_intent.toString(),
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
      });
      
      if (reservation) {
        console.log('Found reservation by payment intent:', reservation.id);
      }
    } catch (error) {
      console.error('Error finding reservation by payment intent:', error);
    }

    // Strategy 2: Find by metadata if not found by payment intent
    if (!reservation && stripeSession.metadata) {
      console.log('Searching by metadata:', stripeSession.metadata);
      
      try {
        // If reservationId is in metadata, try that first
        if (stripeSession.metadata.reservationId) {
          reservation = await prisma.reservation.findFirst({
            where: {
              id: stripeSession.metadata.reservationId,
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
          });
          
          if (reservation) {
            console.log('Found reservation by reservationId:', reservation.id);
            
            // Update with payment details if not already updated
            if (!reservation.paymentIntentId || reservation.paymentStatus !== 'succeeded') {
              reservation = await prisma.reservation.update({
                where: { id: reservation.id },
                data: {
                  paymentIntentId: stripeSession.payment_intent.toString(),
                  paymentStatus: 'succeeded',
                  totalPrice: (stripeSession.amount_total || 0) / 100,
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
              console.log('Updated reservation with payment details');
            }
          }
        }
        
        // If still not found, search by booking details
        if (!reservation) {
          reservation = await prisma.reservation.findFirst({
            where: {
              userId: session.user.id,
              listingId: stripeSession.metadata.listingId,
              startDate: new Date(stripeSession.metadata.checkInDate),
              endDate: new Date(stripeSession.metadata.checkOutDate),
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

          if (reservation) {
            console.log('Found reservation by booking details:', reservation.id);
            
            // Update with payment details
            reservation = await prisma.reservation.update({
              where: { id: reservation.id },
              data: {
                paymentIntentId: stripeSession.payment_intent.toString(),
                paymentStatus: 'succeeded',
                totalPrice: (stripeSession.amount_total || 0) / 100,
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
            console.log('Updated reservation with payment details');
          }
        }
      } catch (error) {
        console.error('Error finding/updating reservation by metadata:', error);
      }
    }

    // Strategy 3: Create new reservation if still not found and metadata exists
    if (!reservation && stripeSession.metadata && stripeSession.payment_status === 'paid') {
      console.log('Creating new reservation from Stripe session');
      
      try {
        reservation = await prisma.reservation.create({
          data: {
            userId: stripeSession.metadata.userId || session.user.id,
            listingId: stripeSession.metadata.listingId,
            startDate: new Date(stripeSession.metadata.checkInDate),
            endDate: new Date(stripeSession.metadata.checkOutDate),
            guestCount: parseInt(stripeSession.metadata.guestCount || '1'),
            totalPrice: (stripeSession.amount_total || 0) / 100,
            paymentIntentId: stripeSession.payment_intent.toString(),
            paymentStatus: 'succeeded',
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
        
        console.log('Created new reservation:', reservation.id);
      } catch (error) {
        console.error('Error creating new reservation:', error);
      }
    }

    if (!reservation) {
      console.error('No reservation found or created for session:', sessionId);
      return NextResponse.json({ 
        error: 'Reservation not found or created',
        debug: {
          sessionId,
          paymentStatus: stripeSession.payment_status,
          hasMetadata: !!stripeSession.metadata,
          metadata: stripeSession.metadata
        }
      }, { status: 404 });
    }

    console.log('Returning reservation:', reservation.id);
    return NextResponse.json({ reservation });
    
  } catch (error) {
    console.error('Payment verification error:', error);
    return NextResponse.json(
      { 
        error: 'Internal Server Error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }, 
      { status: 500 }
    );
  }
}