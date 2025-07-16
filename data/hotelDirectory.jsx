import {
  Info,
  Hotel,
  Palette,
  Heart,
  Waves,
  Clock,
  Key,
  Flame,
  LogIn,
  Car,
  Headphones,
  Wifi,
  Shield,
  CreditCard,
  DollarSign,
  Shirt,
  UtensilsCrossed,
  Sparkles,
  Wine,
  UtensilsCrossed as Dinner,
  Cake,
  Droplets,
  Sun,
} from "lucide-react";

export const hotelDirectory = [
  {
    id: 100,
    name: "General Info",
    icon: Info,
    color: "bg-blue-500",
    items: [
      {
        id: 101,
        name: "Check Out",
        subtitle: "Check-out is at 11:00 AM",
        image:
          "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
        description:
          "Please ensure all belongings are packed and room keys are returned to the reception by 11:00 AM. Late check-out may incur additional charges, subject to availability.",
        icon: LogIn,
      },
      {
        id: 102,
        name: "Check In",
        subtitle: "Check-in is at 3:00 PM",
        image:
          "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
        description:
          "Check-in begins at 3:00 PM. Early check-in is subject to room availability. Please present a valid ID and booking confirmation at the reception.",
        icon: LogIn,
      },
      {
        id: 103,
        name: "Fire Safety",
        subtitle: "Follow the safety instructions",
        image:
          "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=300&fit=crop",
        description:
          "In case of a fire, use the nearest emergency exit as indicated on the evacuation map in your room. Do not use elevators. Follow staff instructions and proceed to the designated assembly point.",
        icon: Flame,
      },
      {
        id: 104,
        name: "Room Access",
        subtitle: "Electronic key card system",
        image:
          "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
        description:
          "Your room key is an electronic card that grants access to your room and select hotel facilities. Please report lost keys to reception immediately for security purposes.",
        icon: Key,
      },
    ],
  },
  {
    id: 200,
    name: "Hotel Benefits",
    icon: Hotel,
    color: "bg-green-500",
    items: [
      {
        id: 201,
        name: "Parking",
        subtitle: "Complimentary parking for guests",
        image:
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
        description:
          "Enjoy free on-site parking for one vehicle per room. Spaces are available on a first-come, first-served basis. Please register your vehicle at the reception.",
        icon: Car,
      },
      {
        id: 202,
        name: "24h Reception",
        subtitle: "Round-the-clock assistance",
        image:
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
        description:
          "Our reception is staffed 24/7 to assist with check-ins, inquiries, or any needs during your stay. Contact us anytime for support or recommendations.",
        icon: Headphones,
      },
      {
        id: 203,
        name: "WiFi",
        subtitle: "Free high-speed WiFi",
        image:
          "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop",
        description:
          "Connect to our complimentary high-speed WiFi throughout the hotel. Access details are provided at check-in. Contact reception for assistance with connectivity issues.",
        icon: Wifi,
      },
      {
        id: 204,
        name: "Safe",
        subtitle: "In-room safety deposit box",
        image:
          "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
        description:
          "Each room is equipped with a secure in-room safe for your valuables. Instructions for use are provided. Contact reception for assistance if needed.",
        icon: Shield,
      },
      {
        id: 205,
        name: "Payment Methods",
        subtitle: "We accept all major cards",
        image:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop",
        description:
          "We accept major credit cards (Visa, MasterCard, Amex), mobile payments (M-Pesa), and cash in KES. All charges must be settled prior to check-out.",
        icon: CreditCard,
      },
    ],
  },
  {
    id: 300,
    name: "Other Services",
    icon: Palette,
    color: "bg-purple-500",
    items: [
      {
        id: 301,
        name: "Money Exchange",
        subtitle: "Currency exchange services",
        image:
          "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop",
        description:
          "Currency exchange services are available at the reception desk. Please check current rates and service fees. We recommend exchanging currency during business hours for the best rates.",
        icon: DollarSign,
      },
      {
        id: 302,
        name: "Laundry",
        subtitle: "Complimentary laundry service",
        image:
          "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=300&fit=crop",
        description:
          "We offer complimentary laundry services for your laundry needs. Please inform the reception at least 24 hours in advance to arrange this service.",
        icon: Shirt,
      },
      {
        id: 303,
        name: "Room Service",
        subtitle: "In-room dining available",
        image:
          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
        description:
          "Enjoy in-room dining with our room service menu. Available daily from 7:00 AM to 10:00 PM. Please call the reception to place your order.",
        icon: UtensilsCrossed,
      },
      {
        id: 304,
        name: "Housekeeping",
        subtitle: "Daily cleaning service",
        image:
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
        description:
          "Our housekeeping team provides daily cleaning services. If you require additional cleaning or have specific requests, please contact the reception.",
        icon: Sparkles,
      },
    ],
  },
  {
    id: 400,
    name: "Special Moments",
    icon: Heart,
    color: "bg-pink-500",
    items: [
      {
        id: 401,
        name: "Wine & Cava",
        subtitle: "Uncork a magical evening",
        image:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop",
        description:
          "Celebrate your special moments with a complimentary bottle of cava or wine. Please inform the reception at least 24 hours in advance to arrange this service.",
        icon: Wine,
      },
      {
        id: 402,
        name: "Romantic Dinner",
        subtitle: "A candlelit dinner for two",
        image:
          "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
        description:
          "Indulge in a romantic dinner for two at our restaurant. Please make reservations at least 48 hours in advance to ensure availability and special arrangements.",
        icon: Dinner,
      },
      {
        id: 403,
        name: "Birthday Cake",
        subtitle: "Celebrate with a sweet treat",
        image:
          "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop",
        description:
          "Order a personalized birthday cake to celebrate your special day. Please notify the reception at least 72 hours in advance with your preferences.",
        icon: Cake,
      },
    ],
  },
  {
    id: 500,
    name: "Swimming Pools",
    icon: Waves,
    color: "bg-cyan-500",
    items: [
      {
        id: 501,
        name: "Pool Towels",
        subtitle: "Complimentary towels at the pool",
        image:
          "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?w=400&h=300&fit=crop",
        description:
          "Complimentary towels are available at the pool area. Please return used towels to the designated bins to help us maintain cleanliness and hygiene.",
        icon: Droplets,
      },
      {
        id: 502,
        name: "Sun Loungers",
        subtitle: "Relax in comfort",
        image:
          "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=300&fit=crop",
        description:
          "Enjoy our sun loungers and parasols available around the pool area. Please reserve loungers responsibly and return them to their original position after use.",
        icon: Sun,
      },
    ],
  },
];
