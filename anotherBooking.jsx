"use client";
import { useFetchBooking } from "@/hooks/bookings/actions";
import React, { use, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  CreditCard,
  Mail,
  Phone,
  User,
  Ticket,
  Hash,
} from "lucide-react";

function BookingPayment({ params }) {
  const reference = use(params);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  const {
    isLoading: isLoadingBooking,
    data: booking,
    refetch: refetchBooking,
  } = useFetchBooking(reference?.reference);

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      // TODO: Implement payment processing logic here
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      toast.error("Error initiating payment. Please try again");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  if (isLoadingBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">Booking not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "PAID":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Booking Details
          </h1>
          <p className="text-muted-foreground">
            Complete your payment to confirm your booking
          </p>
        </div>

        {/* Booking Summary Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Booking Summary
              </CardTitle>
              <Badge className={getStatusColor(booking.status)}>
                {booking.status}
              </Badge>
            </div>
            <CardDescription>Reference: {booking.reference}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.name}</p>
                    <p className="text-sm text-muted-foreground">Attendee</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{booking.phone}</p>
                    <p className="text-sm text-muted-foreground">Phone</p>
                  </div>
                </div>

                {booking.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{booking.email}</p>
                      <p className="text-sm text-muted-foreground">Email</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-medium">Ticket Type</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {booking.ticket_type}
                  </p>
                </div>

                <div>
                  <p className="font-medium">Quantity</p>
                  <p className="text-sm text-muted-foreground">
                    {booking.quantity} ticket{booking.quantity > 1 ? "s" : ""}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Booked on</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.created_at).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Description</p>
              <p className="font-medium">{booking.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* Payment Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Details
            </CardTitle>
            <CardDescription>
              Complete your payment to secure your booking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between text-lg">
              <span className="font-medium">Total Amount:</span>
              <span className="font-bold text-2xl">
                {booking.currency} {parseFloat(booking.amount).toLocaleString()}
              </span>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <Badge className={getStatusColor(booking.payment_status)}>
                  {booking.payment_status}
                </Badge>
              </div>
              {booking.merchant_reference && (
                <div className="flex justify-between">
                  <span>Merchant Reference:</span>
                  <span className="font-mono text-xs">
                    {booking.merchant_reference}
                  </span>
                </div>
              )}
            </div>

            <Separator />

            {booking.payment_status === "PENDING" && (
              <Button
                onClick={handlePayment}
                disabled={isProcessingPayment}
                className="w-full h-12 text-lg font-semibold"
                size="lg"
              >
                {isProcessingPayment ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 mr-2" />
                    Pay {booking.currency}{" "}
                    {parseFloat(booking.amount).toLocaleString()}
                  </>
                )}
              </Button>
            )}

            {booking.payment_status === "PAID" && (
              <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-green-600 font-semibold mb-2">
                  Payment Completed!
                </div>
                <p className="text-sm text-green-700">
                  Your booking has been confirmed.
                </p>
                {booking.confirmation_code && (
                  <p className="text-xs text-green-600 mt-2">
                    Confirmation Code: {booking.confirmation_code}
                  </p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default BookingPayment;
