"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronUp, ChevronDown, Globe, Facebook, Instagram } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function AirbnbFooter() {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('');

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionTitle)
        ? prev.filter(title => title !== sectionTitle)
        : [...prev, sectionTitle]
    );
  };

  const footerSections: FooterSection[] = [
    {
      title: "Support",
      links: [
        { label: "Help Center", href: "/help" },
        { label: "Cancellation options", href: "/cancellation" },
      ]
    },
    {
      title: "Hosting",
      links: [
        { label: "Airbnb your home", href: "/host" },
      ]
    },
    {
      title: "Airbnb",
      links: [
        { label: "Newsroom", href: "/newsroom" },
        { label: "Careers", href: "/careers" },
      ]
    }
  ];

  const categoryLinks = [
    { label: "Cabins", location: "United States", href: "/cabins" },
    { label: "Treehouses", location: "United States", href: "/treehouses" },
    { label: "Glamping", location: "United States", href: "/glamping" },
    { label: "Tiny Houses", location: "United States", href: "/tinyhouses" },
  ];

  const languages = [
    { code: "en", label: "English (US)", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
  ];

  const currencies = [
    { code: "USD", label: "USD", symbol: "$" },
    { code: "EUR", label: "EUR", symbol: "€" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Navigation Categories - Enhanced Mobile */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="mb-4 sm:mb-6">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto pb-2 sm:pb-0">
              <Link
                href="/unique-stays"
                onClick={() => setActiveCategory('unique-stays')}
                className={`text-sm font-medium pb-2 whitespace-nowrap ${
                  activeCategory === 'unique-stays'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                } transition-colors duration-200`}
              >
                Unique stays
              </Link>
              <Link
                href="/categories"
                onClick={() => setActiveCategory('categories')}
                className={`text-sm font-medium pb-2 whitespace-nowrap ${
                  activeCategory === 'categories'
                    ? 'text-gray-900 border-b-2 border-gray-900'
                    : 'text-gray-500 hover:text-gray-900'
                } transition-colors duration-200`}
              >
                Categories
              </Link>
            </nav>
          </div>

          {/* Category Links Grid - Better Mobile Layout */}
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
            {categoryLinks.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="block group hover:bg-gray-100 p-2 -m-2 rounded-lg transition-colors duration-200"
              >
                <div className="text-sm font-medium text-gray-900 group-hover:underline transition-colors duration-200">
                  {category.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {category.location}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content - Enhanced Responsive */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-3 md:space-y-4">
              {/* Mobile Accordion Header - Better Touch Target */}
              <div className="md:hidden">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full text-left transition-colors duration-200 hover:bg-gray-100 px-3 py-3 -mx-3 rounded-lg"
                  aria-expanded={expandedSections.includes(section.title)}
                  aria-controls={`footer-section-${section.title}`}
                >
                  <h3 className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  {expandedSections.includes(section.title) ? (
                    <ChevronUp className="h-4 w-4 text-gray-500 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500 transition-transform duration-300" />
                  )}
                </button>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block">
                <h3 className="text-sm font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>

              {/* Links with Smooth Animation */}
              <div
                id={`footer-section-${section.title}`}
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  expandedSections.includes(section.title)
                    ? "max-h-96 opacity-100" 
                    : "max-h-0 opacity-0"
                } md:block md:opacity-100 md:max-h-full`}
              >
                <div className="space-y-2 md:space-y-3 pt-1 md:pt-0">
                  {section.links.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="block text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 hover:underline py-1"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar - Enhanced Mobile Layout */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Left Side - Copyright and Legal */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-sm text-gray-600">
                © 2025 Airbnb, Inc.
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200">
                  Terms
                </Link>
                <span className="text-gray-400">·</span>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 hover:underline transition-colors duration-200">
                  Privacy
                </Link>
              </div>
            </div>

            {/* Right Side - Language, Currency, and Social */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Language and Currency Selectors */}
              <div className="flex items-center space-x-2 sm:space-x-4">
                {/* Language Selector */}
                <Select defaultValue="en">
                  <SelectTrigger className="w-auto h-8 border-none bg-transparent hover:bg-gray-100 text-sm rounded-md transition-colors duration-200">
                    <div className="flex items-center space-x-2">
                      <Globe className="h-4 w-4" />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {languages.map((lang) => (
                      <SelectItem key={lang.code} value={lang.code}>
                        <div className="flex items-center space-x-2">
                          <span>{lang.flag}</span>
                          <span>{lang.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Currency Selector */}
                <Select defaultValue="USD">
                  <SelectTrigger className="w-auto h-8 border-none bg-transparent hover:bg-gray-100 text-sm rounded-md transition-colors duration-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {currencies.map((currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        <div className="flex items-center space-x-2">
                          <span>{currency.symbol}</span>
                          <span>{currency.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Social Media Links */}
              <div className="flex items-center space-x-2">
                <Link
                  href="https://facebook.com/airbnb"
                  className="p-2 text-gray-600 hover:text-white hover:bg-blue-600 rounded-full transition-all duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link
                  href="https://instagram.com/airbnb"
                  className="p-2 text-gray-600 hover:text-white hover:bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 rounded-full transition-all duration-200"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}