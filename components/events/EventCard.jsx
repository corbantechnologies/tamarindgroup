"use client";

import React from "react";
import { Calendar, Clock, MapPin, Users, Ticket } from "lucide-react";
import Link from "next/link";

function EventCard({ event }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getLowestPrice = () => {
    if (!event.ticket_types || event.ticket_types.length === 0) return null;
    const prices = event.ticket_types.map((ticket) => parseFloat(ticket.price));
    return Math.min(...prices);
  };

  const getHighestPrice = () => {
    if (!event.ticket_types || event.ticket_types.length === 0) return null;
    const prices = event.ticket_types.map((ticket) => parseFloat(ticket.price));
    return Math.max(...prices);
  };

  const getPriceRange = () => {
    const lowest = getLowestPrice();
    const highest = getHighestPrice();
    if (!lowest) return "Free";
    if (lowest === highest) {
      return `KES ${lowest.toLocaleString()}`;
    }
    return `KES ${lowest.toLocaleString()} - ${highest.toLocaleString()}`;
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop";

  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer">
      <div className="relative h-48 overflow-hidden">
        <img
          src={event.image || defaultImage}
          alt={event.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-gray-800">
            {getPriceRange()}
          </div>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors duration-200">
          {event.name}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>

        <div className="space-y-3 mb-4">
          <div className="flex items-center text-gray-700">
            <Calendar className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-sm font-medium mr-4">
              {formatDate(event.start_date)}
            </span>
            <Clock className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-sm">
              {formatTime(event.start_time)}
              {event.end_time && ` - ${formatTime(event.end_time)}`}
            </span>
          </div>

          <div className="flex items-center text-gray-700">
            <MapPin className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-sm font-medium">{event.venue}</span>
          </div>

          <div className="flex items-center text-gray-700">
            <Users className="w-4 h-4 mr-2 text-blue-600" />
            <span className="text-sm">Up to {event.capacity} attendees</span>
          </div>
        </div>

        {event.ticket_types && event.ticket_types.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center mb-2">
              <Ticket className="w-4 h-4 mr-1 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Available Tickets
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {event.ticket_types.slice(0, 2).map((ticket, index) => (
                <div
                  key={ticket.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200"
                >
                  {ticket.name} - KES{" "}
                  {parseFloat(ticket.price).toLocaleString()}
                  {parseFloat(ticket.price) === getLowestPrice() && (
                    <span className="ml-2 text-xs text-green-600">Lowest</span>
                  )}
                </div>
              ))}
              {event.ticket_types.length > 2 && (
                <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-600 border border-gray-200">
                  +{event.ticket_types.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        <Link href={`/events/${event.identity}`} className="w-full primary-button py-3 px-4 rounded-lg font-medium text-sm transition-all duration-200 hover:shadow-md">
          View Event Details
        </Link>
      </div>
    </div>
  );
}

export default EventCard;
