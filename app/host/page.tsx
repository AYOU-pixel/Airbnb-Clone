"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import Link from "next/link";
// Import modern icons
import { ListPlus, PartyPopper, Banknote, CheckCircle } from "lucide-react";

// Framer Motion variants for staggered animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
};

export default function HostPage() {
  return (
    <div className="w-full min-h-screen bg-white font-sans">
      {/* Hero Section */}
      <section className="relative h-[90vh] md:h-screen flex items-center justify-center">
        <Image
          src="/images/hero.jpg"
          alt="A bright and modern living room, ready for guests"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center text-white max-w-3xl px-4"
        >
          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
          >
            You could earn on Airbnb
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl mb-8 max-w-xl mx-auto"
          >
            Turn your space into a new source of income and join a community of millions of hosts.
          </motion.p>
          <motion.div variants={itemVariants}>
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-[#FF385C] text-white hover:bg-[#E01C4C] transition-colors duration-300 rounded-lg px-8 py-6 text-lg font-semibold"
              >
                Get Started
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Steps Section */}
      <section className="py-20 md:py-28 px-6 md:px-20 bg-gray-50/50">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-16">
            Hosting in 3 easy steps
          </h2>
        </motion.div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto"
        >
          {[
            {
              icon: <ListPlus size={36} className="text-[#FF385C]" />,
              title: "List your space for free",
              desc: "Share details like your location, amenities, and add at least 5 photos. We'll help you set a competitive price.",
            },
            {
              icon: <PartyPopper size={36} className="text-[#FF385C]" />,
              title: "Welcome your first guest",
              desc: "Manage your availability, accept bookings, and communicate with guests using our easy-to-use tools.",
            },
            {
              icon: <Banknote size={36} className="text-[#FF385C]" />,
              title: "Get paid, hassle-free",
              desc: "We handle all payments. You receive your money securely after guests check in.",
            },
          ].map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-300"
            >
              <div className="w-20 h-20 mx-auto mb-6 bg-[#FF385C]/10 rounded-full flex items-center justify-center">
                {step.icon}
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Benefits Section */}
      <section className="bg-white py-20 md:py-28 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/images/hose.jpg"
              alt="A smiling host handing keys to a guest"
              width={600}
              height={500}
              className="rounded-2xl object-cover shadow-2xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-gray-800">
              Why host on Airbnb?
            </h2>
            <ul className="space-y-5 text-lg text-gray-700">
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                You&apos;re in control of your availability, prices, and rules.
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                We&apos;re there for you with 24/7 support and our Host Guarantee.
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                Earn money securely through our trusted payment platform.
              </li>
              <li className="flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-green-500" />
                Join a global community of hosts and share your world.
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-[#E61E4D] to-[#D70466] text-white text-center py-20 md:py-24 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Ready to start hosting?
          </h2>
          <p className="mb-10 text-lg max-w-md mx-auto">
            It&apos;s free to list your space. Start earning and create new possibilities today.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-white text-black hover:bg-gray-200 transition-colors duration-300 rounded-lg px-8 py-6 text-lg font-semibold"
            >
              Become a Host
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}


