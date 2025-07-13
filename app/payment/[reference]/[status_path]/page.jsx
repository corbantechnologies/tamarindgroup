// pages/payments/[reference]/[status].jsx
"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { apiActions } from "@/tools/api";
import LoadingSpinner from "@/components/general/LoadingSpinner";

function BookingPaymentStatus() {
  const router = useRouter();
  const { reference, status } = useParams();
  const [booking, setBooking] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        // Fetch booking details
        const bookingResponse = await apiActions.get(
          `/api/v1/bookings/${reference}/`
        );
        const bookingData = bookingResponse.data;
        setBooking(bookingData);

        // Fetch tickets associated with the booking
        const ticketsResponse = await apiActions.get(
          `/api/v1/tickets/?booking_reference=${reference}`
        );
        setTickets(ticketsResponse.data);
        setLoading(false);

        // Normalize payment_status for case-insensitive comparison
        const paymentStatus = bookingData.payment_status.toUpperCase();
        if (paymentStatus === "COMPLETED") {
          toast.success(
            "Payment successful! Check your email for ticket details."
          );
        } else if (paymentStatus === "FAILED" || paymentStatus === "REVERSED") {
          toast.error("Payment failed. Please try again or contact support.");
        } else if (paymentStatus === "PENDING") {
          toast.error("Payment status pending. Please check back later.");
        } else {
          toast.error("Unknown payment status. Please contact support.");
        }
      } catch (error) {
        toast.error("Error loading booking details. Please try again.");
        setLoading(false);
      }
    };

    if (reference) {
      fetchBookingDetails();
    }
  }, [reference]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Booking not found.</p>
          <button
            onClick={() => router.push("/events")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  // Determine success based on payment_status
  const paymentStatus = booking.payment_status.toUpperCase();
  const isSuccess = paymentStatus === "COMPLETED";

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => router.push("/events")}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4 mb-6">
            {isSuccess ? (
              <CheckCircle className="w-12 h-12 text-green-500" />
            ) : (
              <XCircle className="w-12 h-12 text-red-500" />
            )}
            <h2 className="text-2xl font-semibold">
              {isSuccess ? "Payment Successful" : "Payment Failed"}
            </h2>
          </div>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium">Booking Details</h3>
              <p className="text-gray-700">
                <strong>Reference:</strong> {booking.reference}
              </p>
              <p className="text-gray-700">
                <strong>Event:</strong>{" "}
                {booking?.event || "Unknown Event"}
              </p>
              <p className="text-gray-700">
                <strong>Ticket Type:</strong>{" "}
                {booking.ticket_type?.name || booking.ticket_type}
              </p>
              <p className="text-gray-700">
                <strong>Quantity:</strong> {booking.quantity} ticket
                {booking.quantity > 1 ? "s" : ""}
              </p>
              <p className="text-gray-700">
                <strong>Total Amount:</strong> {booking.currency || "KES"}{" "}
                {parseFloat(booking.amount).toLocaleString()}
              </p>
              <p className="text-gray-700">
                <strong>Payment Status:</strong> {booking.payment_status}
              </p>
              {booking.payment_date && (
                <p className="text-gray-700">
                  <strong>Payment Date:</strong>{" "}
                  {new Date(booking.payment_date).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
              {booking.merchant_reference && (
                <p className="text-gray-700">
                  <strong>Merchant Reference:</strong>{" "}
                  {booking.merchant_reference}
                </p>
              )}
              {booking.confirmation_code && (
                <p className="text-gray-700">
                  <strong>Confirmation Code:</strong>{" "}
                  {booking.confirmation_code}
                </p>
              )}
              {booking.payment_method && (
                <p className="text-gray-700">
                  <strong>Payment Method:</strong> {booking.payment_method}
                </p>
              )}
              {booking.payment_account && (
                <p className="text-gray-700">
                  <strong>Payment Account:</strong> {booking.payment_account}
                </p>
              )}
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <p className="text-gray-700">
                <strong>Name:</strong> {booking.name}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {booking.email || "Not provided"}
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> {booking.phone}
              </p>
            </div>

            {isSuccess && tickets.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-4">Your Tickets</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {tickets.map((ticket) => (
                    <div
                      key={ticket.reference}
                      className="border rounded-lg p-4"
                    >
                      <p className="text-gray-700">
                        <strong>Ticket Reference:</strong> {ticket.reference}
                      </p>
                      {ticket.qr_code && (
                        <img
                          src={ticket.qr_code}
                          alt={`QR Code for ${ticket.reference}`}
                          className="w-32 h-32 mx-auto mt-2"
                        />
                      )}
                      <p className="text-sm text-gray-600 mt-2">
                        Present this QR code at check-in.
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isSuccess ? (
              <p className="text-gray-600">
                Your tickets have been sent to {booking.email || "your email"}.
                Please check your inbox (and spam/junk folder) for details. Use
                the QR codes above for check-in.
              </p>
            ) : (
              <p className="text-gray-600">
                The payment was not successful. Please try again or contact
                support at support@example.com.
              </p>
            )}
          </div>

          <button
            onClick={() => router.push("/events")}
            className="mt-6 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookingPaymentStatus;
