"use client";

import { apiActions, apiMultipartActions } from "@/tools/api";

export const getEvents = async () => {
  const response = await apiMultipartActions?.get(`/api/v1/events/`);
  return response?.data?.results || [];
};

export const getEvent = async (event_identity) => {
  const response = await apiMultipartActions?.get(
    `/api/v1/events/${event_identity}/`
  );
  return response?.data || {};
};

export const createEvent = async (formData, axios) => {
  try {
    await apiMultipartActions?.post(`/api/v1/events/`, formData, axios);
  } catch (error) {
    console.error("Create Event Error:", error.response?.data || error.message);
    throw error;
  }
};
