// app/api/messages/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

// ✅ GET: Fetch all messages between two users
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const otherUserId = searchParams.get("otherUserId");

  if (!userId || !otherUserId) {
    return new NextResponse("Missing userId or otherUserId parameters", { status: 400 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: userId },
        ],
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ✅ POST: Send a new message
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const body = await req.json();
    const { receiverId, content, listingId } = body;

    if (!receiverId || !content) {
      return new NextResponse("Missing receiverId or content", { status: 400 });
    }

    // Validate content length
    if (content.length > 1000) {
      return new NextResponse("Message too long", { status: 400 });
    }

    const sender = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!sender) {
      return new NextResponse("Sender not found", { status: 404 });
    }

    // Verify receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId },
      select: { id: true },
    });

    if (!receiver) {
      return new NextResponse("Receiver not found", { status: 404 });
    }

    // Verify listing exists if provided
    if (listingId) {
      const listing = await prisma.listing.findUnique({
        where: { id: listingId },
        select: { id: true },
      });

      if (!listing) {
        return new NextResponse("Listing not found", { status: 404 });
      }
    }

    const message = await prisma.message.create({
      data: {
        senderId: sender.id,
        receiverId,
        content: content.trim(),
        listingId,
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        receiver: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        listing: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// ✅ DELETE: Delete a message (optional feature)
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return new NextResponse("Missing messageId", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Only allow deleting own messages
    const message = await prisma.message.findFirst({
      where: {
        id: messageId,
        senderId: user.id,
      },
    });

    if (!message) {
      return new NextResponse("Message not found or not authorized", { status: 404 });
    }

    await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
