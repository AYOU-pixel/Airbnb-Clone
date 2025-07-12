// Example structure (simplified)
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
// Assuming you have a DatePicker component from Shadcn/Radix setup
// import { DatePicker } from "@/components/ui/date-picker";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 pb-4 border-b border-gray-200">
          Sign up
        </h2>

        <form>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="firstName" className="sr-only">
                First Name
              </label>
              <Input
                id="firstName"
                type="text"
                placeholder="First Name"
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="sr-only">
                Last Name
              </label>
              <Input
                id="lastName"
                type="text"
                placeholder="Last Name"
                className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
          </div>

          <div className="mb-4">
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

          <div className="mb-6">
            <label htmlFor="confirmPassword" className="sr-only">
              Confirm Password
            </label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              className="w-full py-2 px-3 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Optional: Birthdate picker */}
          {/* <div className="mb-4">
            <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-1">
              Birthdate
            </label>
            <DatePicker />
            <p className="text-xs text-gray-500 mt-1">
              To sign up, you need to be at least 18. Other people won’t see your birthdate.
            </p>
          </div> */}

          <p className="text-xs text-gray-600 mb-6">
            By clicking Agree and continue, you agree to Airbnb&apos;s{" "}
            <a href="/terms" className="text-red-500 hover:underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="/privacy" className="text-red-500 hover:underline">
              Privacy Policy
            </a>
            .
          </p>

          <Button
            type="submit"
            className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-md font-semibold"
          >
            Agree and continue
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
            <span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/google.png" alt="Google" className="w-5 h-5" />
            </span>
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