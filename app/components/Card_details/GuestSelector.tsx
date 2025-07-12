"use client";
import { useState } from "react";

export default function ExpandedSearchBar({ maxGuests }: { maxGuests: number }) {
  const [guests, setGuests] = useState<number>(1);

  const decreaseGuests = () => {
    setGuests(Math.max(1, guests - 1)); 
  };

  const increaseGuests = () => {
    setGuests(Math.min(maxGuests, guests + 1));
  };

  return (
    <div className="pt-4 pb-2 flex justify-between items-center">
      <div>
        <div className="text-sm font-medium text-gray-900">Guests</div>
        <div className="text-sm text-gray-500">
          {guests} {guests === 1 ? "guest" : "guests"}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={decreaseGuests}
          className={`w-8 h-8 rounded-full border flex items-center justify-center text-gray-700 transition hover:bg-gray-100 ${
            guests <= 1 ? "opacity-30 cursor-not-allowed" : "border-gray-400"
          }`}
          disabled={guests <= 1}
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{guests}</span>
        <button
          onClick={increaseGuests}
          className={`w-8 h-8 rounded-full border flex items-center justify-center text-gray-700 transition hover:bg-gray-100 ${
            guests >= maxGuests ? "opacity-30 cursor-not-allowed" : "border-gray-400"
          }`}
          disabled={guests >= maxGuests}
        >
          +
        </button>
      </div>
    </div>
  );
}

