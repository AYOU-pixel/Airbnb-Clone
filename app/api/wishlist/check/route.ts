// app/api/wishlist/check/route.ts
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

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    const wishlistItem = await prisma.wishlist.findUnique({
      where: {
        userId_listingId: {
          userId: user.id,
          listingId,
        },
      },
    });

    return NextResponse.json({ 
      isInWishlist: !!wishlistItem 
    });
  } catch (error) {
    console.error("❌ Check wishlist error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}