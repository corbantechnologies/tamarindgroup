import { apiActions } from "@/tools/api";

export const createBooking = async (formData) => {
  await apiActions?.post(`/api/v1/bookings/create/event/`, formData);
};
