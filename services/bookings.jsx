import { apiActions } from "@/tools/api";

export const createBooking = async (formData) => {
  await apiActions?.post(`/api/v1/bookings/create/event/`, formData);
};

export const getBookings = async () => {
  const response = await apiActions?.get(`/api/v1/bookings/`);
  return response?.data?.results || [];
};

export const getBooking = async (reference) => {
  const response = await apiActions?.get(`/api/v1/bookings/${reference}/`);
  return response?.data || {};
};
