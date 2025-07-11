"use client";

import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  Share2,
} from "lucide-react";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchEvent } from "@/hooks/events/actions";
import TicketTypeChip from "@/components/events/TicketTypeChip";
import CreateBooking from "@/forms/bookings/CreateBooking";
import MakeBooking from "@/forms/bookings/MakeBooking";

function EventDetail({ params }) {
  const { event_identity } = use(params);
  const router = useRouter();
  const [showBookingModal, setShowBookingModal] = useState(false);

  const {
    isLoading: isLoadingEvent,
    data: event,
    refetch: refetchEvent,
  } = useFetchEvent(event_identity);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
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
    if (!event?.ticket_types || event.ticket_types.length === 0) return null;
    const prices = event.ticket_types.map((ticket) => parseFloat(ticket.price));
    return Math.min(...prices);
  };

  const defaultImage =
    "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=800&h=400&fit=crop";

  if (isLoadingEvent) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Event not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {showBookingModal && (
        <MakeBooking
          event={event}
          closeModal={() => setShowBookingModal(false)}
          refetchEvent={refetchEvent}
        />
      )}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Events
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-100 rounded-md">
              <Share2 className="w-4 h-4" />
              Share Event
            </button>
          </div>
        </div>
      </div>

      <div className="relative h-96 overflow-hidden">
        <img
          src={event.image || defaultImage}
          alt={event.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {event.name}
            </h1>
            <div className="flex flex-wrap gap-4 text-white/90">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(event.start_date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>
                  {formatTime(event.start_time)}
                  {event.end_time && ` - ${formatTime(event.end_time)}`}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span>{event.venue}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">About This Event</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Event Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Date</p>
                      <p className="text-gray-600">
                        {formatDate(event.start_date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Time</p>
                      <p className="text-gray-600">
                        {formatTime(event.start_time)}
                        {event.end_time && ` - ${formatTime(event.end_time)}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Venue</p>
                      <p className="text-gray-600">{event.venue}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Capacity</p>
                      <p className="text-gray-600">
                        {event.capacity} attendees
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Select Tickets</h2>
              <div className="space-y-4">
                {event.ticket_types && event.ticket_types.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {event.ticket_types.map((ticket) => (
                        <div
                          key={ticket.id}
                          className="border rounded-lg p-4 hover:border-red-300 transition-colors cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{ticket.name}</h4>
                              <p className="text-2xl font-bold text-red-600">
                                KES {parseFloat(ticket.price).toLocaleString()}
                              </p>
                            </div>
                            <TicketTypeChip
                              ticketType={ticket}
                              isLowestPrice={
                                parseFloat(ticket.price) === getLowestPrice()
                              }
                            />
                          </div>
                          {ticket.quantity_available &&
                          ticket.quantity_available <= 10 ? (
                            <p className="text-sm text-orange-600 font-medium">
                              Only {ticket.quantity_available} tickets left!
                            </p>
                          ) : ticket.quantity_available ? (
                            <p className="text-sm text-gray-600">
                              {ticket.quantity_available} tickets available
                            </p>
                          ) : (
                            <p className="text-sm text-gray-600">
                              Unlimited tickets available
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => setShowBookingModal(true)}
                      className="w-full primary-button py-3 px-4 rounded-lg font-medium text-lg"
                    >
                      Get Tickets
                    </button>
                    <p className="text-xs text-gray-500 text-center">
                      Secure payment processing
                    </p>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No tickets available for this event
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetail;
