"use client";

import { useState } from "react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("❌ Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName} ${lastName}`,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.message || "Something went wrong."}`);
      } else {
        setMessage("✅ Registration successful!");
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      setMessage("❌ Failed to register.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
          Sign up
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
            <Input
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <Input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          {message && (
            <p className={`text-sm text-center mb-4 ${message.startsWith('❌') ? 'text-rose-600' : 'text-green-600'}`}>{message}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold"
          >
            Agree and continue
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <span className="absolute bg-white px-2 text-gray-500 text-sm">or</span>
          <div className="w-full border-t border-gray-200"></div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <img src="/images/facebook.png" alt="Facebook" className="w-5 h-5" />
            <span>Continue with Facebook</span>
          </Button>
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <img src="/images/google.png" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </Button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-red-500 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}
