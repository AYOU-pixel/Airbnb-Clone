import { Nunito } from "next/font/google";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/Navbar/Navbar";
import { AirbnbFooter } from "@/app/components/footer/Footer";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
})


export const metadata: Metadata = {
  title: "Airbnb ",
  description: "Airbnb clone ",
   icons: {
    icon: "/images/airbnb.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nunito.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        <div className="min-h-screen flex flex-col">
          <div className="flex-1">
            {children}
          </div>
          <AirbnbFooter />
        </div>
      </body>
    </html>
  );
}
