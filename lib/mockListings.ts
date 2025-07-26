export interface Listing {
  id: string;
  title: string;
  location: string;
  images: string[];
  price: number; // Changed from string to number
  rating: number;
  distance: string;
  dateRange: string;
  isNew?: boolean;
  guestFavorite?: boolean;
  bedrooms: number;
  bathrooms: number;
  description: string;
  amenities: string[];
  reviews: number;
  host: string;
  guests: number;
}

export const listings: Listing[] = [
  {
    "id": "68851abe9dddd51108903b4d",
    "title": "Cozy Beachfront Studio",
    "location": "Malibu, CA",
    "images": [
      "pexels-heyho-7045712_gnxdwl.jpg",
      "pexels-heyho-7214173_aro7pz.jpg",
      "pexels-heyho-6283961_jta0rt.jpg",
      "pexels-fotoaibe-1571460_c58cfg.jpg"
    ],
    "price": 350,
    "rating": 4.8,
    "distance": "5 miles away",
    "dateRange": "Jul 10 - 15",
    "isNew": true,
    "guestFavorite": true,
    "bedrooms": 1,
    "bathrooms": 1,
    "description": "A cozy studio right on the beach, perfect for a romantic getaway with stunning ocean views and direct beach access.",
    "amenities": [
      "WiFi",
      "Kitchenette",
      "Beach Access",
      "Free Parking"
    ],
    "reviews": 128,
    "host": "Sarah Johnson",
    "guests": 2
  },
  {
    "id": "68851abe9dddd51108903b4e",
    "title": "Historic Downtown Loft",
    "location": "Charleston, SC",
    "images": [
      "pexels-pixabay-271624_pbdqiv.jpg",
      "pexels-heyho-6315808_rnkoc1.jpg",
      "pexels-heyho-6121091_hkwksw.jpg"
    ],
    "price": 280,
    "rating": 4.7,
    "distance": "2 miles away",
    "dateRange": "Aug 1 - 5",
    "isNew": false,
    "guestFavorite": true,
    "bedrooms": 2,
    "bathrooms": 1.5,
    "description": "Experience the charm of Charleston in this beautifully restored historic loft, steps away from vibrant shops and restaurants.",
    "amenities": [
      "WiFi",
      "Full Kitchen",
      "Air Conditioning",
      "City View"
    ],
    "reviews": 95,
    "host": "Michael Davis",
    "guests": 4
  },
  {
    "id": "68851abe9dddd51108903b4f",
    "title": "Mountain Retreat with Hot Tub",
    "location": "Asheville, NC",
    "images": [
      "pexels-heyho-5998117_eg46uc.jpg",
      "pexels-heyho-6758788_bssrro.jpg",
      "pexels-heyho-6908368_h8jha7.jpg",
      "pexels-heyho-5997959_hyfnyn.jpg"
    ],
    "price": 420,
    "rating": 4.9,
    "distance": "15 miles away",
    "dateRange": "Sep 3 - 9",
    "isNew": true,
    "guestFavorite": false,
    "bedrooms": 3,
    "bathrooms": 2,
    "description": "Escape to the mountains in this serene retreat featuring a private hot tub, breathtaking views, and easy access to hiking trails.",
    "amenities": [
      "WiFi",
      "Hot Tub",
      "Fireplace",
      "Mountain View",
      "Pet-friendly"
    ],
    "reviews": 150,
    "host": "Emily White",
    "guests": 6
  },
  {
    "id": "68851abe9dddd51108903b50",
    "title": "Urban Oasis with Rooftop Pool",
    "location": "Miami, FL",
    "images": [
      "pexels-pixabay-279614_kggyle.jpg",
      "pexels-heyho-6969824_gcivrs.jpg",
      "pexels-heyho-5997967_ogepa2.jpg"
    ],
    "price": 600,
    "rating": 4.6,
    "distance": "Downtown",
    "dateRange": "Oct 12 - 18",
    "isNew": false,
    "guestFavorite": false,
    "bedrooms": 2,
    "bathrooms": 2,
    "description": "Luxurious urban apartment with access to a stunning rooftop pool, offering panoramic cityscapes in the heart of Miami.",
    "amenities": [
      "WiFi",
      "Rooftop Pool",
      "Gym",
      "Parking",
      "Concierge"
    ],
    "reviews": 70,
    "host": "David Chen",
    "guests": 4
  },
  {
    "id": "68851abe9dddd51108903b51",
    "title": "Secluded Lakeside Cabin",
    "location": "Lake Tahoe, CA",
    "images": [
      "pexels-jvdm-1457841_a0159n.jpg",
      "pexels-heyho-6903160_souvoj.jpg",
      "pexels-vika-glitter-392079-3315291_m8paho.jpg",
      "pexels-donaldtong94-189333_utwhue.jpg"
    ],
    "price": 550,
    "rating": 4.9,
    "distance": "20 miles away",
    "dateRange": "Nov 5 - 10",
    "isNew": true,
    "guestFavorite": false,
    "bedrooms": 4,
    "bathrooms": 2.5,
    "description": "A tranquil cabin nestled by the serene waters of Lake Tahoe, perfect for nature lovers and quiet escapes.",
    "amenities": [
      "WiFi",
      "Lake Access",
      "Fire Pit",
      "Boat Dock",
      "BBQ Grill"
    ],
    "reviews": 110,
    "host": "Jessica Lee",
    "guests": 8
  },
  {
    "id": "68851abe9dddd51108903b52",
    "title": "Charming Cottage by the Vineyards",
    "location": "Napa Valley, CA",
    "images": [
      "pexels-kseniachernaya-4450337_gvouty.jpg",
      "pexels-expect-best-79873-323780_cmnr2u.jpg",
      "pexels-fotoaibe-1571468_f8bevr.jpg"
    ],
    "price": 700,
    "rating": 4.8,
    "distance": "10 miles away",
    "dateRange": "Dec 1 - 7",
    "isNew": true,
    "guestFavorite": false,
    "bedrooms": 2,
    "bathrooms": 2,
    "description": "Sip wine and relax in this charming cottage surrounded by picturesque vineyards, offering an authentic Napa Valley experience.",
    "amenities": [
      "WiFi",
      "Vineyard Views",
      "Wine Tasting nearby",
      "Private Patio"
    ],
    "reviews": 60,
    "host": "Robert Brown",
    "guests": 3
  },
  {
    "id": "68851abe9dddd51108903b53",
    "title": "Spacious Family Home with Garden",
    "location": "Denver, CO",
    "images": [
      "pexels-heyho-6585598_u5gdjw.jpg",
      "pexels-heyho-6492398_yixqhn.jpg",
      "pexels-fotoaibe-1571460_1_z1c6da.jpg",
      "pexels-heyho-7512031_iyeslb.jpg"
    ],
    "price": 380,
    "rating": 4.5,
    "distance": "Suburb",
    "dateRange": "Jan 15 - 20",
    "isNew": false,
    "guestFavorite": false,
    "bedrooms": 4,
    "bathrooms": 3,
    "description": "A spacious and inviting family home with a beautiful garden, ideal for larger groups looking for comfort and relaxation.",
    "amenities": [
      "WiFi",
      "Large Garden",
      "B_B_Q Grill",
      "Kid-friendly",
      "Washing Machine"
    ],
    "reviews": 85,
    "host": "Laura Green",
    "guests": 7
  },
  {
    "id": "68851abe9dddd51108903b54",
    "title": "Artist's Loft in Creative District",
    "location": "Portland, OR",
    "images": [
      "pexels-emrecan-2079246_tiwltw.jpg",
      "deborah-cortelazzi-gREquCUXQLI-unsplash_znrcag.jpg",
      "patrick-perkins-3wylDrjxH-E-unsplash_urhhme.jpg"
    ],
    "price": 310,
    "rating": 4.7,
    "distance": "Central",
    "dateRange": "Feb 2 - 8",
    "isNew": true,
    "guestFavorite": true,
    "bedrooms": 1,
    "bathrooms": 1,
    "description": "Immerse yourself in art and culture in this stylish artist's loft located in Portland's vibrant creative district.",
    "amenities": [
      "WiFi",
      "Workspace",
      "City View",
      "Near Galleries"
    ],
    "reviews": 105,
    "host": "Daniel Kim",
    "guests": 2
  },
  {
    "id": "68851abe9dddd51108903b55",
    "title": "Desert Oasis with Stargazing",
    "location": "Joshua Tree, CA",
    "images": [
      "pexels-heyho-7511695_zfw8tj.jpg",
      "frames-for-your-heart-FqqiAvJejto-unsplash_hi4kmn.jpg",
      "pexels-heyho-7511693_w5fmn4.jpg",
      "jarek-ceborski-jn7uVeCdf6U-unsplash_niprcy.jpg"
    ],
    "price": 490,
    "rating": 4.9,
    "distance": "Remote",
    "dateRange": "Mar 1 - 6",
    "isNew": true,
    "guestFavorite": false,
    "bedrooms": 2,
    "bathrooms": 1.5,
    "description": "Find tranquility in this desert oasis, offering unparalleled stargazing opportunities and a unique Joshua Tree experience.",
    "amenities": [
      "WiFi",
      "Stargazing Deck",
      "Fire Pit",
      "Hiking Trails nearby"
    ],
    "reviews": 45,
    "host": "Sophia Rodriguez",
    "guests": 4
  },
  {
    "id": "68851abe9dddd51108903b56",
    "title": "Ski-in/Ski-out Condo",
    "location": "Aspen, CO",
    "images": [
      "francesca-tosolini-tHkJAMcO3QE-unsplash_qvrfx3.jpg",
      "naomi-hebert-MP0bgaS_d1c-unsplash_tcittg.jpg",
      "pexels-fotoaibe-1743227_pybani.jpg"
    ],
    "price": 950,
    "rating": 4.8,
    "distance": "On mountain",
    "dateRange": "Apr 10 - 16",
    "isNew": false,
    "guestFavorite": true,
    "bedrooms": 3,
    "bathrooms": 3,
    "description": "Hit the slopes directly from this luxurious ski-in/ski-out condo, offering prime access to Aspen's world-class skiing.",
    "amenities": [
      "WiFi",
      "Ski-in/Ski-out",
      "Fireplace",
      "Heated Pool",
      "Gym"
    ],
    "reviews": 80,
    "host": "James Taylor",
    "guests": 6
  },
  {
    "id": "68851abe9dddd51108903b57",
    "title": "Luxury Penthouse with City Views",
    "location": "Chicago, IL",
    "images": [
      "pexels-ilya-shakir-1278798-2440471_bdsh3v.jpg",
      "pexels-pixabay-279719_zup9l4.jpg",
      "Beachfront_jton5v.jpg",
      "hosemorocan_s2i3da.jpg"
    ],
    "price": 1100,
    "rating": 4.9,
    "distance": "Financial District",
    "dateRange": "May 20 - 25",
    "isNew": true,
    "guestFavorite": false,
    "bedrooms": 3,
    "bathrooms": 3.5,
    "description": "Indulge in unparalleled luxury in this penthouse, boasting stunning panoramic city views of Chicago's iconic skyline.",
    "amenities": [
      "WiFi",
      "City Views",
      "Private Balcony",
      "Concierge",
      "Gym"
    ],
    "reviews": 30,
    "host": "Olivia Martinez",
    "guests": 5
  },
  {
    "id": "68851abe9dddd51108903b58",
    "title": "Quaint Farmhouse Experience",
    "location": "Vermont, VT",
    "images": [
      "Courtyard_fexggm.jpg",
      "moderncity_qgpf2i.jpg",
      "Historic_khtgn9.jpg"
    ],
    "price": 220,
    "rating": 4.6,
    "distance": "Countryside",
    "dateRange": "Jun 1 - 7",
    "isNew": false,
    "guestFavorite": false,
    "bedrooms": 3,
    "bathrooms": 2,
    "description": "Experience the charm of rural Vermont in this quaint farmhouse, surrounded by rolling hills and peaceful countryside.",
    "amenities": [
      "WiFi",
      "Garden",
      "Farm Animals",
      "Hiking Trails nearby"
    ],
    "reviews": 140,
    "host": "William Johnson",
    "guests": 5
  },
  {
    "id": "68851abe9dddd51108903b59",
    "title": "Bohemian Bungalow by the Beach",
    "location": "San Diego, CA",
    "images": [
      "Villa_dyd0xg.jpg",
      "Lodge_upsmbi.jpg",
      "Garden_yq0aen.jpg",
      "Panoramic_zm9epe.jpg"
    ],
    "price": 400,
    "rating": 4.7,
    "distance": "Beachfront",
    "dateRange": "Jul 4 - 9",
    "isNew": true,
    "guestFavorite": false,
    "bedrooms": 2,
    "bathrooms": 1,
    "description": "A vibrant and cozy bohemian bungalow just steps from the sandy beaches of San Diego, perfect for surf lovers.",
    "amenities": [
      "WiFi",
      "Beach Access",
      "Outdoor Shower",
      "Surfboard Storage"
    ],
    "reviews": 90,
    "host": "Ava Garcia",
    "guests": 3
  },
  {
    "id": "68851abe9dddd51108903b5a",
    "title": "Historic Brownstone Apartment",
    "location": "Boston, MA",
    "images": [
      "living-room-930804_1920_omjqsm.jpg",
      "bedroom-5772286_1920_sdjwjk.jpg",
      "bedroom-5667527_1920_hfdzmc.jpg"
    ],
    "price": 330,
    "rating": 4.8,
    "distance": "Beacon Hill",
    "dateRange": "Aug 20 - 24",
    "isNew": true,
    "guestFavorite": true,
    "bedrooms": 1,
    "bathrooms": 1,
    "description": "Immerse yourself in Boston's rich history in this elegant brownstone apartment located in the charming Beacon Hill neighborhood.",
    "amenities": [
      "WiFi",
      "Historic Charm",
      "City View",
      "Near Public Transport"
    ],
    "reviews": 115,
    "host": "Noah Wilson",
    "guests": 2
  },
  {
    "id": "68851abe9dddd51108903b5b",
    "title": "Private Island Paradise",
    "location": "Fiji",
    "images": [
      "bedroom-5969977_1920_irfvig.jpg",
      "bedroom-389254_1280_nasruu.jpg",
      "wall-416060_1920_g7qgsl.jpg",
      "bedroom-1285156_1920_v8grlx.jpg"
    ],
    "price": 2500,
    "rating": 5,
    "distance": "Exclusive",
    "dateRange": "Anytime",
    "isNew": true,
    "guestFavorite": true,
    "bedrooms": 5,
    "bathrooms": 5,
    "description": "Experience the ultimate luxury on your own private island in Fiji, with pristine beaches and unparalleled seclusion.",
    "amenities": [
      "Private Beach",
      "Snorkeling Gear",
      "Chef Services",
      "Boat Tours",
      "Spa Services"
    ],
    "reviews": 25,
    "host": "Isabella Clark",
    "guests": 10
  }
];
