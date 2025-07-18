// import { connectDB } from "@/lib/mongodb";

// export async function GET() {
//   await connectDB();
//   return new Response("connected to MongoDB", )}


import { cookies } from "next/headers";
import { connectDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: "All fields are required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Email is already registered" }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, email, password: hashedPassword });

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, name: newUser.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "1h" }
    );

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600, // 1 hour
      path: "/",
    });

    return new Response(JSON.stringify({ message: "Registration successful", user: { id: newUser._id, email: newUser.email, name: newUser.name } }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("⛔ Error in registration:", error);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}