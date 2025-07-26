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

// types.ts
export type UserType = {
  _id: string;
  name: string;
  email: string;
};


// types/next-auth.d.ts
declare module "next-auth" {
  interface Session {
    user: {
      id: string; // Add id to the user object
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

