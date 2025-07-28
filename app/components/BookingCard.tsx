// BookingCard.tsx - Improved with better error handling and validation
"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import DatePickerSection from "./Card_details/DatePickerSection";
import GuestSelector from "./Card_details/GuestSelector";

interface BookingCardProps {
  listingId: string;
  price: number;
  maxGuests: number;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  guestCount: number;
  onCheckInSelect: (date: Date | undefined) => void;
  onCheckOutSelect: (date: Date | undefined) => void;
  onGuestChange: (count: number) => void;
}

export default function BookingCard({
  listingId,
  price,
  maxGuests,
  checkInDate,
  checkOutDate,
  guestCount,
  onCheckInSelect,
  onCheckOutSelect,
  onGuestChange,
}: BookingCardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const nights = checkInDate && checkOutDate
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const cleaningFee = 75;
  const serviceFee = 83;
  const subtotal = price * nights;
  const total = subtotal + cleaningFee + serviceFee;

  const validateInputs = () => {
    setError("");

    if (!checkInDate || !checkOutDate) {
      setError("Please select check-in and check-out dates");
      return false;
    }

    if (guestCount < 1) {
      setError("Please select at least 1 guest");
      return false;
    }

    if (guestCount > maxGuests) {
      setError(`Maximum ${maxGuests} guests allowed`);
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (checkInDate < today) {
      setError("Check-in date cannot be in the past");
      return false;
    }

    if (checkOutDate <= checkInDate) {
      setError("Check-out date must be after check-in date");
      return false;
    }

    return true;
  };

  const handleReserve = async () => {
    // Check authentication
    if (status === "loading") {
      return; // Wait for session to load
    }

    if (!session) {
      router.push("/signin");
      return;
    }

    // Validate inputs
    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      console.log("🔵 Making reservation request...");
      console.log("Data being sent:", {
        listingId,
        startDate: checkInDate!.toISOString(),
        endDate: checkOutDate!.toISOString(),
        guestCount: guestCount,
        totalPrice: total,
      });

      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          listingId,
          startDate: checkInDate!.toISOString(),
          endDate: checkOutDate!.toISOString(),
          guestCount: guestCount,
          totalPrice: total,
        }),
      });

      console.log("🔵 Response status:", response.status);

      let data;
      try {
        data = await response.json();
        console.log("🔵 Response data:", data);
      } catch (parseError) {
        console.error("❌ Failed to parse response as JSON:", parseError);
        throw new Error("Invalid server response");
      }

      if (response.ok) {
        console.log("✅ Reservation successful!");
        alert("Reservation created successfully!");
        
        // Clear form
        onCheckInSelect(undefined);
        onCheckOutSelect(undefined);
        onGuestChange(1);
        
        // Navigate to trips page
        router.push("/trips");
        router.refresh();
      } else {
        console.error("❌ Reservation failed:", data);
        const errorMessage = data.error || `Server error (${response.status})`;
        setError(errorMessage);
        
        // Show detailed error in development
        if (process.env.NODE_ENV === 'development' && data.details) {
          console.error("Error details:", data.details);
        }
      }
    } catch (error) {
      console.error("❌ Network/Client Error:", error);
      setError(
        error instanceof Error 
          ? `Network error: ${error.message}` 
          : "Something went wrong. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = !checkInDate || !checkOutDate || loading || status === "loading";

  return (
    <Card className="border border-gray-200 rounded-2xl shadow-md">
      <CardContent className="p-6 space-y-4">
        <div className="flex items-end justify-between">
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold text-gray-900">${price}</span>
            <span className="text-sm text-gray-500">night</span>
          </div>
        </div>

        <div className="space-y-2">
          <DatePickerSection
            checkInDate={checkInDate}
            checkOutDate={checkOutDate}
            onCheckInSelect={onCheckInSelect}
            onCheckOutSelect={onCheckOutSelect}
          />
          <GuestSelector 
            maxGuests={maxGuests} 
            guestCount={guestCount}
            onGuestChange={onGuestChange}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Button
          onClick={handleReserve}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium py-3 text-base hover:from-rose-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          size="lg"
          disabled={isDisabled}
        >
          {loading ? "Reserving..." : status === "loading" ? "Loading..." : "Reserve"}
        </Button>

        <p className="text-center text-sm text-gray-500">You won&apos;t be charged yet</p>

        {checkInDate && checkOutDate && nights > 0 && (
          <div className="pt-4 space-y-3 text-sm text-gray-700">
            <div className="flex justify-between">
              <span className="underline">${price} × {nights} nights</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline">Cleaning fee</span>
              <span>${cleaningFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="underline">Service fee</span>
              <span>${serviceFee.toFixed(2)}</span>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between font-semibold text-base">
              <span>Total before taxes</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
