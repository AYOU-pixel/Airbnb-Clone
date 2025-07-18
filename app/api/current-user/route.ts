import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return new Response(JSON.stringify({ user: decoded }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err: unknown) {
    // تحديد نوع الخطأ باستخدام type guard
    if (err instanceof jwt.TokenExpiredError) {
      return new Response(JSON.stringify({ message: "Token expired" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    } else if (err instanceof jwt.JsonWebTokenError) {
      return new Response(JSON.stringify({ message: "Invalid token" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    // التعامل مع أي أخطاء أخرى غير متوقعة
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}




