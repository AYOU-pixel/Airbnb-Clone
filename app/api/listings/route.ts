// app/api/listings/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server'; // ✅ إضافة النوع الصحيح

// ✅ التحقق من ObjectId
function isValidObjectId(id: string): boolean {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}

export async function GET(
  _req: NextRequest, // ✅ استخدام NextRequest مع _req لعدم استعماله
  context: { params: { id: string } } // ✅ اسم أوضح
) {
  const id = context.params.id;

  try {
    console.log('🔵 Fetching listing with ID:', id);

    // ✅ تحقق من تنسيق ObjectId
    if (!isValidObjectId(id)) {
      console.log('❌ Invalid ObjectId format:', id);
      return NextResponse.json({ 
        error: 'Invalid listing ID format',
        details: `Provided ID "${id}" is not a valid MongoDB ObjectId.`
      }, { status: 400 });
    }

    const listing = await prisma.listing.findUnique({
      where: { id },
    });

    if (!listing) {
      console.log('❌ Listing not found:', id);
      return NextResponse.json({ 
        error: 'Listing not found',
        details: `No listing found with ID "${id}".`
      }, { status: 404 });
    }

    console.log('✅ Listing found:', listing.title);

    return NextResponse.json(listing, { status: 200 });
  } catch (error) {
    console.error('❌ Fetch Listing Error:', error);

    return NextResponse.json({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
