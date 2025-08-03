"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { useSession } from "next-auth/react";
import { loadStripe } from "@stripe/stripe-js";

// Stripe initialization
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [listing, setListing] = useState<any>(null);
  const [reservationDetails, setReservationDetails] = useState({
    listingId: "",
    checkInDate: new Date(),
    checkOutDate: new Date(),
    guestCount: 1,
    totalPrice: 0,
    nights: 0,
  });

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    // Extract parameters from URL
    const listingId = searchParams.get('listingId') || '';
    const checkInDate = searchParams.get('checkInDate');
    const checkOutDate = searchParams.get('checkOutDate');
    const guestCount = searchParams.get('guestCount');
    const totalPrice = searchParams.get('totalPrice');

    if (!listingId || !checkInDate || !checkOutDate || !guestCount || !totalPrice) {
      setError("Invalid booking parameters");
      setLoading(false);
      return;
    }

    // Calculate nights
    const startDate = new Date(checkInDate);
    const endDate = new Date(checkOutDate);
    const nights = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    setReservationDetails({
      listingId,
      checkInDate: startDate,
      checkOutDate: endDate,
      guestCount: parseInt(guestCount),
      totalPrice: parseFloat(totalPrice),
      nights
    });

    // Fetch listing details
    const fetchListing = async () => {
      try {
        const res = await fetch(`/api/listings/${listingId}`);
        if (!res.ok) throw new Error("Failed to fetch listing");
        
        const data = await res.json();
        setListing(data);
      } catch (err) {
        setError("Failed to load listing details");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [status, session, router, searchParams]);

  const handlePayment = async () => {
    setProcessing(true);
    setError("");

    try {
      // 1. Create the reservation in the database first
      const reservationResponse = await fetch('/api/reservations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId: reservationDetails.listingId,
          startDate: reservationDetails.checkInDate.toISOString(),
          endDate: reservationDetails.checkOutDate.toISOString(),
          guestCount: reservationDetails.guestCount,
          totalPrice: reservationDetails.totalPrice,
          paymentStatus: 'pending' // Mark as pending until payment is confirmed
        })
      });

      if (!reservationResponse.ok) {
        const errorData = await reservationResponse.json();
        throw new Error(errorData.error || 'Failed to create reservation.');
      }

      const reservationData = await reservationResponse.json();
      const reservationId = reservationData.id;

      if (!reservationId) {
        throw new Error('Could not retrieve reservation ID.');
      }

      // 2. Create the Stripe Checkout session with the reservation ID in metadata
      const paymentResponse = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: reservationDetails.totalPrice * 100, // Amount in cents
          metadata: {
            userId: session?.user?.id,
            listingId: reservationDetails.listingId,
            checkInDate: reservationDetails.checkInDate.toISOString(),
            checkOutDate: reservationDetails.checkOutDate.toISOString(),
            guestCount: reservationDetails.guestCount,
            reservationId: reservationId // Attach the new reservation ID
          }
        })
      });

      if (!paymentResponse.ok) {
        const errorData = await paymentResponse.json();
        throw new Error(errorData.error || "Failed to create payment session.");
      }

      const { sessionId } = await paymentResponse.json();

      // 3. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe.js has not loaded yet.");
      }

      const result = await stripe.redirectToCheckout({
        sessionId: sessionId
      });

      if (result.error) {
        throw new Error(result.error.message || "Redirect to payment failed.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
      console.error(err);
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your booking details...</div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error || "Listing not found"}
          </h1>
          <Button onClick={() => router.push("/")} className="mt-4">
            Browse Listings
          </Button>
        </div>
      </div>
    );
  }

  const cleaningFee = 75;
  const serviceFee = 83;
  const subtotal = listing.price * reservationDetails.nights;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Complete Your Booking</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Your Trip</h2>
              
              <div className="flex items-center mb-4">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                <div className="ml-4">
                  <h3 className="font-medium">{listing.title}</h3>
                  <p className="text-sm text-gray-600">{listing.location}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p>{reservationDetails.checkInDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p>{reservationDetails.checkOutDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p>{reservationDetails.guestCount} guest{reservationDetails.guestCount > 1 ? 's' : ''}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nights</p>
                  <p>{reservationDetails.nights}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Price Details</h2>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>${listing.price.toFixed(2)} × {reservationDetails.nights} nights</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cleaning fee</span>
                  <span>${cleaningFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                
                <Separator className="my-2" />
                
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${reservationDetails.totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-6">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-6 mr-3" />
                  <span>Credit or Debit Card</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Your payment is secured with bank-level encryption
                </p>
              </div>
              
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <Button
                onClick={handlePayment}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium py-3 text-base hover:from-rose-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={processing}
              >
                {processing ? "Processing Payment..." : "Pay and Confirm Booking"}
              </Button>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                You won&apos;t be charged until your booking is confirmed
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading checkout...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}