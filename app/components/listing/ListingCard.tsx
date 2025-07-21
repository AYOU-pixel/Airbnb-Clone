"use client";

import React, { useState, useRef, useCallback } from "react";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

type Props = {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: string;
  rating?: number;
  distance?: string;
  dateRange?: string;
  isNew?: boolean;
  guestFavorite?: boolean;
};

export default function ListingCard({
  id,
  title,
  location,
  images,
  price,
  rating,
  distance,
  dateRange,
  isNew = false,
  guestFavorite = false,
}: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Stabilize hover state with debouncing
  const handleMouseEnter = useCallback(() => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    if (!isInteracting) {
      hoverTimeoutRef.current = setTimeout(() => {
        setIsHovered(false);
      }, 100);
    }
  }, [isInteracting]);

  // Prevent hover state from changing during interaction
  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false);
    // Small delay to prevent flicker
    setTimeout(() => {
      if (!isHovered) {
        setIsHovered(false);
      }
    }, 50);
  }, [isHovered]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  }, [images.length]);

  const handleLikeToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsLiked(!isLiked);
    console.log(`Toggled like for ${title}: ${!isLiked}`);
  }, [isLiked, title]);

  const handleCardClick = useCallback(() => {
    if (!isInteracting) {
      router.push(`/listing/${id}`);
    }
  }, [router, id, isInteracting]);

  const handleDotClick = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(index);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    handleInteractionStart();
  }, [handleInteractionStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    if (!touchStart || !touchEnd) {
      handleInteractionEnd();
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
    
    handleInteractionEnd();
  }, [touchStart, touchEnd, currentImageIndex, images.length, handleInteractionEnd]);

  // Show navigation buttons with more stable conditions
  const showPrevButton = isHovered && currentImageIndex > 0;
  const showNextButton = isHovered && currentImageIndex < images.length - 1;

  return (
    <Card
      className="bg-white border-0 shadow-none rounded-xl overflow-hidden cursor-pointer group transition-all duration-200 hover:shadow-lg"
      onClick={handleCardClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={imageRef}
        className="relative w-full aspect-square overflow-hidden rounded-xl bg-gray-100"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full">
          <CldImage
            src={images[currentImageIndex]}
            alt={title}
            width={800}
            height={800}
            crop="fill"
            className="object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        </div>

        {images.length > 1 && (
          <>
            <Button
              className={cn(
                "absolute top-1/2 left-3 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-0 h-8 w-8 text-gray-800 shadow-lg border-0 transition-all duration-150 flex items-center justify-center z-30",
                showPrevButton
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 -translate-x-2 pointer-events-none"
              )}
              size="icon"
              onClick={handlePrevImage}
              onMouseDown={handleInteractionStart}
              onMouseUp={handleInteractionEnd}
              onMouseLeave={handleInteractionEnd}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              className={cn(
                "absolute top-1/2 right-3 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-0 h-8 w-8 text-gray-800 shadow-lg border-0 transition-all duration-150 flex items-center justify-center z-30",
                showNextButton
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 translate-x-2 pointer-events-none"
              )}
              size="icon"
              onClick={handleNextImage}
              onMouseDown={handleInteractionStart}
              onMouseUp={handleInteractionEnd}
              onMouseLeave={handleInteractionEnd}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={(e) => handleDotClick(index, e)}
                onMouseDown={handleInteractionStart}
                onMouseUp={handleInteractionEnd}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-150 border-0 cursor-pointer",
                  index === currentImageIndex
                    ? "bg-white shadow-sm scale-110"
                    : "bg-white/60 hover:bg-white/80"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 rounded-full bg-transparent hover:bg-white/20 p-0 h-8 w-8 text-white transition-all duration-150 z-30 border-0"
          onClick={handleLikeToggle}
          onMouseDown={handleInteractionStart}
          onMouseUp={handleInteractionEnd}
          aria-label="Toggle favorite"
        >
          <Heart
            className={cn(
              "h-6 w-6 transition-all duration-150",
              isLiked
                ? "fill-red-500 text-red-500 scale-110"
                : "fill-black/20 text-white hover:scale-110"
            )}
          />
        </Button>

        {guestFavorite && (
          <div className="absolute top-3 left-3 bg-white text-black text-xs font-medium px-2 py-1 rounded-md shadow-sm z-20">
            Guest favorite
          </div>
        )}

        {isNew && (
          <div className="absolute top-3 left-3 bg-white text-black text-xs font-medium px-2 py-1 rounded-md shadow-sm z-20">
            New
          </div>
        )}
      </div>

      <CardContent className="p-0 pt-3">
        <div className="space-y-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-gray-900 text-base leading-tight pr-2 truncate">
              {title}
            </h3>
            {rating && (
              <div className="flex items-center text-sm font-medium text-gray-900 flex-shrink-0">
                <Star className="w-3 h-3 fill-current mr-1" />
                {rating.toFixed(1)}
              </div>
            )}
          </div>

          {distance && (
            <p className="text-sm text-gray-500 leading-tight">{distance}</p>
          )}

          <p className="text-sm text-gray-500 leading-tight">{location}</p>

          {dateRange && (
            <p className="text-sm text-gray-500 leading-tight">{dateRange}</p>
          )}

          <div className="pt-1">
            <p className="text-base text-gray-900 font-medium">
              ${price}{" "}
              <span className="font-normal text-gray-500">night</span>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}