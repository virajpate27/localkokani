// src/utils/placeholderData.js
// TEMPORARY — will be deleted once Firestore is wired up on Day 7

export const placeholderDestinations = [
  {
    id: "1",
    slug: "goa",
    name: "Goa",
    country: "India",
    hotelCount: 24,
    image:
      "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80",
  },
  {
    id: "2",
    slug: "manali",
    name: "Manali",
    country: "India",
    hotelCount: 18,
    image:
      "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&q=80",
  },
  {
    id: "3",
    slug: "jaipur",
    name: "Jaipur",
    country: "India",
    hotelCount: 15,
    image:
      "https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800&q=80",
  },
  {
    id: "4",
    slug: "kerala",
    name: "Kerala",
    country: "India",
    hotelCount: 21,
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800&q=80",
  },
];
  

export const placeholderHotels = [
  {
    id: "h1",
    slug: "the-leela-goa",
    name: "The Leela Goa",
    destinationName: "Goa",
    destinationSlug: "goa",
    price: 8500,
    rating: 4.7,
    reviewCount: 342,
    amenities: ["Free WiFi", "Pool", "Breakfast"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
      },
    ],
  },
  {
    id: "h2",
    slug: "snow-valley-resort-manali",
    name: "Snow Valley Resort",
    destinationName: "Manali",
    destinationSlug: "manali",
    price: 4200,
    rating: 4.5,
    reviewCount: 210,
    amenities: ["Mountain View", "Free WiFi", "Bonfire"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      },
    ],
  },
  {
    id: "h3",
    slug: "pink-city-palace-jaipur",
    name: "Pink City Palace Hotel",
    destinationName: "Jaipur",
    destinationSlug: "jaipur",
    price: 3600,
    rating: 4.6,
    reviewCount: 178,
    amenities: ["Heritage Property", "Free WiFi", "Pool"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&q=80",
      },
    ],
  },
  {
    id: "h4",
    slug: "backwater-bliss-kerala",
    name: "Backwater Bliss Resort",
    destinationName: "Kerala",
    destinationSlug: "kerala",
    price: 5100,
    rating: 4.8,
    reviewCount: 289,
    amenities: ["Houseboat", "Free WiFi", "Breakfast"],
    images: [
      {
        url: "https://images.unsplash.com/photo-1602343168117-bb8ffe3e2e9f?w=800&q=80",
      },
    ],
  },
];

export const placeholderTestimonials = [
  {
    id: "t1",
    name: "Rahul Patil",
    location: "Pune",
    rating: 5,
    text: "Found a beautiful stay, connected directly with owner, and enjoyed a peaceful Kokan vacation.",
    avatar: "https://res.cloudinary.com/gwy8xgtr/image/upload/v1787401711/test1_vtxdrl.webp",
  },
  {
    id: "t2",
    name: "Sneha Kulkarni",
    location: "Mumbai",
    rating: 5,
    text: "Booking was simple, prices were affordable, and our homestay experience felt genuinely welcoming.",
    avatar: "https://res.cloudinary.com/gwy8xgtr/image/upload/v1787401711/test2_ridlko.webp",
  },
  {
    id: "t3",
    name: "Amit Deshmukh",
    location: "Nagpur",
    rating: 4,
    text: "Direct communication with the owner made our entire stay smooth, convenient, and stress-free.",
    avatar: "https://res.cloudinary.com/gwy8xgtr/image/upload/v1787401711/test3_cbfmnq.webp",
  },
];