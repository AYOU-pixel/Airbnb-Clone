"use client";
import { JSX, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  MessageCircle, 
  Phone, 
  Clock, 
  ChevronRight,
  Home,
  CreditCard,
  Shield,
  Car,
  Users,
  Settings,
  FileText,
  Globe,
  Star,
  CheckCircle,
  X
} from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Badge } from "@/app/components/ui/badge";

interface Category {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  color: string;
  articles: number;
}

interface Article {
  title: string;
  category: string;
  views: string;
  helpful: number;
}

interface QuickAction {
  title: string;
  description: string;
  icon: JSX.Element;
  action: () => void;
  available: boolean;
}

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  const categories: Category[] = [
    {
      id: "getting-started",
      title: "Getting started",
      description: "Learn the basics of using our platform",
      icon: <Home className="h-6 w-6" />,
      color: "bg-blue-100 text-blue-600",
      articles: 24
    },
    {
      id: "booking",
      title: "Booking & reservations",
      description: "How to book and manage your reservations",
      icon: <CreditCard className="h-6 w-6" />,
      color: "bg-green-100 text-green-600",
      articles: 18
    },
    {
      id: "hosting",
      title: "Hosting",
      description: "Everything about becoming and being a host",
      icon: <Users className="h-6 w-6" />,
      color: "bg-purple-100 text-purple-600",
      articles: 32
    },
    {
      id: "safety",
      title: "Safety & security",
      description: "Stay safe and secure on our platform",
      icon: <Shield className="h-6 w-6" />,
      color: "bg-red-100 text-red-600",
      articles: 15
    },
    {
      id: "travel",
      title: "Travel & experiences",
      description: "Make the most of your trips",
      icon: <Car className="h-6 w-6" />,
      color: "bg-yellow-100 text-yellow-600",
      articles: 21
    },
    {
      id: "account",
      title: "Account & profile",
      description: "Manage your account settings",
      icon: <Settings className="h-6 w-6" />,
      color: "bg-indigo-100 text-indigo-600",
      articles: 12
    }
  ];

  const popularArticles: Article[] = [
    {
      title: "How do I cancel a reservation?",
      category: "Booking & reservations",
      views: "15.2k views",
      helpful: 94
    },
    {
      title: "What is the cancellation policy?",
      category: "Booking & reservations",
      views: "12.8k views",
      helpful: 91
    },
    {
      title: "How to contact my host",
      category: "Travel & experiences",
      views: "10.5k views",
      helpful: 89
    },
    {
      title: "Setting up your listing",
      category: "Hosting",
      views: "9.3k views",
      helpful: 92
    },
    {
      title: "Payment methods and billing",
      category: "Account & profile",
      views: "8.7k views",
      helpful: 88
    }
  ];

  const quickActions: QuickAction[] = [
    {
      title: "Message us",
      description: "Get help from our support team",
      icon: <MessageCircle className="h-5 w-5" />,
      action: () => setShowContactModal(true),
      available: true
    },
    {
      title: "Call us",
      description: "Speak with a support agent",
      icon: <Phone className="h-5 w-5" />,
      action: () => setShowContactModal(true),
      available: true
    },
    {
      title: "Community forum",
      description: "Ask the community",
      icon: <Users className="h-5 w-5" />,
      action: () => window.open("https://community.example.com", "_blank"),
      available: true
    }
  ];

  const filteredCategories = categories.filter(category =>
    category.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = selectedCategory
    ? popularArticles.filter(article => article.category === categories.find(cat => cat.id === selectedCategory)?.title)
    : popularArticles;

  const ContactModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Contact Support</h2>
          <button
            onClick={() => setShowContactModal(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            aria-label="Close contact modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-full">
                    <MessageCircle className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">Live Chat</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Average response: 2 mins</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    Available
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <Phone className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">Phone Support</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">+1 (555) 123-4567</p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    24/7
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-100 rounded-full">
                    <Globe className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">Community Forum</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Ask the community</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>Our support team is available 24/7 to help you</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            How can we help?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto"
          >
            Find answers to your questions, get support, and learn how to make the most of your experience.
          </motion.p>
          
          {/* Search Bar */}
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-xl mx-auto"
          >
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg border-2 border-gray-200 dark:border-gray-600 rounded-full focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 ease-in-out hover:shadow-md focus:shadow-lg"
              aria-label="Search help articles"
            />
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Actions */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Get help quickly
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow duration-300"
                      onClick={action.action}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            {action.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {action.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {action.description}
                            </p>
                          </div>
                          {action.available && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Available
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Categories */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Browse by topic
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredCategories.map((category, index) => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card 
                      className="cursor-pointer hover:shadow-md transition-shadow group"
                      onClick={() => setSelectedCategory(category.id)}
                      aria-label={`Select ${category.title} category`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className={`p-3 rounded-lg ${category.color}`}>
                            {category.icon}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {category.title}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3">
                              {category.description}
                            </p>
                            <div className="flex items-center text-sm text-gray-400">
                              <FileText className="h-4 w-4 mr-1" />
                              {category.articles} articles
                            </div>
                          </div>
                          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Selected Category Articles */}
            {selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  {categories.find(cat => cat.id === selectedCategory)?.title} Articles
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredArticles.map((article, index) => (
                        <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {article.title}
                              </h3>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>{article.category}</span>
                                <span>{article.views}</span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span>{article.helpful}% helpful</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSelectedCategory(null)}
                  aria-label="Back to all categories"
                >
                  Back to all categories
                </Button>
              </motion.div>
            )}

            {/* Popular Articles */}
            {!selectedCategory && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mb-8"
              >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                  Popular articles
                </h2>
                <Card>
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200 dark:divide-gray-700">
                      {popularArticles.map((article, index) => (
                        <div key={index} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer group">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                {article.title}
                              </h3>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <span>{article.category}</span>
                                <span>{article.views}</span>
                                <div className="flex items-center">
                                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                  <span>{article.helpful}% helpful</span>
                                </div>
                              </div>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="space-y-6">
              {/* Status Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>System Status</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Platform</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Payments</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Operational
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">Messaging</span>
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                        Degraded
                      </Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-4" size="sm">
                    View Status Page
                  </Button>
                </CardContent>
              </Card>

              {/* Community Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">1.2M+</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Active users</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">50K+</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Help articles</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Satisfaction rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Links */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Link href="/terms" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Terms of Service
                    </Link>
                    <Link href="/privacy" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Privacy Policy
                    </Link>
                    <Link href="/cancellation" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Cancellation Policy
                    </Link>
                    <Link href="/careers" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Careers
                    </Link>
                    <Link href="/newsroom" className="block text-sm text-blue-600 dark:text-blue-400 hover:underline">
                      Newsroom
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Modal */}
      <AnimatePresence>
        {showContactModal && <ContactModal />}
      </AnimatePresence>

      {/* Footer CTA */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Still need help?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Our support team is here to help you 24/7
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => setShowContactModal(true)} 
              className="flex items-center hover:scale-105 transition-transform duration-200"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Contact Support
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center hover:scale-105 transition-transform duration-200"
            >
              <Users className="h-4 w-4 mr-2" />
              Community Forum
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
