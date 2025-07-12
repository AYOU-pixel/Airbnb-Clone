// app/HomePage.tsx (or app/page.tsx if this is your root page)
import { listings } from "@/lib/mockListings"; // Ensure this path is correct
import ListingCard from "@/app/components/listing/ListingCard"; // Ensure this path is correct

export default function HomePage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-8">
        {listings.map((item) => (
          <ListingCard
            key={item.id}
            id={item.id} // Pass ID
            title={item.title}
            location={item.location}
            images={item.images} // Pass the array of images
            price={item.price.toString()} // Convert price to string
            rating={item.rating}
            distance={item.distance}
            dateRange={item.dateRange}
            isNew={item.isNew} // Ensure these are also passed if needed
            guestFavorite={item.guestFavorite} // Ensure these are also passed if needed
          />
        ))}
      </div>
    </main>
  );
}
