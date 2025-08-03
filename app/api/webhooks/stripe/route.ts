// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = headers();
  const sig = (await headersList).get('stripe-signature');

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig!, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        console.log('Checkout session completed:', session.id);
        console.log('Session metadata:', session.metadata);
        
        // Extract metadata from the session
        const metadata = session.metadata;
        if (!metadata) {
          console.error('No metadata found in session');
          break;
        }

        const { userId, listingId, checkInDate, checkOutDate, guestCount, reservationId } = metadata;
        
        if (!userId || !listingId || !checkInDate || !checkOutDate || !guestCount) {
          console.error('Missing required metadata:', metadata);
          break;
        }

        try {
          // If reservationId exists in metadata, update existing reservation
          if (reservationId) {
            console.log('Updating existing reservation:', reservationId);
            
            const updatedReservation = await prisma.reservation.update({
              where: { id: reservationId },
              data: {
                paymentIntentId: session.payment_intent as string,
                paymentStatus: 'succeeded',
                totalPrice: (session.amount_total || 0) / 100, // Convert from cents
              },
            });

            console.log('Reservation updated successfully:', updatedReservation.id);
          } else {
            // Create new reservation if no reservationId
            console.log('Creating new reservation');
            
            const reservation = await prisma.reservation.create({
              data: {
                userId,
                listingId,
                startDate: new Date(checkInDate),
                endDate: new Date(checkOutDate),
                guestCount: parseInt(guestCount),
                totalPrice: (session.amount_total || 0) / 100, // Convert from cents
                paymentIntentId: session.payment_intent as string,
                paymentStatus: 'succeeded',
              },
            });

            console.log('New reservation created successfully:', reservation.id);
          }
        } catch (dbError) {
          console.error('Database error during reservation handling:', dbError);
          
          // Try to find and update existing reservation by other criteria
          try {
            const existingReservation = await prisma.reservation.findFirst({
              where: {
                userId,
                listingId,
                startDate: new Date(checkInDate),
                endDate: new Date(checkOutDate),
                paymentStatus: 'pending'
              }
            });

            if (existingReservation) {
              await prisma.reservation.update({
                where: { id: existingReservation.id },
                data: {
                  paymentIntentId: session.payment_intent as string,
                  paymentStatus: 'succeeded',
                  totalPrice: (session.amount_total || 0) / 100,
                },
              });
              console.log('Found and updated pending reservation:', existingReservation.id);
            }
          } catch (fallbackError) {
            console.error('Fallback reservation update failed:', fallbackError);
          }
        }
        
        break;
      }

      case 'checkout.session.expired':
      case 'payment_intent.payment_failed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Payment failed or session expired:', event.type, session.id);
        
        // Mark reservation as failed if it exists
        if (session.metadata?.reservationId) {
          try {
            await prisma.reservation.update({
              where: { id: session.metadata.reservationId },
              data: { paymentStatus: 'failed' },
            });
            console.log('Marked reservation as failed:', session.metadata.reservationId);
          } catch (error) {
            console.error('Failed to update reservation status:', error);
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}