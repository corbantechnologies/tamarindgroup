"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import StatsCard from "@/components/private/StatsCard";
import CreateCenter from "@/forms/centers/CreateCenter";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import { useFetchEvents } from "@/hooks/events/actions";
import { useFetchFeedbackForms } from "@/hooks/feedbackforms/actions";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Users,
  MapPin,
  Phone,
  Eye,
  Plus,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import CenterCard from "@/components/centers/CenterCard";
import EventsCard from "@/components/events/EventsCard";
import RevenueChart from "@/components/events/RevenueChart";
import BookingStatusChart from "@/components/bookings/BookingStatusChart";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();
  const {
    isLoading: isLoadingCenters,
    data: centers = [], // Default to empty array
    refetch: refetchCenters,
  } = useFetchCenters();
  const {
    isLoading: isLoadingFeedbackForms,
    data: feedbackForms = [], // Default to empty array
    refetch: refetchFeedbackForms,
  } = useFetchFeedbackForms();
  const {
    isLoading: isLoadingEvents,
    data: events = [], // Default to empty array
    refetch: refetchEvents,
  } = useFetchEvents();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate stats with robust validation
  let stats = {
    totalBookings: 0,
    confirmedBookings: 0,
    totalRevenue: 0,
    conversionRate: 0,
  };

  if (events && Array.isArray(events)) {
    const totalBookings = events.reduce(
      (acc, event) =>
        acc +
        (Array.isArray(event?.ticket_types)
          ? event.ticket_types.reduce(
              (typeAcc, type) => typeAcc + (type?.bookings?.length || 0),
              0
            )
          : 0),
      0
    );

    const confirmedBookings = events.reduce(
      (acc, event) =>
        acc +
        (Array.isArray(event?.ticket_types)
          ? event.ticket_types.reduce(
              (typeAcc, type) =>
                typeAcc +
                (type?.bookings?.filter((b) => b.status === "CONFIRMED")
                  ?.length || 0),
              0
            )
          : 0),
      0
    );

    const totalRevenue = events.reduce(
      (acc, event) =>
        acc +
        (Array.isArray(event?.ticket_types)
          ? event.ticket_types.reduce(
              (typeAcc, type) =>
                typeAcc +
                (type?.bookings
                  ?.filter((b) => b.payment_status === "Completed")
                  ?.reduce(
                    (bookingAcc, booking) =>
                      bookingAcc + parseFloat(booking.amount || 0),
                    0
                  ) || 0),
              0
            )
          : 0),
      0
    );

    const conversionRate =
      totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;

    stats = {
      totalBookings,
      confirmedBookings,
      totalRevenue,
      conversionRate,
    };
  }

  if (
    isLoadingAccount ||
    isLoadingCenters ||
    isLoadingFeedbackForms ||
    isLoadingEvents
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Welcome back, {account?.name || "User"}
            </h1>
            <p className="text-slate-600 mt-2">
              Here's what's happening with your events today.
            </p>
          </div>
          <div className="flex gap-3">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Center
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Bookings"
            value={stats.totalBookings}
            icon={Users}
            color="blue"
          />
          <StatsCard
            title="Revenue"
            value={`KES ${stats.totalRevenue.toFixed(2)}`}
            icon={DollarSign}
            color="green"
          />
          <StatsCard
            title="Conversion Rate"
            value={`${stats.conversionRate.toFixed(1)}%`}
            icon={TrendingUp}
            color="purple"
          />
          <StatsCard
            title="Active Centers"
            value={centers?.length || 0}
            icon={MapPin}
            color="orange"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full lg:w-fit grid-cols-4 lg:grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="centers" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Centers
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* <RevenueChart /> */}
              <BookingStatusChart />

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription>Latest bookings and updates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {events?.length > 0 &&
                    events[0]?.ticket_types?.length > 0 &&
                    events[0].ticket_types[0]?.bookings?.length > 0 ? (
                      events[0].ticket_types[0].bookings
                        .slice(0, 3)
                        .map((booking, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <div>
                                <p className="font-medium">{booking.name}</p>
                                <p className="text-sm text-slate-600">
                                  Booked {booking.quantity} tickets
                                </p>
                              </div>
                            </div>
                            <Badge
                              variant={
                                booking.status === "CONFIRMED"
                                  ? "default"
                                  : "secondary"
                              }
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        ))
                    ) : (
                      <p className="text-slate-600">
                        No recent bookings available.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Events Management</h2>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {events?.length > 0 ? (
                events.map((event, index) => (
                  <EventsCard key={index} event={event} />
                ))
              ) : (
                <p className="text-slate-600">No events available.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="centers" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Centers Management</h2>
              <Button variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Add Center
              </Button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {centers?.length > 0 ? (
                centers.map((center, index) => (
                  <CenterCard key={index} center={center} />
                ))
              ) : (
                <p className="text-slate-600">No centers available.</p>
              )}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Event Performance</CardTitle>
                  <CardDescription>Booking trends over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Sample Event</span>
                      <span className="text-sm text-slate-600">
                        19 bookings
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                    <div className="flex justify-between text-xs text-slate-600">
                      <span>75% of capacity</span>
                      <span>100 total capacity</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Revenue Breakdown</CardTitle>
                  <CardDescription>Revenue by ticket type</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        General Admission
                      </span>
                      <span className="text-sm font-semibold">KES 6.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">VIP</span>
                      <span className="text-sm font-semibold">KES 10.00</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between items-center font-semibold">
                        <span>Total Revenue</span>
                        <span>KES 16.00</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default AdminDashboard;
