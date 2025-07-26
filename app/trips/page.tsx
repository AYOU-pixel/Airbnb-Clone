// trips/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";

interface Reservation {
  id: string;
  startDate: string;
  endDate: string;
  guestCount: number;
  totalPrice: number;
  createdAt: string;
  listing: {
    id: string;
    title: string;
    price: number;
  };
}

export default function TripsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    fetchReservations();
  }, [session, status, router]);

  const fetchReservations = async () => {
    try {
      const response = await fetch("/api/reservations");
      if (response.ok) {
        const data = await response.json();
        setReservations(data);
      } else {
        console.error("Failed to fetch reservations");
      }
    } catch (error) {
      console.error("Error fetching reservations:", error);
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
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your trips</h1>
        <p className="text-gray-600 mt-2">
          Where you&apos;ve been and where you&apos;re going
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">
            No trips booked...yet!
          </div>
          <p className="text-gray-400 mb-8">
            Time to dust off your bags and start planning your next adventure
          </p>
          <Button
            onClick={() => router.push("/")}
            className="bg-black text-white hover:bg-gray-800 px-6 py-3"
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
                  <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                    <div className="w-full h-48 bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center text-white text-lg font-medium">
                      {reservation.listing.title}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {reservation.listing.title}
                    </h3>
                    
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