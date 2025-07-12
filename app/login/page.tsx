// Example structure (simplified)
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
          Log in or sign up
        </h2>

        <form>
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email or Phone Number
            </label>
            <Input
              id="email"
              type="text"
              placeholder="Email or Phone number"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="sr-only">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Password"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold"
          >
            Continue
          </Button>
        </form>

        <div className="relative flex items-center justify-center my-6">
          <span className="absolute bg-white px-2 text-gray-500 text-sm">
            or
          </span>
          <div className="w-full border-t border-gray-200"></div>
        </div>

        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full border border-gray-300 py-3 text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2"
          >
            {/* Replace with actual icons */}
            <span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/facebook.png" alt="Facebook" className="w-5 h-5" />
            </span>
            <span>Continue with Facebook</span>
          </Button>
          <Button
            variant="outline"
            className="w-full border border-gray-300 py-3 text-gray-700 hover:bg-gray-50 flex items-center justify-center space-x-2"
          >
            {/* Replace with actual icons */}
            <span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/google.png" alt="Google" className="w-5 h-5" />
            </span>
            <span>Continue with Google</span>
          </Button>
          {/* Add more social login buttons */}
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Don&apos;t have an account?{" "}
          <a href="/register" className="text-red-500 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}