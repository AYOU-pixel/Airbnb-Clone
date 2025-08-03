// app/trips/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Calendar, MapPin, CheckCircle, AlertTriangle } from "lucide-react";
import { CldImage } from "next-cloudinary";
interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  totalPrice: number;
  paymentStatus: string;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    location: string;
    price: number;
    images: string[];
  };
}

export default function TripsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    console.log('=== Trips Page Debug ===');
    console.log('Session status:', status);
    console.log('Session data:', session);
    
    if (status === "loading") {
      console.log('Session still loading...');
      return;
    }

    if (!session) {
      console.log('No session, redirecting to signin');
      router.push("/signin");
      return;
    }

    console.log('User ID:', session.user?.id);
    console.log('User Email:', session.user?.email);
    
    fetchReservations();
  }, [session, status, router]);

  const fetchReservations = async () => {
    try {
      console.log('=== Fetching Reservations ===');
      setLoading(true);
      setError("");

      const url = '/api/reservations';
      console.log('Fetching from URL:', url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: 'include', // Important for session cookies
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response not OK. Status:', response.status);
        console.error('Error text:', errorText);
        
        // Try to parse as JSON, fallback to text
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.error || `HTTP ${response.status}`);
        } catch {
          throw new Error(`HTTP ${response.status}: ${errorText}`);
        }
      }

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Try to parse JSON
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed data:', data);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('Response was:', responseText);
        throw new Error('Invalid JSON response from server');
      }

      if (Array.isArray(data)) {
        console.log('Received reservations:', data.length);
        setReservations(data);
        setDebugInfo({
          count: data.length,
          statuses: data.map(r => r.paymentStatus),
          ids: data.map(r => r.id)
        });
      } else {
        console.error('Data is not an array:', data);
        setError('Invalid data format received');
      }

    } catch (error) {
      console.error('=== Fetch Error ===');
      console.error('Error:', error);
      console.error('Error type:', typeof error);
      console.error('Error message:', error instanceof Error ? error.message : String(error));
      
      setError(error instanceof Error ? error.message : "Failed to load trips");
      setDebugInfo({ error: String(error) });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const calculateNights = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <div className="text-lg">Loading your trips...</div>
          <div className="text-sm text-gray-500 mt-2">
            Status: {status}, Loading: {loading.toString()}
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Error Loading Trips
          </h1>
          <p className="text-gray-600 mb-6">{error}</p>
          
          {/* Debug Information */}
          <div className="bg-gray-100 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold mb-2">Debug Information:</h3>
            <div className="text-sm text-gray-700 space-y-1">
              <div>Session Status: {status}</div>
              <div>User ID: {session?.user?.id}</div>
              <div>User Email: {session?.user?.email}</div>
              {debugInfo && (
                <div>Debug Info: {JSON.stringify(debugInfo, null, 2)}</div>
              )}
            </div>
          </div>
          
          <div className="space-y-3">
            <Button onClick={fetchReservations} variant="outline">
              Try Again
            </Button>
            <Button onClick={() => router.push("/")} className="w-full">
              Browse Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Trips</h1>
        <p className="text-gray-600 mt-2">
          Where you&apos;ve been and where you&apos;re going
        </p>
        
        {/* Debug Info for Development */}
        {process.env.NODE_ENV === 'development' && debugInfo && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
            <strong>Debug:</strong> Found {debugInfo.count} reservations
            {debugInfo.statuses && (
              <div>Payment statuses: {debugInfo.statuses.join(', ')}</div>
            )}
          </div>
        )}
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Calendar className="w-12 h-12 text-gray-400" />
          </div>
          <div className="text-gray-500 text-xl mb-4 font-medium">
            No trips booked...yet!
          </div>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Time to dust off your bags and start planning your next adventure
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium px-8 py-3 hover:from-rose-600 hover:to-pink-600"
          >
            Start searching
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservations.map((reservation) => {
            const nights = calculateNights(reservation.startDate, reservation.endDate);
            
            return (
              <Card key={reservation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200 relative">
                    
{reservation.listing.images?.[0] ? (
  <div className="relative w-full h-48 overflow-hidden">
    <CldImage
      src={reservation.listing.images[0]}
      alt={reservation.listing.title}
      width={600}
      height={400}
      crop="fill"
      className="object-cover w-full h-full"
      quality="auto"
      loading="lazy"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
  </div>
) : (
  <div className="w-full h-48 bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-lg font-medium">
    {reservation.listing.title}
  </div>
)}
                    <div className="absolute top-3 right-3">
                      <div className="flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Confirmed
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {reservation.listing.title}
                    </h3>
                    
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{reservation.listing.location}</span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Check-in:</span>
                        <span>{formatDate(reservation.startDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Check-out:</span>
                        <span>{formatDate(reservation.endDate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Guests:</span>
                        <span>{reservation.guestCount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Nights:</span>
                        <span>{nights}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total paid:</span>
                        <span className="text-lg font-semibold text-gray-900">
                          ${reservation.totalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 text-xs text-gray-500">
                      Booked on {formatDate(reservation.createdAt)}
                    </div>

                    <div className="mt-4 flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/listings/${reservation.listing.id}`)}
                        className="flex-1"
                      >
                        View Property
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
                      >
                        Contact Host
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}