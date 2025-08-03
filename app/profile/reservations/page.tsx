// app/profile/reservations/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import { CalendarDays, MapPin, Users, CreditCard } from "lucide-react";

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

export default function ReservationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/signin");
      return;
    }

    const fetchReservations = async () => {
      try {
        const response = await fetch("/api/reservations");
        if (!response.ok) {
          throw new Error("Failed to fetch reservations");
        }
        const data = await response.json();
        setReservations(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reservations");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [status, session, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "succeeded":
        return "text-green-600 bg-green-50";
      case "pending":
        return "text-yellow-600 bg-yellow-50";
      case "failed":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "succeeded":
        return "Confirmed";
      case "pending":
        return "Pending";
      case "failed":
        return "Failed";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your reservations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-2xl font-bold text-red-600 mb-4">{error}</h1>
          <Button onClick={() => router.push("/")} className="mt-4">
            Browse Listings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Reservations</h1>
        <p className="text-gray-600">
          Manage your bookings and view reservation details
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <CalendarDays className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No reservations yet
          </h2>
          <p className="text-gray-600 mb-6">
            Start exploring amazing places to stay
          </p>
          <Button 
            onClick={() => router.push("/")}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium px-8 py-3 hover:from-rose-600 hover:to-pink-600"
          >
            Browse Listings
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {reservations.map((reservation) => (
            <Card key={reservation.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="md:flex">
                  <div className="md:w-1/3">
                    <div className="h-48 md:h-full bg-gray-200 border-2 border-dashed rounded-l-lg flex items-center justify-center">
                      <span className="text-gray-500">Property Image</span>
                    </div>
                  </div>
                  
                  <div className="md:w-2/3 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {reservation.listing.title}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span className="text-sm">{reservation.listing.location}</span>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(reservation.paymentStatus)}`}>
                        {getStatusText(reservation.paymentStatus)}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Check-in</p>
                          <p className="text-sm font-medium">
                            {formatDate(reservation.startDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <CalendarDays className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Check-out</p>
                          <p className="text-sm font-medium">
                            {formatDate(reservation.endDate)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Guests</p>
                          <p className="text-sm font-medium">
                            {reservation.guestCount} guest{reservation.guestCount > 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                    </div>

                    <Separator className="my-4" />

                    <div className="flex justify-between items-center">
                      <div className="flex items-center text-gray-600">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <div>
                          <p className="text-sm text-gray-500">Total paid</p>
                          <p className="text-lg font-semibold text-gray-900">
                            ${reservation.totalPrice.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/listings/${reservation.listing.id}`)}
                        >
                          View Property
                        </Button>
                        
                        {reservation.paymentStatus === "succeeded" && (
                          <Button
                            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600"
                          >
                            Contact Host
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-3 text-xs text-gray-500">
                      Booked on {formatDate(reservation.createdAt)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}