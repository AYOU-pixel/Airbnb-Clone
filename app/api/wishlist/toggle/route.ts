// app/api/wishlist/toggle/route.ts
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { listingId } = body;

    if (!listingId) {
      return new NextResponse("Missing listingId", { status: 400 });
    }

    // Verify listing exists
    const listingExists = await prisma.listing.findUnique({
      where: { id: listingId },
      select: { id: true },
    });

    if (!listingExists) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const existing = await prisma.wishlist.findUnique({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId,
        },
      },
    });

    if (existing) {
      // Remove from wishlist
      await prisma.wishlist.delete({
        where: {
          userId_listingId: {
            userId: user.id,
            listingId,
          },
        },
      });
      
      console.log(`✅ Removed from wishlist: user ${user.id}, listing ${listingId}`);
      return NextResponse.json({ 
        removed: true, 
        isInWishlist: false,
        message: "Removed from wishlist" 
      });
    } else {
      // Add to wishlist
      await prisma.wishlist.create({
        data: {
          userId: user.id,
          listingId,
        },
      });
      
      console.log(`✅ Added to wishlist: user ${user.id}, listing ${listingId}`);
      return NextResponse.json({ 
        added: true, 
        isInWishlist: true,
        message: "Added to wishlist" 
      });
    }
  } catch (error) {
    console.error("❌ Wishlist toggle error:", error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes("Foreign key constraint")) {
        return new NextResponse("Invalid listing or user ID", { status: 400 });
      }
    }
    
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}