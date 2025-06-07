// fetch feedbacks by feedback form
// fetch feedbacks by date range
// fetch by center

"use client";

import { apiActions } from "@/tools/api";

export const createFeedback = async (formData) => {
  await apiActions?.post(`/api/v1/feedback/create/`, formData);
};

export const getFeedbacksByCenter = async (center_identity) => {
  const response = await apiActions?.get(
    `/api/v1/feedback/?center=${center_identity}`
  );
  return response?.data?.results || [];
};

export const getFeedbacksByFeedbackForm = async (form_identity) => {
  const response = await apiActions?.get(
    `/api/v1/feedback/?feedback_form=${form_identity}`
  );

  return response?.data?.results || [];
};

export const getFeedbacksByDate = async (date) => {
  const response = await apiActions?.get(`/api/v1/feedback/?date=${date}`);

  return response?.data?.results || [];
};

export const getFeedbacksByDateRange = async (startDate, endDate) => {
  const response = await apiActions?.get(
    `/api/v1/feedback/?start_date=${startDate}&end_date=${endDate}`
  );
  return response?.data?.results || [];
};

export const getFeedbacksByAllFilters = async (
  center_identity,
  form_identity,
  startDate,
  endDate
) => {
  const response = await apiActions?.get(
    `/api/v1/feedback/?feedback_form=${form_identity}&start_date=${startDate}&end_date=${endDate}`
  );
  return response?.data?.results || [];
};
