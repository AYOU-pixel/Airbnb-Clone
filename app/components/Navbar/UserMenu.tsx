"use client";

import { useState } from "react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/app/components/ui/avatar";
import {
  Menu,
  Globe,
  User,
  Heart,
  Settings,
  HelpCircle,
  LogOut,
} from "lucide-react";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";

export function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useCurrentUser();

  const isLoggedIn = !!user;
  const userName = user?.name || "";

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    window.location.reload(); // يعيد تحميل الصفحة بدون التوكن
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      {/* زر المضيف */}
      <button className="hidden md:block text-xs sm:text-sm font-medium hover:bg-gray-100 px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors whitespace-nowrap">
        Become a host
      </button>

      {/* تغيير اللغة */}
      <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
        <Globe className="h-3 w-3 sm:h-4 sm:w-4" />
      </button>

      {/* القائمة المنسدلة */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger className="flex items-center gap-1 sm:gap-2 border border-gray-300 rounded-full px-1.5 sm:px-2 py-1 hover:shadow-md transition-shadow">
          <Menu className="w-3 h-3 sm:w-4 sm:h-4" />
          <Avatar className="w-5 h-5 sm:w-6 sm:h-6">
            <AvatarFallback className="bg-gray-500 text-white text-xs sm:text-sm">
              {isLoggedIn ? userName.charAt(0).toUpperCase() : (
                <User className="w-3 h-3" />
              )}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="mt-2 w-48 sm:w-56">
          {!isLoggedIn ? (
            <>
              <Link href="/login">
                <DropdownMenuItem className="font-medium cursor-pointer text-sm">
                  Log in
                </DropdownMenuItem>
              </Link>
              <Link href="/register">
                <DropdownMenuItem className="cursor-pointer text-sm">
                  Sign up
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
            </>
          ) : (
            <>
              <DropdownMenuItem className="font-medium text-sm">
                <User className="mr-2 h-4 w-4" />
                {userName}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
          )}

          <Link href="/wishlists">
            <DropdownMenuItem className="cursor-pointer text-sm">
              <Heart className="mr-2 h-4 w-4" />
              Wishlists
            </DropdownMenuItem>
          </Link>

          <Link href="/trips">
            <DropdownMenuItem className="cursor-pointer text-sm">
              Trips
            </DropdownMenuItem>
          </Link>

          <Link href="/messages">
            <DropdownMenuItem className="cursor-pointer text-sm">
              Messages
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <Link href="/manage">
            <DropdownMenuItem className="cursor-pointer text-sm">
              Manage listings
            </DropdownMenuItem>
          </Link>

          <Link href="/host">
            <DropdownMenuItem className="cursor-pointer text-sm">
              Host an experience
            </DropdownMenuItem>
          </Link>

          <DropdownMenuSeparator />

          <Link href="/account">
            <DropdownMenuItem className="cursor-pointer text-sm">
              <Settings className="mr-2 h-4 w-4" />
              Account settings
            </DropdownMenuItem>
          </Link>

          <Link href="/help">
            <DropdownMenuItem className="cursor-pointer text-sm">
              <HelpCircle className="mr-2 h-4 w-4" />
              Help Center
            </DropdownMenuItem>
          </Link>

          {isLoggedIn && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-red-600 text-sm"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}