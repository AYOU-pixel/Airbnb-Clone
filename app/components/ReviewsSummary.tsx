// app/listing/[id]/components/ReviewsSummary.tsx
'use client';

import { Star } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button"; // Added missing import

export default function ReviewsSummary({
  rating,
  reviews,
}: {
  rating: number;
  reviews: number;
}) {
  return (
    <Card id="reviews" className="mt-6 shadow-lg border-0 shadow-gray-200/30">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Star className="w-5 h-5 fill-current text-rose-500" />
          <span className="text-lg font-semibold">{rating?.toFixed(2)}</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-600">{reviews} reviews</span>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span>Cleanliness</span>
            <span className="font-medium">4.9</span>
          </div>
          <div className="flex justify-between">
            <span>Communication</span>
            <span className="font-medium">4.8</span>
          </div>
          <div className="flex justify-between">
            <span>Check-in</span>
            <span className="font-medium">4.9</span>
          </div>
          <div className="flex justify-between">
            <span>Accuracy</span>
            <span className="font-medium">4.8</span>
          </div>
          <div className="flex justify-between">
            <span>Location</span>
            <span className="font-medium">4.9</span>
          </div>
          <div className="flex justify-between">
            <span>Value</span>
            <span className="font-medium">4.7</span>
          </div>
        </div>
        <Button
          variant="outline"
          className="w-full mt-6 border-gray-300 hover:bg-gray-50"
        >
          Show all {reviews} reviews
        </Button>
      </CardContent>
    </Card>
  );
}