// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { listings } from '../lib/mockListings';
 // Import mock data

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed process...');

  try {
    // 1. Delete existing data to prevent duplicates
    console.log('🗑️ Deleting existing data...');
    await prisma.reservation.deleteMany({}); // Optional: if you have reservations
    await prisma.listing.deleteMany({});
    console.log('✅ Existing data deleted.');

    // 2. Prepare the data for insertion
    // The mock data's `guests` field needs to be mapped to the schema's `maxGuests` field.
    // We also remove the 'id' as Prisma will generate it automatically.
    const listingData = listings.map(
      ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        id, // Exclude mock ID
        guests, // Rename to maxGuests
        ...rest
      }) => ({
        ...rest,
        maxGuests: guests, // Map guests to maxGuests
      }),
    );

    // 3. Create new listings using createMany for efficiency
    console.log(`📝 Creating ${listingData.length} new listings...`);
    const result = await prisma.listing.createMany({
      data: listingData,
    });

    // 4. Log the result
    console.log(`\n🎉 Successfully created ${result.count} listings!`);
  } catch (error) {
    console.error('❌ Error during seed process:', error);
    throw error;
  }
}

main()
  .then(async () => {
    console.log('✅ Seed process finished successfully!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed process failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });