// components/Navbar/Logo.tsx
'use client';

import Image from "next/image";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();
  
  return (
    <div
      onClick={() => router.push("/")}
      className="flex items-center cursor-pointer py-1 px-1 hover:opacity-80 transition-opacity"
    >
      <Image
        src="/images/Airbnb-logo.png"
        alt="Logo"
        width={70}
        height={70}
        className="object-contain w-16 h-16 sm:w-20 sm:h-20"
        priority
      />
    </div>
  );
};

export default Logo;