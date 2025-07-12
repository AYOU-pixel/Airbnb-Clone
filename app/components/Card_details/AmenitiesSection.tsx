// app/listing/[id]/components/AmenitiesSection.tsx
import React from 'react'; // Import React for React.ElementType
import {
  Wifi,
  Tv,
  Snowflake,
  Waves,
  Lock,
  Utensils,
  Coffee,
  Baby,
  Thermometer,
  Dumbbell,
  ParkingCircle,
  FireExtinguisher,
} from "lucide-react";
import { Button } from "@/app/components/ui/button";

export default function AmenitiesSection({ amenities }: { amenities: string[] }) {
  // Define the type for the icon map to be more specific than 'any'
  // React.ElementType is the correct type for a React component that can be rendered
  const getAmenityIcon = (amenity: string) => {
    const iconMap: { [key: string]: React.ElementType } = {
      "WiFi": Wifi,
      "Parking": ParkingCircle,
      "Free Parking": ParkingCircle,
      "Kitchen": Utensils,
      "Kitchenette": Utensils,
      "TV": Tv,
      "Air conditioning": Snowflake,
      "Pool": Waves,
      "Beach Access": Waves,
      "Security": Lock,
      "Gym": Dumbbell,
      "Dedicated workspace": Wifi,
      "Self check-in": Lock,
      "Essentials": Coffee,
      "Heating": Thermometer,
      "Fire extinguisher": FireExtinguisher,
      "Kids friendly": Baby,
      // You can add more mappings here as needed for other amenities
    };
    return iconMap[amenity] || null;
  };

  return (
    <div id="amenities" className="space-y-6 py-6 border-b border-gray-200">
      <h2 className="text-xl font-semibold">What this place offers</h2>
      <div className="grid grid-cols-2 gap-4">
        {amenities?.map((amenity, index) => {
          const IconComponent = getAmenityIcon(amenity);
          return (
            <div key={index} className="flex items-center gap-3 py-2">
              {IconComponent && (
                <IconComponent className="w-5 h-5 text-gray-700" />
              )}
              <span className="text-gray-700">{amenity}</span>
            </div>
          );
        })}
      </div>
      <Button variant="outline" className="mt-4">
        Show all {amenities?.length || 20} amenities
      </Button>
    </div>
  );
}