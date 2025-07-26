"use client";


interface GuestSelectorProps {
  maxGuests: number;
  guestCount: number; // القيمة الحالية من المكون الأب
  onGuestChange: (count: number) => void; // دالة التحديث من المكون الأب
}

export default function GuestSelector({ 
  maxGuests,
  guestCount,
  onGuestChange 
}: GuestSelectorProps) {
  const decreaseGuests = () => {
    const newCount = Math.max(1, guestCount - 1);
    onGuestChange(newCount);
  };

  const increaseGuests = () => {
    const newCount = Math.min(maxGuests, guestCount + 1);
    onGuestChange(newCount);
  };

  return (
    <div className="pt-4 pb-2 flex justify-between items-center">
      <div>
        <div className="text-sm font-medium text-gray-900">Guests</div>
        <div className="text-sm text-gray-500">
          {guestCount} {guestCount === 1 ? "guest" : "guests"}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={decreaseGuests}
          className={`w-8 h-8 rounded-full border flex items-center justify-center text-gray-700 transition hover:bg-gray-100 ${
            guestCount <= 1 ? "opacity-30 cursor-not-allowed" : "border-gray-400"
          }`}
          disabled={guestCount <= 1}
        >
          −
        </button>
        <span className="w-6 text-center text-sm">{guestCount}</span>
        <button
          onClick={increaseGuests}
          className={`w-8 h-8 rounded-full border flex items-center justify-center text-gray-700 transition hover:bg-gray-100 ${
            guestCount >= maxGuests ? "opacity-30 cursor-not-allowed" : "border-gray-400"
          }`}
          disabled={guestCount >= maxGuests}
        >
          +
        </button>
      </div>
    </div>
  );
}

