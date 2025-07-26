// scripts/updateMockListings.ts

// This script will automatically update mockListings.ts with real ObjectIds from the database.

import { PrismaClient } from '@prisma/client';
import { promises as fs } from 'fs';
import path from 'path';
// We import the mock data as a reference for the structure and titles.
import { listings as mockListingsArray } from '../lib/mockListings';


const prisma = new PrismaClient();

async function updateMockListings() {
  console.log('🔄 Starting to update the mock data file with real database IDs...');

  try {
    // 1. Fetch the real data from the database.
    const dbListings = await prisma.listing.findMany({
      select: {
        id: true,
        title: true, // We use the title as a key to link the mock and real data.
      },
    });

    if (dbListings.length === 0) {
      console.warn('⚠️ No listings found in the database. Halting the update.');
      return;
    }

    // 2. Create a Map for easy lookup (title -> real ID).
    const dbListingMap = new Map(dbListings.map((listing) => [listing.title, listing.id]));
    console.log(`🗺️ Map created for ${dbListingMap.size} listings from the database.`);

    // 3. Update the in-memory mock listings array with the new IDs.
    const updatedListings = mockListingsArray.map((mockListing) => {
      const dbId = dbListingMap.get(mockListing.title);
      if (dbId) {
        // If an ID is found, update the item.
        return { ...mockListing, id: dbId };
      }
      console.warn(`
        ⚠️ No match found in the database for the listing with title: "${mockListing.title}".
        The original mock ID will be kept: "${mockListing.id}".
        Please ensure the title in 'mockListings.ts' matches a listing title created in 'seed.ts'.
      `);
      return mockListing; // If no match is found, return the original item.
    });

    // 4. Recreate the entire content of the mockListings.ts file.
    const mockFilePath = path.join(__dirname, '../lib/mockListings.ts');

    // We preserve the interface definition and original comments at the top of the file.
    const originalFileContent = await fs.readFile(mockFilePath, 'utf8');
    const endOfInterfaceRegex = /(export interface Listing {[\s\S]*?}\r?\n)/;
    const match = originalFileContent.match(endOfInterfaceRegex);

    if (!match) {
        throw new Error("Could not find the 'Listing' interface definition in the file. Cannot proceed.");
    }
    
    const fileHeaderAndInterface = match[0];

    // Convert the updated array to a formatted string.
    // JSON.stringify is the easiest way, but it will slightly change the formatting (which is acceptable for an automated script).
    const newListingsString = JSON.stringify(updatedListings, null, 2);

    // Assemble the final file content.
    const newFileContent =
      fileHeaderAndInterface +
      `\nexport const listings: Listing[] = ${newListingsString};\n`;

    // 5. Write the updated content back to the file.
    await fs.writeFile(mockFilePath, newFileContent, 'utf8');

    console.log(`✅ Successfully updated '${path.basename(mockFilePath)}' with new database IDs!`);

  } catch (error) {
    console.error('❌ An error occurred while updating the mock data file:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateMockListings();