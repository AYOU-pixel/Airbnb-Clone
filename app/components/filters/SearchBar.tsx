// components/filters/AirbnbSearchBar.tsx
"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Search } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { Button } from "@/app/components/ui/button";
import { ExpandedSearchBar } from "./ExpandedSearchBar";
import { useRouter, useSearchParams } from "next/navigation";

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

interface AirbnbSearchBarProps {
  expanded?: boolean;
  onExpand?: (expanded: boolean) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onSearchResults?: (results: any) => void; // لتمرير النتائج للمكون الأب
}

export function AirbnbSearchBar({
  expanded,
  onExpand,
  onSearchResults,
}: AirbnbSearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const isControlled = typeof expanded === "boolean" && typeof onExpand === "function";
  const [internalExpanded, setInternalExpanded] = useState(false);
  const isExpanded = isControlled ? expanded : internalExpanded;
  const setIsExpanded = isControlled ? onExpand! : setInternalExpanded;

  const [activeField, setActiveField] = useState<
    "where" | "checkIn" | "checkOut" | "who" | null
  >(null);

  const [isSearching, setIsSearching] = useState(false);
  const searchBarRef = useRef<HTMLDivElement>(null);

  // Input states - تهيئة من URL params إذا كانت متوفرة
  const [destination, setDestination] = useState(() => searchParams.get('destination') || "");
  const [checkInDate, setCheckInDate] = useState<Date | undefined>(() => {
    const checkIn = searchParams.get('checkIn');
    return checkIn ? new Date(checkIn) : undefined;
  });
  const [checkOutDate, setCheckOutDate] = useState<Date | undefined>(() => {
    const checkOut = searchParams.get('checkOut');
    return checkOut ? new Date(checkOut) : undefined;
  });
  const [guests, setGuests] = useState(() => {
    const guestsParam = searchParams.get('guests');
    return guestsParam ? parseInt(guestsParam) : 0;
  });

  // Location suggestions - يمكن أن تأتي من API في المستقبل
  const [locationSuggestions] = useState<LocationSuggestion[]>([
    { id: "1", name: "Malibu", description: "California, United States" },
    { id: "2", name: "Charleston", description: "South Carolina, United States" },
    { id: "3", name: "Asheville", description: "North Carolina, United States" },
    { id: "4", name: "Miami", description: "Florida, United States" },
    { id: "5", name: "Lake Tahoe", description: "California, United States" },
    { id: "6", name: "Napa Valley", description: "California, United States" },
    { id: "7", name: "Denver", description: "Colorado, United States" },
    { id: "8", name: "Portland", description: "Oregon, United States" },
    { id: "9", name: "Joshua Tree", description: "California, United States" },
    { id: "10", name: "Aspen", description: "Colorado, United States" },
    { id: "11", name: "Chicago", description: "Illinois, United States" },
    { id: "12", name: "Vermont", description: "United States" },
    { id: "13", name: "San Diego", description: "California, United States" },
    { id: "14", name: "Boston", description: "Massachusetts, United States" },
    { id: "15", name: "Fiji", description: "Pacific Islands" },
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

  // Function to perform the search
  const performSearch = async (searchQuery: SearchQuery) => {
    setIsSearching(true);
    
    try {
      // بناء URL للبحث
      const params = new URLSearchParams();
      
      if (searchQuery.destination) {
        params.append('destination', searchQuery.destination);
      }
      
      if (searchQuery.checkInDate) {
        params.append('checkIn', searchQuery.checkInDate.toISOString().split('T')[0]);
      }
      
      if (searchQuery.checkOutDate) {
        params.append('checkOut', searchQuery.checkOutDate.toISOString().split('T')[0]);
      }
      
      if (searchQuery.guests > 0) {
        params.append('guests', searchQuery.guests.toString());
      }

      console.log('🔍 Searching with params:', params.toString());

      // استدعاء API البحث
      const response = await fetch(`/api/search?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Search failed with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      console.log('🔍 Search results:', data);

      // تمرير النتائج للمكون الأب إذا كان متوفراً
      if (onSearchResults) {
        onSearchResults(data);
      }

      // التنقل إلى صفحة النتائج مع معاملات البحث
      const searchUrl = `/search?${params.toString()}`;
      router.push(searchUrl);
      
    } catch (error) {
      console.error('❌ Search error:', error);
      // يمكن إضافة toast notification هنا
    } finally {
      setIsSearching(false);
    }
  };

  // Handle the search submission
  const handleSearchSubmit = useCallback(async () => {
    setIsExpanded(false);
    setActiveField(null);
    
    const query: SearchQuery = {
      destination,
      checkInDate,
      checkOutDate,
      guests,
    };
    
    console.log("🔍 Search Query:", query);
    await performSearch(query);
  }, [destination, checkInDate, checkOutDate, guests, setIsExpanded, onSearchResults, router]);

  // Handle click on the collapsed search bar to expand it
  const handleSearchBarClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      setActiveField("where");
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
        className="flex flex-col w-full bg-white rounded-2xl shadow-md border overflow-hidden cursor-pointer sm:flex-row sm:items-center sm:rounded-full hover:shadow-lg transition-shadow duration-200"
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
            className="bg-rose-500 text-white p-2 sm:p-3 rounded-full hover:bg-rose-600 flex items-center justify-center min-w-[40px] min-h-[40px] sm:min-w-[48px] sm:min-h-[48px] transition-colors duration-200 disabled:opacity-50"
            onClick={(e) => {
              e.stopPropagation();
              handleSearchSubmit();
            }}
            disabled={isSearching}
          >
            {isSearching ? (
              <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
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
              isSearching={isSearching}
            />
          ) : (
            renderCollapsedContent()
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}



