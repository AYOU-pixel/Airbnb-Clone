# 🏠 Airbnb Clone - Full-Stack Booking Platform

![Airbnb Clone](https://img.shields.io/badge/Airbnb-Clone-%23FF5A5F?style=for-the-badge&logo=airbnb&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)

## 🚀 Live Demo

**🔗 Live Website:** [airbnb-clone-eosin-sigma.vercel.app](https://airbnb-clone-eosin-sigma.vercel.app)

## 📋 Project Overview

A full-featured booking platform inspired by Airbnb, built entirely from scratch in just one month. This project demonstrates modern full-stack development practices with a complete suite of features including secure authentication, wishlist functionality, instant booking, and Stripe-powered payments.

## ✨ Key Features

### 🔐 Authentication & Security
- **Secure Login System** with NextAuth.js
- **Social Login** integration (Google, GitHub, etc.)
- **Protected Routes** and session management
- **Role-based access control**

### 💝 Wishlist & Favorites
- **Save favorite properties** to wishlist
- **Quick access** to saved listings
- **Persistent storage** across sessions

### 🏡 Property Management
- **List your property** with detailed forms
- **Image upload** and gallery management
- **Availability calendar** and pricing setup
- **Location-based search** with maps

### 💳 Booking & Payments
- **Instant booking system** with real-time availability
- **Secure payments** powered by Stripe
- **Booking confirmation** and email notifications
- **Reservation management** for hosts and guests

### 🔍 Search & Discovery
- **Advanced filtering** by price, location, amenities
- **Map integration** for location-based searches
- **Smart recommendations** based on user preferences

## 🛠️ Technology Stack

### Frontend
- **⚛️ Next.js 14** - React framework with App Router
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **📱 Shadcn/UI** - Reusable component library
- **🌐 TypeScript** - Type-safe JavaScript

### Backend & Database
- **🔐 NextAuth.js** - Authentication solution
- **🗄️ Prisma** - Modern ORM for database operations
- **🍃 MongoDB** - NoSQL database for scalable data storage

### Payments & External Services
- **💳 Stripe** - Payment processing and subscription management
- **🌍 Vercel** - Deployment and hosting platform

### Development Tools
- **ESLint & Prettier** - Code quality and formatting
- **Git & GitHub** - Version control and collaboration

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ installed
- MongoDB database
- Stripe account
- GitHub OAuth app (optional)

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AYOU-pixel/Airbnb-Clone
   cd airbnb-clone
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env.local` file with:
   ```env
   DATABASE_URL=
NEXTAUTH_URL=
NEXTAUTH_SECRET=
GITHUB_ID=
GITHUB_SECRET=
DATABASE_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

4. **Database Setup**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
airbnb-clone/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── (auth)/           # Authentication routes
│   ├── (main)/           # Main application routes
│   └── globals.css       # Global styles
├── components/            # Reusable components
│   ├── ui/               # Shadcn/ui components
│   ├── forms/            # Form components
│   └── modals/           # Modal components
├── lib/                  # Utility libraries
│   ├── auth.ts          # Authentication config
│   ├── db.ts            # Database connection
│   └── utils.ts         # Helper functions
├── prisma/               # Database schema
│   └── schema.prisma    # Prisma schema file
└── public/               # Static assets
```

## 🔧 API Routes

- `POST /api/auth/[...nextauth]` - Authentication
- `POST /api/properties` - Property management
- `GET /api/properties/search` - Property search
- `POST /api/reservations` - Booking management
- `POST /api/stripe/webhook` - Payment webhooks
- `POST /api/favorites` - Wishlist management

## 🎯 Key Components

### 🔐 Authentication System
- Custom login/register forms
- Social authentication providers
- Protected route middleware
- Session management

### 🏡 Property Components
- Property listing cards
- Image gallery with lightbox
- Date picker for availability
- Location search with autocomplete

### 💰 Payment Flow
- Stripe checkout integration
- Secure payment processing
- Booking confirmation system
- Host payout management

## 📊 Database Schema

The application uses MongoDB with Prisma ORM, featuring:
- **Users** with authentication profiles
- **Properties** with detailed listings
- **Reservations** with booking data
- **Favorites** for wishlist functionality
- **Reviews** and ratings system

## 🚀 Deployment

The project is deployed on **Vercel** with:
- **Automatic deployments** from main branch
- **Environment variables** configured in Vercel dashboard
- **Serverless functions** for API routes
- **Edge network** for optimal performance

## 🎨 UI/UX Features

- **Responsive design** for all devices
- **Dark/light mode** support
- **Smooth animations** and transitions
- **Accessibility** compliant (WCAG)
- **Loading states** and error handling

## 🔒 Security Features

- **CSRF protection** with NextAuth
- **Input validation** on all forms
- **SQL injection prevention** with Prisma
- **XSS protection** with React
- **Secure authentication** flows

## 🤝 Contributing

We welcome contributions! Please feel free to submit issues and enhancement requests.



## 👨‍💻 Developer

Built with ❤️ using modern web technologies in just one month.

---

**⭐ Star this repo if you found it helpful!**

**🔗 Live Demo:** [airbnb-clone-eosin-sigma.vercel.app](https://airbnb-clone-eosin-sigma.vercel.app)

---

*This project is for educational purposes and is not affiliated with Airbnb.*
