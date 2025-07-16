"use client";

import { useFetchEvents } from "@/hooks/events/actions";
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Calendar,
  MapPin,
  Users,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Plus,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import NewEvent from "@/forms/events/NewEvent";
import EventCreate from "@/forms/events/EventCreate";

function Events() {
  const {
    isLoading: isLoadingEvents,
    data: events,
    isError: isErrorEvents,
    refetch: refetchEvents,
  } = useFetchEvents();

  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [filterBy, setFilterBy] = useState("all");
  const [eventModalOpen, setEventModalOpen] = useState(false);

  // Calculate event statistics
  const getEventStats = (event) => {
    let totalBookings = 0;
    let totalRevenue = 0;
    let confirmedBookings = 0;

    event.ticket_types.forEach((ticketType) => {
      ticketType.bookings.forEach((booking) => {
        totalBookings += booking.quantity;
        if (booking.status === "CONFIRMED") {
          confirmedBookings += booking.quantity;
          totalRevenue += parseFloat(ticketType.price) * booking.quantity;
        }
      });
    });

    return {
      totalBookings,
      confirmedBookings,
      totalRevenue,
      ticketTypes: event.ticket_types.length,
    };
  };

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    if (!events) return [];

    let filtered = events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchTerm.toLowerCase());

      if (filterBy === "all") return matchesSearch;
      if (filterBy === "upcoming") {
        const eventDate = new Date(event.start_date);
        return matchesSearch && eventDate >= new Date();
      }
      if (filterBy === "past") {
        const eventDate = new Date(event.start_date);
        return matchesSearch && eventDate < new Date();
      }
      if (filterBy === "has-bookings") {
        return (
          matchesSearch &&
          event.ticket_types.some((tt) => tt.bookings.length > 0)
        );
      }

      return matchesSearch;
    });

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "start_date":
          return (
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
          );
        case "created_at":
        default:
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

    return filtered;
  }, [events, searchTerm, sortBy, filterBy]);

  if (isLoadingEvents) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-4 mb-6">
            <Skeleton className="h-10 w-80" />
            <Skeleton className="h-10 w-40" />
            <Skeleton className="h-10 w-40" />
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isErrorEvents) {
    return (
      <div className="min-h-screen bg-gray-200 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load events. Please try again.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchEvents()}
                className="ml-4"
              >
                Retry
              </Button>
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Events Management
              </h1>
              <p className="text-gray-600 mt-2">
                Manage and monitor all events, bookings, and ticket sales
              </p>
            </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
              onClick={() => setEventModalOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Event
            </Button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold">{events?.length || 0}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Events</p>
                    <p className="text-2xl font-bold">
                      {events?.filter(
                        (e) => new Date(e.start_date) >= new Date()
                      ).length || 0}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Bookings</p>
                    <p className="text-2xl font-bold">
                      {events?.reduce((total, event) => {
                        return (
                          total +
                          event.ticket_types.reduce((eventTotal, tt) => {
                            return (
                              eventTotal +
                              tt.bookings.reduce((ttTotal, booking) => {
                                return (
                                  ttTotal +
                                  (booking.status === "CONFIRMED"
                                    ? booking.quantity
                                    : 0)
                                );
                              }, 0)
                            );
                          }, 0)
                        );
                      }, 0) || 0}
                    </p>
                  </div>
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold">
                      KES{" "}
                      {events
                        ?.reduce((total, event) => {
                          const eventRevenue = event.ticket_types.reduce(
                            (eventTotal, tt) => {
                              return (
                                eventTotal +
                                tt.bookings.reduce((ttTotal, booking) => {
                                  return (
                                    ttTotal +
                                    (booking.status === "CONFIRMED"
                                      ? parseFloat(tt.price) * booking.quantity
                                      : 0)
                                  );
                                }, 0)
                              );
                            },
                            0
                          );
                          return total + eventRevenue;
                        }, 0)
                        .toFixed(2) || "0.00"}
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events by name, description, or venue..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="created_at">Latest Created</SelectItem>
              <SelectItem value="start_date">Event Date</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter..." />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Events</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past Events</SelectItem>
              <SelectItem value="has-bookings">With Bookings</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Events Grid */}
        {filteredAndSortedEvents.length === 0 ? (
          <Card className="p-12 text-center bg-white">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              {searchTerm || filterBy !== "all"
                ? "Try adjusting your search or filters"
                : "Get started by creating your first event"}
            </p>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAndSortedEvents.map((event) => {
              const stats = getEventStats(event);
              const isUpcoming = new Date(event.start_date) >= new Date();

              return (
                <Card
                  key={event.identity}
                  className="overflow-hidden hover:shadow-lg transition-shadow bg-white"
                >
                  {event.image && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={event.image}
                        alt={event.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start mb-2">
                      <CardTitle className="text-lg line-clamp-1">
                        {event.name}
                      </CardTitle>
                      <Badge variant={isUpcoming ? "default" : "secondary"}>
                        {isUpcoming ? "Upcoming" : "Past"}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">
                      {event.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Event Details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          {format(new Date(event.start_date), "MMM dd, yyyy")}
                          {event.start_time && ` at ${event.start_time}`}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="line-clamp-1">{event.venue}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        <span>
                          {event.capacity
                            ? `${event.capacity} capacity`
                            : "Unlimited capacity"}
                        </span>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                      <div>
                        <p className="text-xs text-gray-500">Bookings</p>
                        <p className="font-semibold">
                          {stats.confirmedBookings}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Revenue</p>
                        <p className="font-semibold">
                          KES {stats.totalRevenue.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Ticket Types</p>
                        <p className="font-semibold">{stats.ticketTypes}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Reference</p>
                        <p className="font-mono text-xs">{event.reference}</p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 cursor-pointer"
                        onClick={() =>
                          router.push(`/admin/events/${event.identity}`)
                        }
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      {/* <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button> */}
                      {/* <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button> */}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {eventModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-start justify-center z-50 pt-4 px-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[95vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setEventModalOpen(false)}
            >
              ✕
            </button>
            <EventCreate
              refetchEvents={refetchEvents}
              closeModal={() => setEventModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;
