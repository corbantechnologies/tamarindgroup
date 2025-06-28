import {
  FaHeart,
  FaHotel,
  FaInfoCircle,
  FaPalette,
  FaSwimmingPool,
} from "react-icons/fa";

const msa_directory = [
  {
    id: 100,
    name: "General Info",
    icon: <FaInfoCircle />,
    items: [
      {
        id: 101,
        name: "Check out",
        subtitle: "Check-out is at 11:00 AM",
        image: "/check-out.jpg",
        description:
          "Please ensure all belongings are packed and room keys are returned to the reception by 11:00 AM. Late check-out may incur additional charges, subject to availability.",
      },
      {
        id: 102,
        name: "Check In",
        subtitle: "Check-in is at 11:00 AM",
        image: "/check-in.jpg",
        description:
          "Check-in begins at 11:00 AM. Early check-in is subject to room availability. Please present a valid ID and booking confirmation at the reception.",
      },
      {
        id: 103,
        name: "Fire",
        subtitle: "Follow the safety instructions",
        image: "/fire.jpg",
        description:
          "In case of a fire, use the nearest emergency exit as indicated on the evacuation map in your room. Do not use elevators. Follow staff instructions and proceed to the designated assembly point.",
      },
      {
        id: 104,
        name: "Key",
        subtitle: "Access system that uses electronic locks",
        image: "/keycard.jpg",
        description:
          "Your room key is an electronic card that grants access to your room and select hotel facilities. Please report lost keys to reception immediately for security purposes.",
      },
    ],
  },
  {
    id: 200,
    name: "Hotel Benefits",
    icon: <FaHotel />,
    items: [
      {
        id: 201,
        name: "Parking",
        subtitle: "Complimentary parking for guests",
        image: "/parking.jpg",
        description:
          "Enjoy free on-site parking for one vehicle per room. Spaces are available on a first-come, first-served basis. Please register your vehicle at the reception.",
      },
      {
        id: 202,
        name: "24h Reception",
        subtitle: "Round-the-clock assistance",
        image: "/reception.jpg",
        description:
          "Our reception is staffed 24/7 to assist with check-ins, inquiries, or any needs during your stay. Contact us anytime for support or recommendations.",
      },
      {
        id: 203,
        name: "WiFi",
        subtitle: "Free high-speed WiFi",
        image: "/wifi.jpg",
        description:
          "Connect to our complimentary high-speed WiFi throughout the hotel. Access details are provided at check-in. Contact reception for assistance with connectivity issues.",
      },
      {
        id: 204,
        name: "Safe",
        subtitle: "In-room safety deposit box",
        image: "/safe.jpg",
        description:
          "Each room is equipped with a secure in-room safe for your valuables. Instructions for use are provided. Contact reception for assistance if needed.",
      },
      {
        id: 205,
        name: "Payment Methods",
        subtitle: "We accept the following methods",
        image: "/payment.jpg",
        description:
          "We accept major credit cards (Visa, MasterCard, Amex), mobile payments (M-Pesa), and cash in KES. All charges must be settled prior to check-out.",
      },
    ],
  },
  {
    id: 300,
    name: "Other Services",
    icon: <FaPalette />,
    items: [
      {
        id: 301,
        name: "Money Exchange",
        subtitle: "Currency exchange services",
        image: "/money.jpg",
        description:
          "Currency exchange services are available at the reception desk. Please check current rates and service fees. We recommend exchanging currency during business hours for the best rates.",
      },
      {
        id: 302,
        name: "Laundry",
        subtitle: "Complimentary laundry service",
        image: "/laundry.jpg",
        description:
          "We offer complimentary laundry services for your laundry needs. Please inform the reception at least 24 hours in advance to arrange this service.",
      },
      {
        id: 303,
        name: "Room Service",
        subtitle: "In-room dining available",
        image: "/room-service.jpg",
        description:
          "Enjoy in-room dining with our room service menu. Available daily from 7:00 AM to 10:00 PM. Please call the reception to place your order.",
      },
      {
        id: 304,
        name: "Housekeeping",
        subtitle: "Daily cleaning service",
        image: "/housekeeping.jpg",
        description:
          "Our housekeeping team provides daily cleaning services. If you require additional cleaning or have specific requests, please contact the reception.",
      },
    ],
  },
  {
    id: 400,
    name: "Special Moments",
    icon: <FaHeart />,
    items: [
      {
        id: 401,
        name: "Bottle of cava or wine",
        subtitle: "Uncork a magical evening",
        image: "/wine.jpg",
        description:
          "Celebrate your special moments with a complimentary bottle of cava or wine. Please inform the reception at least 24 hours in advance to arrange this service.",
      },
      {
        id: 402,
        name: "Romantic dinner",
        subtitle: "A candlelit dinner for two",
        image: "/dinner.jpg",
        description:
          "Indulge in a romantic dinner for two at our restaurant. Please make reservations at least 48 hours in advance to ensure availability and special arrangements.",
      },
      {
        id: 403,
        name: "Birthday cake",
        subtitle: "Celebrate with a sweet treat",
        image: "/birthday.jpg",
        description:
          "Order a personalized birthday cake to celebrate your special day. Please notify the reception at least 72 hours in advance with your preferences.",
      },
    ],
  },
  {
    id: 500,
    name: "Swimming Pools",
    icon: <FaSwimmingPool />,
    items: [
      {
        id: 501,
        name: "Towels service",
        subtitle: "Complimentary towels at the pool",
        image: "/pool.jpg",
        description:
          "Complimentary towels are available at the pool area. Please return used towels to the designated bins to help us maintain cleanliness and hygiene.",
      },
      {
        id: 502,
        name: "Sun loungers and parasols",
        subtitle: "Relax in comfort",
        image: "/parasol.jpg",
        description:
          "Enjoy our sun loungers and parasols available around the pool area. Please reserve loungers responsibly and return them to their original position after use.",
      },
    ],
  },
];

export { msa_directory };
