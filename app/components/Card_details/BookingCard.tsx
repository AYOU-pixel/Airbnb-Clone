"use client";

import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Separator } from "@/app/components/ui/separator";
import DatePickerSection from "./DatePickerSection";
import GuestSelector from "./GuestSelector";

interface BookingCardProps {
  price: number;
  maxGuests: number;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  onCheckInSelect: (date: Date | undefined) => void;
  onCheckOutSelect: (date: Date | undefined) => void;
}

export default function BookingCard({
  price,
  maxGuests,
  checkInDate,
  checkOutDate,
  onCheckInSelect,
  onCheckOutSelect,
}: BookingCardProps) {
  // Calculate number of nights
  const nights = checkInDate && checkOutDate
    ? Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const cleaningFee = 75;
  const serviceFee = 83;
  const subtotal = price * nights;
  const total = subtotal + cleaningFee + serviceFee;

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
          <GuestSelector maxGuests={maxGuests} />
        </div>

        <Button
          className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white font-medium py-3 text-base hover:from-rose-600 hover:to-pink-600 transition-all duration-200"
          size="lg"
          disabled={!checkInDate || !checkOutDate}
        >
          Reserve
        </Button>

        <p className="text-center text-sm text-gray-500">
          You won&apos;t be charged yet
        </p>

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