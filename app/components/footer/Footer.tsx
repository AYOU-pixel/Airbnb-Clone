// components/footer/AirbnbFooter.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ChevronUp, 
  ChevronDown, 
  Globe, 
  Facebook, 
  Twitter, 
  Instagram 
} from "lucide-react";
import { Button } from "@/app/components/ui/button";
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
        { label: "AirCover", href: "/aircover" },
        { label: "Anti-discrimination", href: "/anti-discrimination" },
        { label: "Disability support", href: "/disability-support" },
        { label: "Cancellation options", href: "/cancellation-options" },
        { label: "Report neighborhood concern", href: "/report-concern" },
      ]
    },
    {
      title: "Hosting",
      links: [
        { label: "Airbnb your home", href: "/host" },
        { label: "Airbnb your experience", href: "/host/experiences" },
        { label: "Airbnb your service", href: "/host/services" },
        { label: "AirCover for Hosts", href: "/host/aircover" },
        { label: "Hosting resources", href: "/host/resources" },
        { label: "Community forum", href: "/community" },
        { label: "Hosting responsibly", href: "/host/responsibly" },
        { label: "Airbnb-friendly apartments", href: "/host/apartments" },
        { label: "Join a free Hosting class", href: "/host/class" },
        { label: "Find a co-host", href: "/host/co-host" },
      ]
    },
    {
      title: "Airbnb",
      links: [
        { label: "2025 Summer Release", href: "/release/2025-summer" },
        { label: "Newsroom", href: "/newsroom" },
        { label: "Careers", href: "/careers" },
        { label: "Investors", href: "/investors" },
        { label: "Gift cards", href: "/gift-cards" },
        { label: "Airbnb.org emergency stays", href: "/airbnb-org" },
      ]
    }
  ];

  const categoryLinks = [
    { label: "Cabins", location: "United States", href: "/cabins" },
    { label: "Treehouses", location: "United States", href: "/treehouses" },
    { label: "Glamping", location: "United States", href: "/glamping" },
    { label: "Tiny Houses", location: "United States", href: "/tiny-houses" },
    { label: "Beach Houses", location: "United States", href: "/beach-houses" },
    { label: "Campers and RVs", location: "United States", href: "/campers-rvs" },
    { label: "Lakehouses", location: "United States", href: "/lakehouses" },
    { label: "Yurt Rentals", location: "United States", href: "/yurt-rentals" },
    { label: "Yurt Rentals", location: "United Kingdom", href: "/yurt-rentals-uk" },
    { label: "Castle Rentals", location: "United States", href: "/castle-rentals" },
    { label: "Houseboats", location: "United States", href: "/houseboats" },
    { label: "Holiday Caravans", location: "United Kingdom", href: "/holiday-caravans" },
    { label: "Private Island Rentals", location: "United States", href: "/private-islands" },
    { label: "Farm Houses", location: "United States", href: "/farm-houses" },
    { label: "Farm Cottages", location: "United Kingdom", href: "/farm-cottages" },
    { label: "Cabin Rentals", location: "Australia", href: "/cabin-rentals-australia" },
    { label: "Luxury Cabins", location: "United Kingdom", href: "/luxury-cabins" },
  ];

  const languages = [
    { code: "en", label: "English (US)", flag: "🇺🇸" },
    { code: "es", label: "Español", flag: "🇪🇸" },
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "de", label: "Deutsch", flag: "🇩🇪" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
    { code: "pt", label: "Português", flag: "🇵🇹" },
    { code: "ja", label: "日本語", flag: "🇯🇵" },
    { code: "ko", label: "한국어", flag: "🇰🇷" },
    { code: "zh", label: "中文", flag: "🇨🇳" },
  ];

  const currencies = [
    { code: "USD", label: "USD", symbol: "$" },
    { code: "EUR", label: "EUR", symbol: "€" },
    { code: "GBP", label: "GBP", symbol: "£" },
    { code: "JPY", label: "JPY", symbol: "¥" },
    { code: "CAD", label: "CAD", symbol: "C$" },
    { code: "AUD", label: "AUD", symbol: "A$" },
    { code: "CHF", label: "CHF", symbol: "CHF" },
    { code: "SEK", label: "SEK", symbol: "kr" },
    { code: "NOK", label: "NOK", symbol: "kr" },
    { code: "DKK", label: "DKK", symbol: "kr" },
  ];

  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      {/* Navigation Categories */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <nav className="flex space-x-8">
              <Link 
                href="/unique-stays" 
                className="text-sm font-medium text-gray-900 border-b-2 border-gray-900 pb-2"
              >
                Unique stays
              </Link>
              <Link 
                href="/categories" 
                className="text-sm font-medium text-gray-500 hover:text-gray-900 pb-2"
              >
                Categories
              </Link>
              <Link 
                href="/travel-tips" 
                className="text-sm font-medium text-gray-500 hover:text-gray-900 pb-2"
              >
                Travel tips & inspiration
              </Link>
              <Link 
                href="/apartments" 
                className="text-sm font-medium text-gray-500 hover:text-gray-900 pb-2"
              >
                Airbnb-friendly apartments
              </Link>
            </nav>
          </div>

          {/* Category Links Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {categoryLinks.map((category, index) => (
              <Link
                key={index}
                href={category.href}
                className="block group"
              >
                <div className="text-sm font-medium text-gray-900 hover:underline">
                  {category.label}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {category.location}
                </div>
              </Link>
            ))}
          </div>

          {/* Show More Button */}
          <div className="mt-6">
            <Button
              variant="outline"
              className="text-sm font-medium text-gray-900 bg-white hover:bg-gray-50 border-gray-300"
            >
              Show more
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerSections.map((section) => (
            <div key={section.title} className="space-y-4">
              {/* Mobile Accordion Header */}
              <div className="md:hidden">
                <button
                  onClick={() => toggleSection(section.title)}
                  className="flex items-center justify-between w-full text-left"
                >
                  <h3 className="text-sm font-semibold text-gray-900">
                    {section.title}
                  </h3>
                  {expandedSections.includes(section.title) ? (
                    <ChevronUp className="h-4 w-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  )}
                </button>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block">
                <h3 className="text-sm font-semibold text-gray-900">
                  {section.title}
                </h3>
              </div>

              {/* Links */}
              <div className={`space-y-3 ${
                expandedSections.includes(section.title) ? 'block' : 'hidden'
              } md:block`}>
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm text-gray-600 hover:text-gray-900 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Left Side - Copyright and Legal */}
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="text-sm text-gray-600">
                © 2025 Airbnb, Inc.
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <Link href="/terms" className="text-gray-600 hover:text-gray-900 hover:underline">
                  Terms
                </Link>
                <span className="text-gray-400">·</span>
                <Link href="/sitemap" className="text-gray-600 hover:text-gray-900 hover:underline">
                  Sitemap
                </Link>
                <span className="text-gray-400">·</span>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-900 hover:underline">
                  Privacy
                </Link>
                <span className="text-gray-400">·</span>
                <Link href="/privacy-choices" className="text-gray-600 hover:text-gray-900 hover:underline flex items-center">
                  Your Privacy Choices
                  <div className="ml-1 w-4 h-4 bg-blue-600 rounded-sm flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right Side - Language, Currency, and Social */}
            <div className="flex items-center space-x-4">
              {/* Language Selector */}
              <Select defaultValue="en">
                <SelectTrigger className="w-auto h-8 border-none bg-transparent hover:bg-gray-50 text-sm">
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
                <SelectTrigger className="w-auto h-8 border-none bg-transparent hover:bg-gray-50 text-sm">
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

              {/* Social Media Links */}
              <div className="flex items-center space-x-2">
                <Link 
                  href="https://facebook.com/airbnb" 
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                </Link>
                <Link 
                  href="https://twitter.com/airbnb" 
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link 
                  href="https://instagram.com/airbnb" 
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
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