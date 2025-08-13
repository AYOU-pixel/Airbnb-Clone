import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json(
      { 
        success: false, 
        error: "Unauthorized",
        message: "You must be signed in to update your account" 
      },
      { status: 401 }
    );
  }

  try {
    const { name, image, phone } = await req.json();

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(image && { image: image.trim() }),
        phone: phone?.trim() || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: "Account updated successfully",
    });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("ACCOUNT_UPDATE_ERROR", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal Server Error",
        message: "Failed to update account",
      },
      { status: 500 }
    );
  }
}
