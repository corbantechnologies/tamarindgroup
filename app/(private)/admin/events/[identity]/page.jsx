"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Clock,
  Plus,
  Edit,
  Trash2,
  Eye,
  AlertCircle,
  Badge,
  DollarSign,
} from "lucide-react";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchEvent } from "@/hooks/events/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge as BadgeComponent } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams, useRouter } from "next/navigation";

function EventDetail() {
  const { identity } = useParams();
  const navigate = useRouter();
  const [isCreateTicketDialogOpen, setIsCreateTicketDialogOpen] =
    useState(false);

  const {
    isLoading: isLoadingEvent,
    data: event,
    isError: isErrorEvent,
    refetch: refetchEvent,
  } = useFetchEvent(identity);

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

  if (isLoadingEvent) {
    return <LoadingSpinner />;
  }

  if (isErrorEvent) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load event details. Please try again.
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetchEvent()}
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

  if (!event) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Event not found.</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  const stats = getEventStats(event);
  const isUpcoming = new Date(event.start_date) >= new Date();

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate?.back("/events")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Events
            </Button>
            <div className="flex items-center gap-2">
              <BadgeComponent variant={isUpcoming ? "default" : "secondary"}>
                {isUpcoming ? "Upcoming" : "Past"}
              </BadgeComponent>
              <span className="text-sm text-gray-500">#{event.reference}</span>
            </div>
          </div>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {event.name}
              </h1>
              <p className="text-gray-600 mb-4">{event.description}</p>

              {/* Event Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(event.start_date), "MMM dd, yyyy")}
                    {event.start_time && ` at ${event.start_time}`}
                  </span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{event.venue}</span>
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
            </div>

            <div className="flex gap-2">
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit Event
              </Button>
              <Button
                variant="outline"
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>

        {/* Event Image */}
        {event.image && (
          <div className="mb-8">
            <img
              src={event.image}
              alt={event.name}
              className="w-full h-64 object-cover rounded-lg shadow-sm"
            />
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold">
                    {stats.confirmedBookings}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold">
                    KES {stats.totalRevenue.toFixed(2)}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ticket Types</p>
                  <p className="text-2xl font-bold">{stats.ticketTypes}</p>
                </div>
                <Badge className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Capacity Used</p>
                  <p className="text-2xl font-bold">
                    {event.capacity
                      ? `${Math.round(
                          (stats.confirmedBookings / event.capacity) * 100
                        )}%`
                      : "N/A"}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="tickets" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tickets">Ticket Types</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="details">Event Details</TabsTrigger>
          </TabsList>

          {/* Ticket Types Tab */}
          <TabsContent value="tickets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Ticket Types</h2>

              <Dialog
                open={isCreateTicketDialogOpen}
                onOpenChange={setIsCreateTicketDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Ticket Type
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Ticket Type</DialogTitle>
                    <DialogDescription>
                      Add a new ticket type for {event.name}
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="ticket-name">Ticket Name</Label>
                      <Input
                        id="ticket-name"
                        placeholder="e.g., VIP, General Admission"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ticket-price">Price (KES)</Label>
                      <Input
                        id="ticket-price"
                        type="number"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <Label htmlFor="ticket-quantity">
                        Quantity Available
                      </Label>
                      <Input
                        id="ticket-quantity"
                        type="number"
                        placeholder="Leave empty for unlimited"
                      />
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button className="flex-1">Create Ticket Type</Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateTicketDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {event.ticket_types.length === 0 ? (
              <Card className="p-12 text-center">
                <Badge className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No ticket types yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first ticket type for this event.
                </p>
                <Button onClick={() => setIsCreateTicketDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Ticket Type
                </Button>
              </Card>
            ) : (
              <div className="grid gap-4">
                {event.ticket_types.map((ticketType) => {
                  const ticketStats = ticketType.bookings.reduce(
                    (acc, booking) => {
                      if (booking.status === "CONFIRMED") {
                        acc.sold += booking.quantity;
                        acc.revenue +=
                          parseFloat(ticketType.price) * booking.quantity;
                      }
                      return acc;
                    },
                    { sold: 0, revenue: 0 }
                  );

                  return (
                    <Card key={ticketType.id}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-lg">
                              {ticketType.name}
                            </CardTitle>
                            <CardDescription>
                              KES {ticketType.price}
                            </CardDescription>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Sold</p>
                            <p className="font-semibold">{ticketStats.sold}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Available</p>
                            <p className="font-semibold">
                              {ticketType.quantity_available
                                ? ticketType.quantity_available -
                                  ticketStats.sold
                                : "Unlimited"}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-600">Revenue</p>
                            <p className="font-semibold">
                              KES {ticketStats.revenue.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Latest bookings for this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Bookings functionality will be implemented here.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Event Details Tab */}
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Created By</p>
                    <p className="font-medium">{event.created_by}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Reference</p>
                    <p className="font-mono">{event.reference}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Created At</p>
                    <p className="font-medium">
                      {format(
                        new Date(event.created_at),
                        "MMM dd, yyyy 'at' HH:mm"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Updated</p>
                    <p className="font-medium">
                      {format(
                        new Date(event.updated_at),
                        "MMM dd, yyyy 'at' HH:mm"
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default EventDetail;
