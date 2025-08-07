// app/api/conversations/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Get all unique users that have conversations with current user
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUser.id },
          { receiverId: currentUser.id },
        ],
      },
      select: {
        senderId: true,
        receiverId: true,
        createdAt: true,
        content: true,
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
      },
      orderBy: { createdAt: "desc" },
    });

    // Get unique conversation partners
    const conversationMap = new Map();
    
    conversations.forEach((message) => {
      const otherUser = message.senderId === currentUser.id 
        ? message.receiver 
        : message.sender;
      
      if (!conversationMap.has(otherUser.id)) {
        conversationMap.set(otherUser.id, {
          ...otherUser,
          lastMessage: message.content,
          lastMessageDate: message.createdAt,
        });
      }
    });

    const uniqueConversations = Array.from(conversationMap.values());

    return NextResponse.json(uniqueConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
