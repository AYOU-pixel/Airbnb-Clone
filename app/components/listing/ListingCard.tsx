"use client";
import React, { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";

type Props = {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: string;
  rating?: number | null;
  distance?: string | null;
  dateRange?: string | null;
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card
        className="bg-white border-0 shadow-lg rounded-xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-xl"
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
              className="object-cover w-full h-full rounded-xl transition-transform duration-200 hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200" />
          </div>

          {validImages.length > 1 && (
            <>
              <Button
                className={cn(
                  "absolute top-1/2 left-3 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-0 h-8 w-8 text-gray-700 shadow-md border-0 transition-all duration-150 flex items-center justify-center z-30",
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
                  "absolute top-1/2 right-3 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-0 h-8 w-8 text-gray-700 shadow-md border-0 transition-all duration-150 flex items-center justify-center z-30",
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

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1.5 z-20">
                {validImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={(e) => handleDotClick(index, e)}
                    onMouseDown={handleInteractionStart}
                    onMouseUp={handleInteractionEnd}
                    onTouchStart={handleInteractionStart}
                    onTouchEnd={handleInteractionEnd}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all duration-150 border-0 cursor-pointer",
                      index === currentImageIndex
                        ? "bg-white scale-125 shadow-sm"
                        : "bg-white/50 hover:bg-white/80 active:bg-white"
                    )}
                    aria-label={`Go to image ${index + 1}`}
                  />
                ))}
              </div>
            </>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 rounded-full bg-white/90 hover:bg-white p-0 h-8 w-8 text-gray-700 shadow-md transition-all duration-150 z-30 border-0"
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
                "h-5 w-5 transition-all duration-150",
                isLiked
                  ? "fill-red-500 text-red-500 scale-110"
                  : "fill-transparent text-gray-700 hover:scale-110",
                isLoading && "opacity-50"
              )}
            />
          </Button>

          {(guestFavorite || isNew) && (
            <div className="absolute top-3 left-3 flex gap-2">
              {guestFavorite && (
                <span className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                  Guest favorite
                </span>
              )}
              {isNew && (
                <span className="bg-white text-gray-900 text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                  New
                </span>
              )}
            </div>
          )}
        </div>

        <CardContent className="p-0 pt-3 space-y-1.5">
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-gray-900 text-base leading-tight pr-4 truncate">
              {title}
            </h3>
            {rating != null && (
              <div className="flex items-center text-sm font-medium text-gray-900 flex-shrink-0">
                <Star className="w-3.5 h-3.5 fill-current text-yellow-500 mr-1" />
                {rating.toFixed(2)}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-500 leading-tight truncate">{location}</p>

          {distance != null && (
            <p className="text-sm text-gray-500 leading-tight italic">{distance}</p>
          )}

          {dateRange != null && (
            <p className="text-sm text-gray-500 leading-tight">{dateRange}</p>
          )}

          <div className="pt-0.5">
            <p className="text-base text-gray-900 font-semibold">
              ${price} <span className="font-normal text-gray-500 text-sm">/ night</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}