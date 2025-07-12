// app/listing/[id]/components/ListingHeader.tsx
"use client";

import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Star,
  MapPin,
  Crown,
  Heart,
  Share2,
  ChevronLeft
} from "lucide-react";

interface ListingHeaderProps {
  title: string;
  rating: number;
  reviews: number;
  location: string;
  listingId: string;
  onBack: () => void;
}

function SaveButton({ listingId }: { listingId: string }) {
  const [saved, setSaved] = useState(false);

  return (
    <Button
      variant="ghost"
      size="sm"
      className="hover:bg-gray-100 transition-colors px-2 py-1"
      onClick={() => setSaved(!saved)}
    >
      <Heart className={`w-4 h-4 mr-1 ${saved ? "fill-current text-rose-500" : ""}`} />
      <span className="text-sm">{saved ? "Saved" : "Save"}</span>
    </Button>
  );
}

function ShareButton({ listingId }: { listingId: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="hover:bg-gray-100 transition-colors px-2 py-1"
      onClick={handleShare}
    >
      <Share2 className="w-4 h-4 mr-1" />
      <span className="text-sm">{copied ? "Copied!" : "Share"}</span>
    </Button>
  );
}

export default function ListingHeader({
  title,
  rating,
  reviews,
  location,
  listingId,
  onBack,
}: ListingHeaderProps) {
  return (
    <>
      {/* Sticky Header */}
      <div className="border-b border-gray-200 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        {/* Removed px-4 from container, added px-4 to inner div */}
        <div className="container mx-auto py-3">
          <div className="flex items-center justify-between px-4"> {/* Added px-4 here */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 transition-colors"
                onClick={onBack}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
                <a href="#photos" className="hover:text-gray-800 transition-colors">Photos</a>
                <a href="#amenities" className="hover:text-gray-800 transition-colors">Amenities</a>
                <a href="#reviews" className="hover:text-gray-800 transition-colors">Reviews</a>
                <a href="#location" className="hover:text-gray-800 transition-colors">Location</a>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <ShareButton listingId={listingId} />
              <SaveButton listingId={listingId} />
            </div>
          </div>
        </div>
      </div>

      {/* Title Section - Adjusted padding */}
      <div className="mb-6 px-4"> {/* Added px-4 here to align with the header content */}
        <h1 className="text-3xl font-bold mb-2 text-gray-900">{title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-700 flex-wrap">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-current text-rose-500" />
            <span className="font-medium">{rating?.toFixed(2)}</span>
            <span className="text-gray-500">•</span>
            <a href="#reviews" className="underline hover:no-underline">
              {reviews} reviews
            </a>
          </div>
          <span className="text-gray-500">•</span>
          <Badge variant="secondary" className="bg-rose-50 text-rose-700 hover:bg-rose-100 px-2 py-0.5 rounded-full text-xs font-medium">
            <Crown className="w-3 h-3 mr-1" />
            Superhost
          </Badge>
          <span className="text-gray-500">•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            <a href="#location" className="underline hover:no-underline">{location}</a>
          </div>
        </div>
      </div>
    </>
  );
}