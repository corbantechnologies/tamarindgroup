"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Clock, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import { apiActions } from "@/tools/api";
import LoadingSpinner from "@/components/general/LoadingSpinner";

function PayBooking() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  // Extract query parameters
  const bookingReference = searchParams.get("bookingReference");
  const ticketType = searchParams.get("ticketType");
  const quantity = parseInt(searchParams.get("quantity")) || 1;
  const amount = parseFloat(searchParams.get("amount")) || 0;
  const name = decodeURIComponent(searchParams.get("name") || "");
  const email = decodeURIComponent(searchParams.get("email") || "");
  const phone = decodeURIComponent(searchParams.get("phone") || "");

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          toast.error("Booking session expired. Please create a new booking.");
          router.push("/events");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const formatTimeLeft = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePayment = async () => {
    if (!bookingReference) {
      toast.error("Invalid booking reference");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        booking_reference: bookingReference,
      };

      const response = await apiActions.post(
        "/api/v1/payments/pay/",
        payload
      );
      const { redirect_url } = response.data;

      if (redirect_url) {
        window.location.href = redirect_url; // Redirect to Pesapal payment page
      } else {
        throw new Error("No redirect URL returned from payment API");
      }
    } catch (error) {
      console.error("Payment initiation error:", error);
      toast.error(
        "Error initiating payment: " + (error.message || "Please try again")
      );
      setLoading(false);
    }
  };

  if (!bookingReference || !ticketType || !name || !phone) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">
            Invalid booking details. Please try again.
          </p>
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push("/events")}
          className="flex items-center gap-2 mb-6 text-gray-700 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-2xl font-semibold mb-4">Confirm Your Booking</h2>
          <p className="text-gray-600 mb-6">
            Please review your booking details and proceed to payment. Complete
            the payment within{" "}
            <span className="font-semibold text-red-600">
              {formatTimeLeft()}
            </span>{" "}
            to secure your tickets.
          </p>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="text-lg font-medium">Booking Details</h3>
              <p className="text-gray-700">
                <strong>Reference:</strong> {bookingReference}
              </p>
              <p className="text-gray-700">
                <strong>Ticket Type:</strong> {ticketType}
              </p>
              <p className="text-gray-700">
                <strong>Quantity:</strong> {quantity}
              </p>
              <p className="text-gray-700">
                <strong>Total Amount:</strong> KES {amount.toLocaleString()}
              </p>
            </div>

            <div className="border-b pb-4">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <p className="text-gray-700">
                <strong>Name:</strong> {name}
              </p>
              <p className="text-gray-700">
                <strong>Email:</strong> {email || "Not provided"}
              </p>
              <p className="text-gray-700">
                <strong>Phone:</strong> {phone}
                <span className="text-sm text-red-500 ml-2">
                  (Used for M-Pesa payment and ticket verification)
                </span>
              </p>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5 text-red-600" />
              <p>
                Time remaining:{" "}
                <span className="font-semibold">{formatTimeLeft()}</span>
              </p>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-md hover:bg-red-700 disabled:bg-red-400"
            >
              {loading ? <LoadingSpinner /> : "Pay with Pesapal"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayBooking;
