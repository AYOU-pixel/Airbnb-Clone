
# 🏡 Airbnb Clone – Full-Featured Booking Platform

A full-featured booking platform inspired by Airbnb, built entirely from scratch in just one month. This project demonstrates a modern, responsive, and secure web application with robust features including authentication, wishlist management, instant booking, and Stripe-powered payments.

🔗 **Live Demo**: [airbnb-clone-eosin-sigma.vercel.app](https://airbnb-clone-eosin-sigma.vercel.app)

---

## 🚀 Features

- 🔐 **Secure Authentication** – Seamless login and session management via NextAuth.
- 💖 **Wishlist System** – Users can save favorite listings for quick access.
- ⚡ **Instant Booking** – Real-time availability and booking confirmation.
- 💳 **Stripe Integration** – Fast and secure payment processing.
- 🏷️ **Category Filtering** – Browse listings by type: Cabins, Treehouses, Glamping, Tiny Houses.
- 🌍 **Global Listings** – Discover unique stays across the United States.
- 🧾 **Host Dashboard** – Authenticated users can list and manage their own properties.
- 📱 **Responsive Design** – Optimized for mobile, tablet, and desktop devices.

---

## 🧰 Tech Stack

| Technology     | Role                                        |
|----------------|---------------------------------------------|
| **Next.js**     | React framework with SSR and routing        |
| **Tailwind CSS**| Utility-first styling for rapid UI design   |
| **Shadcn UI**   | Accessible, customizable UI components      |
| **MongoDB**     | NoSQL database for listings and users       |
| **Prisma**      | ORM for structured database interaction     |
| **Stripe**      | Payment gateway integration                 |
| **NextAuth**    | Authentication and session management       |

---

## 📦 Installation & Setup

```bash
git clone https://github.com/AYOU-pixel/Airbnb-Clone
cd airbnb-clone
npm install
```

Create a `.env` file and add your credentials:

```env
DATABASE_URL=your_mongodb_url
NEXTAUTH_SECRET=your_secret
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_PUBLIC_KEY=your_stripe_public
```

Run the following commands:

```bash
npx prisma generate
npx prisma migrate dev
npm run dev
```

---

## 👨‍💻 Developer

Crafted by **AYOUB** – a self-taught Full-Stack Developer focused on building elegant, secure, and high-performance web applications.

