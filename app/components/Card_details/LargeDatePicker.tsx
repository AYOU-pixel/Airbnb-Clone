// app/components/Card_details/LargeDatePicker.tsx
"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Calendar as ShadcnCalendar } from "@/app/components/ui/calendar";
import { format } from "date-fns";

interface LargeDatePickerProps {
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  onCheckInSelect: (date: Date | undefined) => void;
  onCheckOutSelect: (date: Date | undefined) => void;
}

export default function LargeDatePicker({
  checkInDate,
  checkOutDate,
  onCheckInSelect,
  onCheckOutSelect,
}: LargeDatePickerProps) {
  const [selectingCheckOut, setSelectingCheckOut] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;

    if (!checkInDate || selectingCheckOut) {
      if (!checkInDate) {
        onCheckInSelect(date);
        setSelectingCheckOut(true);
      } else {
        onCheckOutSelect(date);
        setSelectingCheckOut(false);
      }
    } else {
      // If check-in is already selected and we're not specifically selecting check-out
      if (date <= checkInDate) {
        onCheckInSelect(date);
        onCheckOutSelect(undefined);
        setSelectingCheckOut(true);
      } else {
        onCheckOutSelect(date);
        setSelectingCheckOut(false);
      }
    }
  };

  const clearDates = () => {
    onCheckInSelect(undefined);
    onCheckOutSelect(undefined);
    setSelectingCheckOut(false);
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-4">
          <Button
            variant={!selectingCheckOut ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectingCheckOut(false)}
          >
            Check-in {checkInDate && format(checkInDate, "MMM d")}
          </Button>
          <Button
            variant={selectingCheckOut ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectingCheckOut(true)}
            disabled={!checkInDate}
          >
            Check-out {checkOutDate && format(checkOutDate, "MMM d")}
          </Button>
        </div>
        {(checkInDate || checkOutDate) && (
          <Button variant="ghost" size="sm" onClick={clearDates}>
            Clear dates
          </Button>
        )}
      </div>
      
      <ShadcnCalendar
        mode="single"
        selected={selectingCheckOut ? checkOutDate : checkInDate}
        onSelect={handleDateSelect}
        disabled={(date) => {
          if (date < new Date()) return true;
          if (selectingCheckOut && checkInDate && date <= checkInDate) return true;
          return false;
        }}
        className="w-full"
      />
      
      <div className="mt-4 text-sm text-gray-600">
        {!checkInDate && "Select your check-in date"}
        {checkInDate && !checkOutDate && "Select your check-out date"}
        {checkInDate && checkOutDate && `${format(checkInDate, "MMM d")} - ${format(checkOutDate, "MMM d")}`}
      </div>
    </div>
  );
}