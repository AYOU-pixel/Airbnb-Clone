// app/components/Card_details/DatePickerSection.tsx
"use client";

import { useState } from "react";
import { Calendar as ShadcnCalendar } from "@/app/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/app/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface DatePickerSectionProps {
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  onCheckInSelect: (date: Date | undefined) => void;
  onCheckOutSelect: (date: Date | undefined) => void;
}

export default function DatePickerSection({
  checkInDate,
  checkOutDate,
  onCheckInSelect,
  onCheckOutSelect,
}: DatePickerSectionProps) {
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const handleCheckInSelect = (date: Date | undefined) => {
    onCheckInSelect(date);
    setCheckInOpen(false);
    // Auto-open checkout if check-in is selected
    if (date) {
      setTimeout(() => setCheckOutOpen(true), 100);
    }
  };

  const handleCheckOutSelect = (date: Date | undefined) => {
    onCheckOutSelect(date);
    setCheckOutOpen(false);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-gray-300">
        <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
          <PopoverTrigger asChild>
            <div className="p-3 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="text-xs font-medium text-gray-900 uppercase">Check-in</div>
              <div className="text-sm text-gray-600">
                {checkInDate ? format(checkInDate, "M/d/yyyy") : "Add date"}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <ShadcnCalendar
              mode="single"
              selected={checkInDate}
              onSelect={handleCheckInSelect}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>

        <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
          <PopoverTrigger asChild>
            <div className={cn(
              "p-3 hover:bg-gray-50 transition-colors cursor-pointer",
              !checkInDate && "opacity-50 cursor-not-allowed"
            )}>
              <div className="text-xs font-medium text-gray-900 uppercase">Check-out</div>
              <div className="text-sm text-gray-600">
                {checkOutDate ? format(checkOutDate, "M/d/yyyy") : "Add date"}
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <ShadcnCalendar
              mode="single"
              selected={checkOutDate}
              onSelect={handleCheckOutSelect}
              initialFocus
              disabled={(date) => !checkInDate || date <= checkInDate}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}