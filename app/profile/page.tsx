// app/profile/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { User, Calendar, MapPin, Mail } from "lucide-react";

export default function ProfilePage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    totalReservations: 0,
    upcomingTrips: 0,
    totalSpent: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/profile/stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to fetch profile stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchStats();
    }
  }, [session]);

  if (!session) return null;

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-lg p-6 text-white">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            {session.user?.image ? (
              <img
                src={session.user.image}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover"
              />
            ) : (
              <User className="w-10 h-10 text-white" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {session.user?.name || "User"}!
            </h1>
            <div className="flex items-center mt-2 text-white text-opacity-90">
              <Mail className="w-4 h-4 mr-2" />
              <span>{session.user?.email}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="w-8 h-8 text-rose-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Total Reservations</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stats.totalReservations}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <MapPin className="w-8 h-8 text-rose-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Upcoming Trips</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : stats.upcomingTrips}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-rose-500 font-bold">$</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? "..." : `$${stats.totalSpent.toFixed(2)}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Calendar className="w-6 h-6 text-rose-500" />
              <span>View Reservations</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <MapPin className="w-6 h-6 text-rose-500" />
              <span>Browse Listings</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <User className="w-6 h-6 text-rose-500" />
              <span>Edit Profile</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Mail className="w-6 h-6 text-rose-500" />
              <span>Contact Support</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-700">Name</span>
              <span className="font-medium">{session.user?.name || "Not provided"}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-700">Email</span>
              <span className="font-medium">{session.user?.email}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-200">
              <span className="text-gray-700">Member since</span>
              <span className="font-medium">
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                })}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}