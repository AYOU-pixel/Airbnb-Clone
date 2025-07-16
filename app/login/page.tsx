"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message || "Login failed."}`);
      } else {
        setMessage("✅ Login successful!");
        // 👉 هنا ممكن تعمل redirect أو حفظ الجلسة لاحقًا
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("❌ Error logging in.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
          Log in or sign up
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              id="email"
              type="text"
              placeholder="Email or Phone number"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p
              className={`text-sm text-center mb-4 ${
                message.startsWith("❌") ? "text-rose-600" : "text-green-600"
              }`}
            >
              {message}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold"
          >
            Continue
          </Button>
        </form>

        {/* باقي التصميم بدون تغيير */}
      </div>
    </div>
  );
}
