import { FaInfoCircle } from "react-icons/fa";

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
        image: "/logo.png",
        description:
          "Please ensure all belongings are packed and room keys are returned to the reception by 11:00 AM. Late check-out may incur additional charges, subject to availability.",
      },
      {
        id: 102,
        name: "Check In",
        subtitle: "Check-in is at 11:00 AM",
        image: "/logo.png",
        description:
          "Check-in begins at 11:00 AM. Early check-in is subject to room availability. Please present a valid ID and booking confirmation at the reception.",
      },
      {
        id: 103,
        name: "Fire",
        subtitle: "Follow the safety instructions",
        image: "/logo.png",
        description:
          "In case of a fire, use the nearest emergency exit as indicated on the evacuation map in your room. Do not use elevators. Follow staff instructions and proceed to the designated assembly point.",
      },
      {
        id: 104,
        name: "Key",
        subtitle: "Access system that uses electronic locks",
        image: "/logo.png",
        description:
          "Your room key is an electronic card that grants access to your room and select hotel facilities. Please report lost keys to reception immediately for security purposes.",
      },
    ],
  },
  {
    id: 200,
    name: "Hotel Benefits",
    icon: <FaInfoCircle />,
    items: [
      {
        id: 201,
        name: "Parking",
        subtitle: "Complimentary parking for guests",
        image: "/logo.png",
        description:
          "Enjoy free on-site parking for one vehicle per room. Spaces are available on a first-come, first-served basis. Please register your vehicle at the reception.",
      },
      {
        id: 202,
        name: "24h Reception",
        subtitle: "Round-the-clock assistance",
        image: "/logo.png",
        description:
          "Our reception is staffed 24/7 to assist with check-ins, inquiries, or any needs during your stay. Contact us anytime for support or recommendations.",
      },
      {
        id: 203,
        name: "WiFi",
        subtitle: "Free high-speed WiFi",
        image: "/logo.png",
        description:
          "Connect to our complimentary high-speed WiFi throughout the hotel. Access details are provided at check-in. Contact reception for assistance with connectivity issues.",
      },
      {
        id: 204,
        name: "Safe",
        subtitle: "In-room safety deposit box",
        image: "/logo.png",
        description:
          "Each room is equipped with a secure in-room safe for your valuables. Instructions for use are provided. Contact reception for assistance if needed.",
      },
      {
        id: 205,
        name: "Payment Methods",
        subtitle: "We accept the following methods",
        image: "/logo.png",
        description:
          "We accept major credit cards (Visa, MasterCard, Amex), mobile payments (M-Pesa), and cash in KES. All charges must be settled prior to check-out.",
      },
    ],
  },
];

export { msa_directory };
