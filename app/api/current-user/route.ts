import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/app/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "N1Zd8e8LrFci0FTD0xY2";

export async function GET() {
  try {
    const cookieStore = await cookies(); // ⬅️ await ضروري هنا
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return new Response(JSON.stringify({ message: "Not authenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };

    await connectDB();

    const user = await User.findById(decoded.userId).select("-password");

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("⛔ Auth error:", error);

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

