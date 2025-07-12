export interface Listing {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: number; // Changed from string to number
  rating: number;
  distance: string;
  dateRange: string;
  isNew?: boolean;
  guestFavorite?: boolean;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  reviews: number;
  host: string;
  guests: number;
}