// components/filters/ExpandedSearchBar.tsx
"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { Search, Plus, Minus } from "lucide-react";
import { motion } from "framer-motion";

// Shadcn UI Components
import { Button } from "@/app/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Calendar } from "@/app/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/app/components/ui/command";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface LocationSuggestion {
  id: string;
  name: string;
  description: string;
}

interface ExpandedSearchBarProps {
  destination: string;
  setDestination: (destination: string) => void;
  checkInDate: Date | undefined;
  setCheckInDate: (date: Date | undefined) => void;
  checkOutDate: Date | undefined;
  setCheckOutDate: (date: Date | undefined) => void;
  guests: number;
  setGuests: (guests: number) => void; // This setGuests expects a number
  locationSuggestions: LocationSuggestion[];
  activeField: "where" | "checkIn" | "checkOut" | "who" | null;
  setActiveField: (field: "where" | "checkIn" | "checkOut" | "who" | null) => void;
  handleSearchSubmit: () => void;
}

export function ExpandedSearchBar({
  destination,
  setDestination,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  guests,
  setGuests,
  locationSuggestions,
  activeField,
  setActiveField,
  handleSearchSubmit,
}: ExpandedSearchBarProps) {
  // Refs for keyboard navigation and focus
  const whereRef = useRef<HTMLDivElement>(null);
  const checkInRef = useRef<HTMLDivElement>(null);
  const checkOutRef = useRef<HTMLDivElement>(null);
  const whoRef = useRef<HTMLDivElement>(null);

  // Function to focus on a specific field and potentially scroll it into view
  const focusField = useCallback((field: "where" | "checkIn" | "checkOut" | "who" | null) => {
    setActiveField(field);
    requestAnimationFrame(() => {
      let ref;
      switch (field) {
        case "where": ref = whereRef; break;
        case "checkIn": ref = checkInRef; break;
        case "checkOut": ref = checkOutRef; break;
        case "who": ref = whoRef; break;
        default: return;
      }
      if (ref.current) {
        ref.current.focus();
        ref.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }, [setActiveField]);

  // Keyboard navigation for tabbing through fields
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        e.preventDefault();
        if (activeField === "where") {
          focusField("checkIn");
        } else if (activeField === "checkIn") {
          focusField("checkOut");
        } else if (activeField === "checkOut") {
          focusField("who");
        } else if (activeField === "who") {
          setActiveField(null); // Optionally blur or loop back
          // Consider what happens if 'Enter' wasn't used after tabbing out of 'who'
          // Maybe focus the search button directly if it's the next logical step.
        } else {
            // If no field is active, perhaps focus the first field on tab press
            focusField("where");
        }
      } else if (e.key === "Enter") {
        if (activeField === "who") {
            handleSearchSubmit();
        } else if (activeField === "where" && locationSuggestions.length === 1 && destination.toLowerCase() === locationSuggestions[0].name.toLowerCase()) {
            // If only one suggestion matches perfectly, select it and move to next field
            setDestination(locationSuggestions[0].name);
            focusField("checkIn");
        }
        // For other fields, Enter might naturally close the popover and move focus
        // if not explicitly handled by the internal components (like calendar)
      } else if (e.key === "Escape") {
        setActiveField(null); // Close active popover/field
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeField, focusField, handleSearchSubmit, setActiveField, destination, locationSuggestions, setDestination]);


  // Helper component for search fields
  const FieldWrapper = React.forwardRef<
    HTMLDivElement,
    {
      label: string;
      placeholder: string;
      value?: string;
      isActive: boolean;
      className?: string;
      onClick: () => void;
    }
  >(({ label, placeholder, value, isActive, className, onClick }, ref) => (
    <div
      ref={ref}
      tabIndex={0} // Ensure all field wrappers are keyboard focusable
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      role="button" // Indicate that this div acts like a button for assistive technologies
      aria-label={`${label} field, current value: ${value || placeholder}`} // Provide a descriptive label
      className={cn(
        "flex flex-col justify-center p-3 sm:p-4 md:p-5 border-b sm:border-b-0 sm:border-r last:border-r-0 last:border-b-0 transition-all duration-300 min-w-0 flex-1 cursor-pointer",
        isActive
          ? "bg-gray-100 sm:rounded-full shadow-inner ring-2 ring-gray-300"
          : "hover:bg-gray-50",
        className
      )}
    >
      <span className="text-xs font-semibold text-gray-900 mb-1">
        {label}
      </span>
      <span className="text-sm text-gray-500 truncate">
        {value || placeholder}
      </span>
    </div>
  ));

  FieldWrapper.displayName = "FieldWrapper";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col w-full bg-white rounded-2xl shadow-lg border overflow-hidden sm:flex-row sm:rounded-full"
    >
      {/* Where Field */}
      <Popover
        open={activeField === "where"}
        onOpenChange={(open) => {
          if (open) {
            focusField("where");
          } else if (activeField === "where") {
            setActiveField(null);
          }
        }}
      >
        <PopoverTrigger asChild>
          <FieldWrapper
            ref={whereRef}
            label="Where"
            placeholder="Search destinations"
            value={destination}
            isActive={activeField === "where"}
            onClick={() => focusField("where")}
            className="min-w-0 sm:min-w-[150px] md:min-w-[200px]"
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-[280px] sm:w-[320px] p-0 shadcn-popover-content"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()} // Prevent shadcn from auto-focusing
        >
          <Command>
            <CommandInput
              placeholder="Search destination..."
              value={destination}
              onValueChange={setDestination}
              autoFocus // Ensure input is focused when popover opens
            />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {locationSuggestions
                  .filter((loc) =>
                    loc.name.toLowerCase().includes(destination.toLowerCase())
                  )
                  .map((loc) => (
                    <CommandItem
                      key={loc.id}
                      onSelect={() => {
                        setDestination(loc.name);
                        focusField("checkIn");
                      }}
                      className="cursor-pointer"
                    >
                      {loc.name}, {loc.description}
                    </CommandItem>
                  ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Check-in Field */}
      <Popover
        open={activeField === "checkIn"}
        onOpenChange={(open) => {
          if (open) {
            focusField("checkIn");
          } else if (activeField === "checkIn") {
            setActiveField(null);
          }
        }}
      >
        <PopoverTrigger asChild>
          <FieldWrapper
            ref={checkInRef}
            label="Check in"
            placeholder="Add dates"
            value={checkInDate ? format(checkInDate, "MMM d") : ""}
            isActive={activeField === "checkIn"}
            onClick={() => focusField("checkIn")}
            className="min-w-0 sm:min-w-[120px] md:min-w-[140px]"
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 shadcn-popover-content"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()} // Prevent shadcn from auto-focusing
        >
          <Calendar
            mode="single"
            selected={checkInDate}
            onSelect={(date) => {
              setCheckInDate(date);
              // If check-in date is set after current check-out date, reset check-out
              if (date && checkOutDate && date > checkOutDate) {
                setCheckOutDate(undefined);
              }
              focusField("checkOut");
            }}
            initialFocus // Ensure calendar gains focus when opened
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Normalize today to start of day
              return date < today; // Disable dates before today
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Check-out Field */}
      <Popover
        open={activeField === "checkOut"}
        onOpenChange={(open) => {
          if (open) {
            focusField("checkOut");
          } else if (activeField === "checkOut") {
            setActiveField(null);
          }
        }}
      >
        <PopoverTrigger asChild>
          <FieldWrapper
            ref={checkOutRef}
            label="Check out"
            placeholder="Add dates"
            value={checkOutDate ? format(checkOutDate, "MMM d") : ""}
            isActive={activeField === "checkOut"}
            onClick={() => focusField("checkOut")}
            className="min-w-0 sm:min-w-[120px] md:min-w-[140px]"
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-auto p-0 shadcn-popover-content"
          align="start"
          onOpenAutoFocus={(e) => e.preventDefault()} // Prevent shadcn from auto-focusing
        >
          <Calendar
            mode="single"
            selected={checkOutDate}
            onSelect={(date) => {
              setCheckOutDate(date);
              focusField("who");
            }}
            initialFocus // Ensure calendar gains focus when opened
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0); // Normalize today to start of day
              // Disable dates before today
              if (date < today) return true;
              // Disable dates before checkInDate (if checkInDate is set)
              if (checkInDate) {
                const checkInStartOfDay = new Date(checkInDate);
                checkInStartOfDay.setHours(0, 0, 0, 0);
                if (date < checkInStartOfDay) return true;
              }
              return false; // Default to not disabled if no other conditions met
            }}
          />
        </PopoverContent>
      </Popover>

      {/* Who Field */}
      <Popover
        open={activeField === "who"}
        onOpenChange={(open) => {
          if (open) {
            focusField("who");
          } else if (activeField === "who") {
            setActiveField(null);
          }
        }}
      >
        <PopoverTrigger asChild>
          <FieldWrapper
            ref={whoRef}
            label="Who"
            placeholder="Add guests"
            value={guests > 0 ? `${guests} guests` : ""}
            isActive={activeField === "who"}
            onClick={() => focusField("who")}
            className="min-w-0 sm:min-w-[120px] md:min-w-[140px] sm:pr-16 md:pr-20"
          />
        </PopoverTrigger>
        <PopoverContent
          className="w-[240px] sm:w-[280px] p-4 shadcn-popover-content"
          align="end"
          onOpenAutoFocus={(e) => e.preventDefault()} // Prevent shadcn from auto-focusing
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Guests</span>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-8 h-8 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent popover from closing
                  setGuests(Math.max(0, guests - 1)); // ✅ Apply the fix here
                }}
                disabled={guests === 0}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="font-semibold text-lg min-w-[30px] text-center">
                {guests}
              </span>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full w-8 h-8 border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent popover from closing
                  setGuests(guests + 1); // ✅ Apply the fix here (or Math.max(0, guests + 1) if guests can be negative initially, but not in this case)
                }}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Search button */}
      <div className="flex items-center justify-center p-2 sm:p-3 relative">
        <Button
          className="bg-rose-500 text-white p-3 sm:p-4 rounded-full hover:bg-rose-600 flex items-center justify-center min-w-[48px] min-h-[48px] sm:min-w-[56px] sm:min-h-[56px] transition-colors duration-200"
          onClick={handleSearchSubmit}
        >
          <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="ml-2 text-sm sm:text-base font-semibold hidden lg:inline">
            Search
          </span>
        </Button>
      </div>
    </motion.div>
  );
}