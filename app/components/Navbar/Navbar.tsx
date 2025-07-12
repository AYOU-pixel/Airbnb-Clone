// components/Navbar/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Logo from "./Logo";
import NavTabs from "./NavTabs";
import { AirbnbSearchBar } from "../filters/SearchBar";
import { UserMenu } from "./UserMenu";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [searchExpanded, setSearchExpanded] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full bg-white sticky top-0 z-50 transition-shadow duration-300 ${
        scrolled ? "shadow-md border-b border-gray-200" : "shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        {/* Main navbar */}
        <div className="flex items-center justify-between py-2 sm:py-3">
          {/* Logo - smaller on mobile */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Navigation tabs - hidden on mobile when search is expanded */}
          <div className={`flex-1 flex justify-center mx-2 sm:mx-4 transition-all duration-300 ${
            searchExpanded ? "hidden sm:flex" : "flex"
          }`}>
            <NavTabs />
          </div>

          {/* User menu */}
          <div className="flex-shrink-0">
            <UserMenu />
          </div>
        </div>

        {/* Search bar */}
        <div className={`transition-all duration-300 ${
          searchExpanded ? "pb-4 sm:pb-6" : "pb-2 sm:pb-4"
        }`}>
          <AirbnbSearchBar
            onExpand={setSearchExpanded}
            expanded={searchExpanded}
          />
        </div>
      </div>
    </header>
  );
}