import { apiActions } from "@/tools/api";

export const createBooking = async (formData) => {
  const response =await apiActions?.post(`/api/v1/bookings/create/event/`, formData);
  return response
};


