import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Eye,
  MoreVertical,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const EventsCard = ({ event }) => {
  const totalBookings = event.ticket_types.reduce(
    (acc, type) => acc + type.bookings.length,
    0
  );

  const confirmedBookings = event.ticket_types.reduce(
    (acc, type) =>
      acc + type.bookings.filter((b) => b.status === "CONFIRMED").length,
    0
  );

  const totalRevenue = event.ticket_types.reduce(
    (acc, type) =>
      acc +
      type.bookings
        .filter((b) => b.payment_status === "Completed")
        .reduce((sum, booking) => sum + parseFloat(booking.amount), 0),
    0
  );

  const formatDate = (date, time) => {
    const dateObj = new Date(`${date}T${time}`);
    return dateObj.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm overflow-hidden">
      <div className="h-48 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-4 right-4">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <h3 className="text-xl font-bold">{event.name}</h3>
          <p className="text-sm opacity-90">{event.description}</p>
        </div>
      </div>

      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(event.start_date, event.start_time)}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <MapPin className="w-4 h-4" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Users className="w-4 h-4" />
            <span>
              {totalBookings}/{event.capacity}
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Clock className="w-4 h-4" />
            <span>KES {totalRevenue.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Badge variant={confirmedBookings > 0 ? "default" : "secondary"}>
              {confirmedBookings} Confirmed
            </Badge>
            <Badge variant="outline">
              {totalBookings - confirmedBookings} Pending
            </Badge>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="group-hover:bg-blue-50 group-hover:border-blue-200"
          >
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EventsCard;
