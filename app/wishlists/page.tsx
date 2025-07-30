// app/wishlists/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import ListingCard from "@/app/components/listing/ListingCard";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function WishlistsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/signin');
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      wishlist: {
        include: {
          listing: true,
        },
        orderBy: {
          createdAt: 'desc', // Show newest wishlist items first
        },
      },
    },
  });

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
        <div className="text-center">
          <p className="text-gray-600">User not found.</p>
        </div>
      </div>
    );
  }

  if (user.wishlist.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Your Wishlist</h1>
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Start exploring and save your favorite places! Click the heart icon on listings to add them to your wishlist.
          </p>
          {/* FIX: Moved the Link component outside of the <p> tag */}
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors duration-200"
          >
            Start exploring
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
        <p className="text-gray-600">
          {user.wishlist.length} {user.wishlist.length === 1 ? 'place' : 'places'} saved
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {user.wishlist.map((item) => (
          <ListingCard
            key={item.listing.id}
            id={item.listing.id}
            title={item.listing.title}
            location={item.listing.location}
            images={item.listing.images}
            price={item.listing.price.toString()}
            rating={item.listing.rating }
            distance={item.listing.distance }
            dateRange={item.listing.dateRange }
            isNew={item.listing.isNew}
            guestFavorite={item.listing.guestFavorite}
            isInWishlist={true} // Important: Tell the component this item is in wishlist
          />
        ))}
      </div>
    </div>
  );
}
