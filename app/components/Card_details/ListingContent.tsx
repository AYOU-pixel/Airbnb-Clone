"use client";

import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Crown,
  Home,
  CheckCircle,
  ArrowRight,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import Image from "next/image";
import AmenitiesSection from "./AmenitiesSection";
import LocationSection from "./LocationSection";
import LargeDatePicker from "./LargeDatePicker";

interface ListingContentProps {
  images: string[];
  title: string;
  host: string;
  bedrooms: number;
  bathrooms: number;
  guests: number;
  description: string;
  amenities: string[];
  location: string;
  checkInDate: Date | undefined;
  checkOutDate: Date | undefined;
  onCheckInSelect: (date: Date | undefined) => void;
  onCheckOutSelect: (date: Date | undefined) => void;
}

export default function ListingContent({
  images,
  title,
  host,
  bedrooms,
  bathrooms,
  guests,
  description,
  amenities,
  location,
  checkInDate,
  checkOutDate,
  onCheckInSelect,
  onCheckOutSelect,
}: ListingContentProps) {
  return (
    <div className="xl:col-span-2 space-y-12">
      {/* Image Gallery */}
      <div id="photos" className="space-y-4">
        <div className="grid grid-cols-4 grid-rows-2 gap-2 h-96 rounded-2xl overflow-hidden">
          <div className="col-span-2 row-span-2 relative group cursor-pointer">
            <Image
              src={images[0]}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              priority
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </div>
          {images.slice(1, 5).map((img, index) => (
            <div key={index} className="relative group cursor-pointer rounded-lg overflow-hidden">
              <Image
                src={img}
                alt={`${title} - ${index + 1}`}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          className="ml-auto flex items-center gap-2 border-gray-900 text-gray-900 hover:bg-gray-100 text-sm font-medium"
        >
          <div className="grid grid-cols-2 gap-1 w-4 h-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-current rounded-full" />
            ))}
          </div>
          Show all {images.length} photos
        </Button>
      </div>

      {/* Host Info */}
      <div className="flex items-center justify-between py-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-gradient-to-br from-rose-400 to-orange-400 rounded-full flex items-center justify-center">
            <Crown className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-xl text-gray-900">
              Entire home hosted by {host || 'a Superhost'}
            </h3>
            <p className="text-gray-600 text-sm">
              {bedrooms} bedrooms • {bathrooms} bathrooms • {guests} guests
            </p>
          </div>
        </div>
        <Badge variant="outline" className="border-rose-200 text-rose-700 text-xs px-3 py-1 rounded-full">
          Superhost
        </Badge>
      </div>

      {/* Guest Favorite Section */}
      <div className="space-y-4 py-6 border-b border-gray-200">
        <div className="flex items-start gap-4">
          <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-rose-500" />
          </div>
          <div>
            <h4 className="font-medium text-base text-gray-900">Guest favorite</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              This is one of the most loved homes on Airbnb, according to guests.
            </p>
            <Button variant="link" className="p-0 h-auto text-sm text-gray-900 mt-2">
              See what makes us special <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="space-y-6 py-6 border-b border-gray-200">
        {[{
          icon: <Home className="w-5 h-5 text-rose-500" />,
          title: "Entire home to yourself",
          description: "You'll have the place all to yourself",
        }, {
          icon: <CalendarIcon className="w-5 h-5 text-rose-500" />,
          title: "Self check-in",
          description: "Check yourself in with the keypad",
        }, {
          icon: <CalendarIcon className="w-5 h-5 text-rose-500" />,
          title: "Free cancellation before Apr 12",
          description: "Get a full refund if you change your mind",
        }].map((item, i) => (
          <div key={i} className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
              {item.icon}
            </div>
            <div>
              <h4 className="font-medium text-base text-gray-900">{item.title}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Description */}
      <div className="space-y-4 py-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">About this place</h2>
        <p className="text-gray-700 leading-relaxed text-sm">
          {description || "Experience the perfect blend of comfort and luxury in this stunning property. Located in the heart of the city, this beautifully designed space offers everything you need for an unforgettable stay."}
        </p>
        <Button variant="ghost" className="p-0 h-auto text-gray-900 underline text-sm hover:no-underline">
          Show more <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>

      {/* Amenities */}
      <AmenitiesSection amenities={amenities} />

      {/* Calendar */}
      <div className="py-6" id="calendar">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Select check-in date</h2>
        <p className="text-gray-600 text-sm mb-4">Add your travel dates for exact pricing</p>
        <LargeDatePicker
          checkInDate={checkInDate}
          checkOutDate={checkOutDate}
          onCheckInSelect={onCheckInSelect}
          onCheckOutSelect={onCheckOutSelect}
        />
      </div>

      {/* Location */}
      <LocationSection location={location} />
    </div>
  );
}