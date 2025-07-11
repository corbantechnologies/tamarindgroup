"use client";

import { getBooking, getBookings } from "@/services/bookings";
import { useQuery } from "@tanstack/react-query";

export function useFetchBookings() {
  return useQuery({
    queryKey: ["bookings"],
    queryFn: () => getBookings(),
  });
}

export function useFetchBooking(reference) {
  return useQuery({
    queryKey: ["booking", reference],
    queryFn: () => getBooking(reference),
    enabled: !!reference,
  });
}
