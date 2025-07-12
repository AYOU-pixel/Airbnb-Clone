// components/Navbar/NavTabs.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface TabItem {
  label: string;
  icon: string;
  badge?: string;
  href: string;
}

export default function NavTabs() {
  const pathname = usePathname();

  const tabs: TabItem[] = [
    { label: "Homes", icon: "🏠", href: "/" },
    { label: "Experiences", icon: "🎈", badge: "NEW", href: "/experiences" },
    { label: "Services", icon: "🛎️", badge: "NEW", href: "/services" },
  ];

  return (
    <nav className="flex items-center justify-center gap-1 sm:gap-3 md:gap-4">
      {tabs.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

        return (
          <Link
            key={item.label}
            href={item.href}
            className={`
              relative flex flex-col items-center gap-0.5 sm:gap-1
              px-1.5 py-1.5 sm:px-3 sm:py-2
              rounded-lg transition-all duration-200
              group hover:bg-gray-50
              ${isActive ? "text-red-500" : "text-gray-600 hover:text-gray-800"}
              min-w-0 flex-shrink-0
            `}
          >
            {/* Icon */}
            <span className="text-sm sm:text-base md:text-lg transition-transform duration-200 group-hover:scale-110">
              {item.icon}
            </span>

            {/* Label - smaller on mobile, hidden on very small screens */}
            <span className="hidden xs:block text-[10px] sm:text-xs font-medium whitespace-nowrap">
              {item.label}
            </span>

            {/* Badge */}
            {item.badge && (
              <span className="absolute -top-0.5 -right-0.5 text-[7px] sm:text-[8px] bg-red-500 text-white px-0.5 py-0.5 sm:px-1 rounded-full font-semibold leading-none">
                {item.badge}
              </span>
            )}

            {/* Active indicator */}
            <div className={`absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 h-0.5 bg-red-500 transition-all duration-200 ${
              isActive ? "w-3 sm:w-4 md:w-6" : "w-0"
            }`} />
          </Link>
        );
      })}
    </nav>
  );
}
