// app/components/listing/ListingCard.tsx
"use client";
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { useSession } from "next-auth/react";

type Props = {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: string;
  rating?: number | null; // Allow null to match Prisma schema
  distance?: string | null; // Allow null to match Prisma schema
  dateRange?: string | null; // Allow null to match Prisma schema
  isNew?: boolean;
  guestFavorite?: boolean;
  isInWishlist?: boolean;
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
  isInWishlist = false,
}: Props) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(isInWishlist);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  // Memoize valid images to prevent recalculation
  const validImages = useMemo(() => {
    return images && images.length > 0 ? images : ['placeholder-image.jpg'];
  }, [images]);

  // Update isLiked when prop changes
  useEffect(() => {
    setIsLiked(isInWishlist);
  }, [isInWishlist]);

  // Fetch wishlist status on component mount (only if isInWishlist is not provided)
  useEffect(() => {
    if (session?.user?.email && !isInWishlist) {
      checkWishlistStatus();
    }
  }, [session, id, isInWishlist]);

  const checkWishlistStatus = async () => {
    try {
      const response = await fetch("/api/wishlist/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isInWishlist);
      }
    } catch (error) {
      console.error("Failed to check wishlist status:", error);
    }
  };

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
      }, 50);
    }
  }, [isInteracting]);

  const handleInteractionStart = useCallback(() => {
    setIsInteracting(true);
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
  }, []);

  const handleInteractionEnd = useCallback(() => {
    setIsInteracting(false);
    if (!isHovered) {
      setIsHovered(false);
    }
  }, [isHovered]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % validImages.length;
      return nextIndex;
    });
  }, [validImages.length]);

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex((prevIndex) => {
      const nextIndex = (prevIndex - 1 + validImages.length) % validImages.length;
      return nextIndex;
    });
  }, [validImages.length]);

  const handleLikeToggle = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (!session?.user?.email) {
      router.push('/signin');
      return;
    }

    if (isLoading) return;

    const newIsLiked = !isLiked;
    setIsLiked(newIsLiked);
    setIsLoading(true);

    try {
      const response = await fetch("/api/wishlist/toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: id }),
      });

      if (!response.ok) {
        setIsLiked(!newIsLiked);
        console.error("Failed to toggle wishlist");
      }
    } catch (err) {
      setIsLiked(!newIsLiked);
      console.error("❌ Failed to toggle wishlist", err);
    } finally {
      setIsLoading(false);
    }
  }, [id, isLiked, isLoading, session, router]);

  const handleCardClick = useCallback(() => {
    if (!isInteracting) {
      console.log(`🔵 Navigating to listing: ${id}`);
      router.push(`/listing/${id}`);
    }
  }, [router, id, isInteracting]);

  const handleDotClick = useCallback((index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentImageIndex(index);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchStart(touch.clientX);
      setTouchEnd(null);
      handleInteractionStart();
    }
  }, [handleInteractionStart]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.targetTouches[0];
    if (touch) {
      setTouchEnd(touch.clientX);
    }
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    e.stopPropagation();
    
    if (touchStart === null || touchEnd === null) {
      handleInteractionEnd();
      return;
    }

    const distance = touchStart - touchEnd;
    const minSwipeDistance = 30;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && currentImageIndex < validImages.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    } else if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
    
    setTouchStart(null);
    setTouchEnd(null);
    handleInteractionEnd();
  }, [touchStart, touchEnd, currentImageIndex, validImages.length, handleInteractionEnd]);

  const showPrevButton = useMemo(() => 
    isHovered && currentImageIndex > 0, 
    [isHovered, currentImageIndex]
  );
  
  const showNextButton = useMemo(() => 
    isHovered && currentImageIndex < validImages.length - 1, 
    [isHovered, currentImageIndex, validImages.length]
  );

  return (
    <Card
      className="bg-white border-0 shadow-none rounded-xl overflow-hidden cursor-pointer group transition-all duration-150 hover:shadow-lg"
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
            src={validImages[currentImageIndex]}
            alt={title}
            width={400}
            height={400}
            crop="fill"
            quality="auto"
            loading="lazy"
            className="object-cover transition-transform duration-150 group-hover:scale-105 will-change-transform"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
        </div>

        {validImages.length > 1 && (
          <>
            <Button
              className={cn(
                "absolute top-1/2 left-3 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-0 h-8 w-8 text-gray-800 shadow-lg border-0 transition-all duration-100 flex items-center justify-center z-30 will-change-transform",
                showPrevButton
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 -translate-x-2 pointer-events-none"
              )}
              size="icon"
              onClick={handlePrevImage}
              onMouseDown={handleInteractionStart}
              onMouseUp={handleInteractionEnd}
              onMouseLeave={handleInteractionEnd}
              onTouchStart={handleInteractionStart}
              onTouchEnd={handleInteractionEnd}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <Button
              className={cn(
                "absolute top-1/2 right-3 -translate-y-1/2 bg-white/95 hover:bg-white rounded-full p-0 h-8 w-8 text-gray-800 shadow-lg border-0 transition-all duration-100 flex items-center justify-center z-30 will-change-transform",
                showNextButton
                  ? "opacity-100 translate-x-0 pointer-events-auto"
                  : "opacity-0 translate-x-2 pointer-events-none"
              )}
              size="icon"
              onClick={handleNextImage}
              onMouseDown={handleInteractionStart}
              onMouseUp={handleInteractionEnd}
              onMouseLeave={handleInteractionEnd}
              onTouchStart={handleInteractionStart}
              onTouchEnd={handleInteractionEnd}
              aria-label="Next image"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}

        {validImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1 z-20">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={(e) => handleDotClick(index, e)}
                onMouseDown={handleInteractionStart}
                onMouseUp={handleInteractionEnd}
                onTouchStart={handleInteractionStart}
                onTouchEnd={handleInteractionEnd}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-100 border-0 cursor-pointer will-change-transform",
                  index === currentImageIndex
                    ? "bg-white shadow-sm scale-110"
                    : "bg-white/60 hover:bg-white/80 active:bg-white/90"
                )}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 rounded-full bg-transparent hover:bg-white/20 active:bg-white/30 p-0 h-8 w-8 text-white transition-all duration-100 z-30 border-0 will-change-transform"
          onClick={handleLikeToggle}
          onMouseDown={handleInteractionStart}
          onMouseUp={handleInteractionEnd}
          onTouchStart={handleInteractionStart}
          onTouchEnd={handleInteractionEnd}
          aria-label="Toggle favorite"
          disabled={isLoading}
        >
          <Heart
            className={cn(
              "h-6 w-6 transition-all duration-100 will-change-transform",
              isLiked
                ? "fill-red-500 text-red-500 scale-110"
                : "fill-black/20 text-white hover:scale-110",
              isLoading && "opacity-50"
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
            {rating != null && ( // Check for null explicitly
              <div className="flex items-center text-sm font-medium text-gray-900 flex-shrink-0">
                <Star className="w-3 h-3 fill-current mr-1" />
                {rating.toFixed(1)}
              </div>
            )}
          </div>

          {distance != null && ( // Check for null explicitly
            <p className="text-sm text-gray-500 leading-tight">{distance}</p>
          )}

          <p className="text-sm text-gray-500 leading-tight">{location}</p>

          {dateRange != null && ( // Check for null explicitly
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