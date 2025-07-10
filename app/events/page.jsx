"use client";

import React from "react";
import { Calendar, Sparkles, TrendingUp } from "lucide-react";
import EventCard from "@/components/events/EventCard";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchEvents } from "@/hooks/events/actions";

function Events() {
  const {
    isLoading: isLoadingEvents,
    data: events,
    refetch: refetchEvents,
  } = useFetchEvents();

  if (isLoadingEvents) {
    return <LoadingSpinner />;
  }

  // Calculate total tickets for stats
  const totalTickets = events
    ? events.reduce((sum, event) => {
        return sum + (event.ticket_types ? event.ticket_types.length : 0);
      }, 0)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-red-600 via-red-700 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-white/10 rounded-full backdrop-blur-sm">
                <Calendar className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Discover Amazing Events
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto">
              Find and book tickets for the most exciting events in your area
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Sparkles className="w-5 h-5 mr-2" />
                  <span className="text-2xl font-bold">
                    {events ? events.length : 0}
                  </span>
                </div>
                <p className="text-white/80">Active Events</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  <span className="text-2xl font-bold">{totalTickets}+</span>
                </div>
                <p className="text-white/80">Available Tickets</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Events Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Don't miss out on these incredible events happening soon
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events &&
            events.map((event) => (
              <EventCard key={event.identity} event={event} />
            ))}
        </div>

        {(!events || events.length === 0) && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Calendar className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Events Available
            </h3>
            <p className="text-gray-600">
              Check back later for exciting events in your area!
            </p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      {/* <div className="bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Create Your Own Event?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of event organizers who trust our platform to
              manage their events
            </p>
            <button className="primary-button px-8 py-4 rounded-lg font-medium text-lg">
              Create Event
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default Events;
