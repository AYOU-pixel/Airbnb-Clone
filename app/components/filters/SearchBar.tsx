// components/filters/AirbnbSearchBar.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/app/components/ui/button";
import { ExpandedSearchBar } from "./ExpandedSearchBar"; // Import the new child component


// Define the shape of a search query for clarity
export interface SearchQuery {
  destination: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  guests: number;
}

export interface LocationSuggestion {
  id: string;
  name: string;
  description: string;
}

export function AirbnbSearchBar({
  expanded,
  onExpand,
}: {
  expanded?: boolean;
  onExpand?: (expanded: boolean) => void;
}) {
  const isControlled = typeof expanded === "boolean" && typeof onExpand === "function";
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = isControlled ? expanded : internalExpanded;
  const setIsExpanded = isControlled ? onExpand! : setInternalExpanded;

  const [activeField, setActiveField] = useState<
    "where" | "checkIn" | "checkOut" | "who" | null
  >(null);

  const searchBarRef = useRef<HTMLDivElement>(null); // Ref for the entire search bar component

  // Input states
  const [destination, setDestination] = useState("");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(undefined);
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(undefined);
  const [guests, setGuests] = useState(0);

  // Example location suggestions (can be fetched from an API)
  const [locationSuggestions] = useState<LocationSuggestion[]>([
    { id: "1", name: "London", description: "United Kingdom" },
    { id: "2", name: "Paris", description: "France" },
    { id: "3", name: "New York", description: "United States" },
    { id: "4", name: "Tokyo", description: "Japan" },
    { id: "5", name: "Rome", description: "Italy" },
    { id: "6", name: "Barcelona", description: "Spain" },
    { id: "7", name: "Amsterdam", description: "Netherlands" },
  ]);

  // Handle clicks outside the search bar to collapse it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest(".shadcn-popover-content")
      ) {
        setIsExpanded(false);
        setActiveField(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setIsExpanded]);

  // Handle the search submission
  const handleSearchSubmit = useCallback(() => {
    setIsExpanded(false);
    setActiveField(null);
    const query: SearchQuery = {
      destination,
      checkInDate,
      checkOutDate,
      guests,
    };
    console.log("Search Query:", query); // Trigger API call here
  }, [destination, checkInDate, checkOutDate, guests, setIsExpanded]);

  // Handle click on the collapsed search bar to expand it
  const handleSearchBarClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setActiveField("where"); // Automatically focus on "Where" when expanded
    }
  };

  const renderCollapsedContent = () => {
    let dateDisplayText = "Any week";
    if (checkInDate && checkOutDate) {
      dateDisplayText = `${format(checkInDate, "MMM d")} - ${format(
        checkOutDate,
        "MMM d"
      )}`;
    } else if (checkInDate) {
      dateDisplayText = `From ${format(checkInDate, "MMM d")}`;
    } else if (checkOutDate) {
      dateDisplayText = `Until ${format(checkOutDate, "MMM d")}`;
    }

    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="flex flex-col w-full bg-white rounded-2xl shadow-md border overflow-hidden cursor-pointer sm:flex-row sm:items-center sm:rounded-full"
        onClick={handleSearchBarClick}
      >
        <div className="flex-1 px-4 py-3 sm:px-5 sm:py-4 text-sm font-semibold text-gray-900 border-b sm:border-b-0 sm:border-r truncate">
          {destination || "Anywhere"}
        </div>
        <div className="flex-1 px-4 py-3 sm:px-5 sm:py-4 text-sm text-gray-600 border-b sm:border-b-0 sm:border-r truncate">
          {dateDisplayText}
        </div>
        <div className="flex-1 px-4 py-3 sm:px-5 sm:py-4 text-sm text-gray-600 truncate">
          {guests > 0 ? `${guests} guests` : "Add guests"}
        </div>
        <div className="flex justify-end p-2 sm:p-3">
          <Button
            className="bg-rose-500 text-white p-2 sm:p-3 rounded-full hover:bg-rose-600 flex items-center justify-center min-w-[40px] min-h-[40px] sm:min-w-[48px] sm:min-h-[48px] transition-colors duration-200"
            onClick={(e) => {
              e.stopPropagation();
              handleSearchSubmit();
            }}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="w-full flex items-center justify-center py-2 sm:py-4 md:py-6 px-2 sm:px-4">
      <div
        ref={searchBarRef}
        className="relative w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl mx-auto"
      >
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <ExpandedSearchBar
              destination={destination}
              setDestination={setDestination}
              checkInDate={checkInDate}
              setCheckInDate={setCheckInDate}
              checkOutDate={checkOutDate}
              setCheckOutDate={setCheckOutDate}
              guests={guests}
              setGuests={setGuests}
              locationSuggestions={locationSuggestions}
              activeField={activeField}
              setActiveField={setActiveField}
              handleSearchSubmit={handleSearchSubmit}
            />
          ) : (
            renderCollapsedContent()
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}



