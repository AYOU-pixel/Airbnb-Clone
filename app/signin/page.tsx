//signin/page.tsx
"use client";
import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";


function SignInForm() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setMessage("❌ Invalid credentials");
      } else {
        setMessage("✅ Login successful!");
        await getSession();
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage("❌ Error logging in");
    } finally {
      setLoading(false);
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
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
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
              disabled={loading}
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
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Continue"}
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <span className="absolute bg-white px-2 text-gray-500 text-sm">or</span>
          <div className="w-full border-t border-gray-200"></div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn("github")}
            disabled={loading}
          >
            <img src="/images/github.png" alt="GitHub" className="w-5 h-5" />
            <span>Continue with GitHub</span>
          </Button>
          <Button
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
            onClick={() => signIn("google")}
            disabled={loading}
          >
            <img src="/images/google.png" alt="Google" className="w-5 h-5" />
            <span>Continue with Google</span>
          </Button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-center mt-10">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
