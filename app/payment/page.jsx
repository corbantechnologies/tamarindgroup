"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import LoadingSpinner from "@/components/general/LoadingSpinner";

function Payment() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  const bookingReference = searchParams.get("bookingReference");
  const ticketType = searchParams.get("ticketType");
  const quantity = searchParams.get("quantity");
  const amount = searchParams.get("amount");
  const name = searchParams.get("name");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!bookingReference || !ticketType || !quantity || !amount) {
      router.push("/events");
    }
    // TODO: Fetch booking details using bookingReference to verify
    // Example: const booking = await fetchBooking(bookingReference);
  }, [bookingReference, ticketType, quantity, amount, router]);

  const handlePayment = async () => {
    setLoading(true);
    try {
      // TODO: Integrate payment gateway (e.g., Stripe Checkout)
      // Example: const session = await initiateStripeCheckout({ bookingReference, amount });
      // window.location.href = session.url;
      alert("Payment processing placeholder");
      // Simulate updating booking status
      await fetch("/api/v1/bookings/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_reference: bookingReference,
          status: "CONFIRMED",
        }),
      });
      router.push(`/events?payment=success&reference=${bookingReference}`);
    } catch (error) {
      alert("Payment failed!");
      router.push(`/events?payment=failed`);
    } finally {
      setLoading(false);
    }
  };

  if (!bookingReference || !ticketType || !quantity || !amount) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-sm p-6 max-w-lg w-full mx-4">
        <h2 className="text-2xl font-semibold mb-4">Complete Payment</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            <strong>Booking Reference:</strong> {bookingReference}
          </p>
          <p className="text-gray-700">
            <strong>Ticket Type:</strong> {ticketType}
          </p>
          <p className="text-gray-700">
            <strong>Quantity:</strong> {quantity}
          </p>
          <p className="text-gray-700">
            <strong>Total Amount:</strong> KES{" "}
            {parseFloat(amount).toLocaleString()}
          </p>
          <p className="text-gray-700">
            <strong>Name:</strong> {name}
          </p>
          {email && (
            <p className="text-gray-700">
              <strong>Email:</strong> {email}
            </p>
          )}
          <div className="border p-4 rounded-md">
            <p className="text-gray-600">
              Enter payment details (e.g., card info)
            </p>
            {/* TODO: Add Stripe Checkout or similar payment form */}
          </div>
          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-red-600 text-white py-3 px-4 rounded-lg font-medium text-lg hover:bg-red-700 disabled:bg-red-400"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Payment;
