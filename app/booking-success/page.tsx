// app/booking-success/page.tsx
"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { useSession } from "next-auth/react";
import { CheckCircle, Calendar, MapPin, Users, CreditCard } from "lucide-react";

interface ReservationDetails {
  id: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  totalPrice: number;
  paymentStatus: string;
  listing: {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
  };
}

export default function BookingSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);
  const [reservation, setReservation] = useState<ReservationDetails | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setError("Invalid booking session");
      setLoading(false);
      return;
    }

    // Verify the payment and get reservation details
    const verifyPayment = async () => {
      try {
        console.log('Starting payment verification for session:', sessionId);
        
        // Wait longer for webhook to process
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        const response = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });

        console.log('Verify payment response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Payment verification failed:', errorData);
          throw new Error(errorData.error || 'Failed to verify payment');
        }

        const data = await response.json();
        console.log('Payment verification successful:', data);
        setReservation(data.reservation);
      } catch (err) {
        console.error('Payment verification error:', err);
        setError(err instanceof Error ? err.message : "Failed to verify booking");
        
        // Try to redirect to trips page after a delay if verification fails
        setTimeout(() => {
          router.push("/trips");
        }, 5000);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [status, session, router, searchParams]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateNights = () => {
    if (!reservation) return 0;
    const start = new Date(reservation.startDate);
    const end = new Date(reservation.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <div className="text-lg">Confirming your booking...</div>
          <div className="text-sm text-gray-500 mt-2">This may take a few moments</div>
        </div>
      </div>
    );
  }

  if (error || !reservation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-yellow-500 text-2xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Booking Verification In Progress
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "Your payment was successful, but we're still processing your booking. You'll be redirected to your trips page shortly."}
          </p>
          <div className="space-y-3">
            <Button onClick={() => router.push("/trips")} className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600">
              View My Trips
            </Button>
            <Button onClick={() => router.push("/")} variant="outline" className="w-full">
              Browse Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const nights = calculateNights();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Confirmed!
          </h1>
          <p className="text-gray-600 text-lg">
            Your reservation has been successfully completed
          </p>
        </div>

        {/* Booking Details */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  {reservation.listing.title}
                </h2>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-1" />
                  <span>{reservation.listing.location}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Booking ID</div>
                <div className="font-mono text-sm">{reservation.id.slice(-8).toUpperCase()}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-rose-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Check-in</p>
                  <p className="font-medium">{formatDate(reservation.startDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-rose-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Check-out</p>
                  <p className="font-medium">{formatDate(reservation.endDate)}</p>
                </div>
              </div>
              
              <div className="flex items-center">
                <Users className="w-8 h-8 text-rose-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Guests</p>
                  <p className="font-medium">
                    {reservation.guestCount} guest{reservation.guestCount > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center">
                <CreditCard className="w-8 h-8 text-rose-500 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Total Paid</p>
                  <p className="font-medium text-lg">${reservation.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-700 font-medium">Payment Successful</span>
              </div>
              <p className="text-green-600 text-sm mt-1">
                Your booking for {nights} night{nights > 1 ? 's' : ''} has been confirmed and paid.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">What&apos;s next?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-rose-500 font-semibold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Confirmation Email</h4>
                  <p className="text-gray-600 text-sm">
                    You&apos;ll receive a confirmation email with all booking details shortly.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-rose-500 font-semibold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Host Contact</h4>
                  <p className="text-gray-600 text-sm">
                    Your host will contact you with check-in instructions.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3 mt-1">
                  <span className="text-rose-500 font-semibold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Manage Your Trip</h4>
                  <p className="text-gray-600 text-sm">
                    View and manage your booking in your trips section.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={() => router.push("/trips")}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium px-8 py-3 hover:from-rose-600 hover:to-pink-600"
          >
            View My Trips
          </Button>
          
          <Button
            onClick={() => router.push("/")}
            variant="outline"
            className="px-8 py-3"
          >
            Browse More Listings
          </Button>
          
          <Button
            onClick={() => router.push(`/listings/${reservation.listing.id}`)}
            variant="outline"
            className="px-8 py-3"
          >
            View Property Details
          </Button>
        </div>
      </div>
    </div>
  );
}