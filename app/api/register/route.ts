// import { connectDB } from "@/lib/mongodb";

// export async function GET() {
//   await connectDB();
//   return new Response("connected to MongoDB", )}


import { connectDB } from "@/lib/mongodb";
import User from "@/app/models/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    // ✅ تحقق من الحقول الفارغة
    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: "All fields are required." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ اتصال بـ MongoDB
    await connectDB();

    // ✅ تحقق واش الإيميل مسجل من قبل
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Email is already registered." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // ✅ تشفير كلمة السر
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ إنشاء المستخدم
    await User.create({ name, email, password: hashedPassword });

    return new Response(JSON.stringify({ message: "Registration successful ✅" }), {
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