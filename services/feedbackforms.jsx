"use client";

import { apiActions } from "@/tools/api";

// authenticated API calls for feedback forms
export const createFeedbackForm = async (formData, axios) => {
  await apiActions?.post(`/api/v1/feedbackforms/`, formData, axios);
};

export const updateFeedbackForm = async (formData, axios, form_identity) => {
  await apiActions?.patch(
    `/api/v1/feedbackforms/${form_identity}/`,
    formData,
    axios
  );
};

export const deleteFeedbackForm = async (form_identity, axios) => {
  await apiActions?.delete(`/api/v1/feedbackforms/${form_identity}/`, axios);
};

// public API calls for feedback forms
export const getFeedbackForms = async () => {
  const response = await apiActions?.get(`/api/v1/feedbackforms/`);
  return response?.data?.results || [];
};

export const getFeedbackForm = async (form_identity) => {
  const response = await apiActions?.get(
    `/api/v1/feedbackforms/${form_identity}/`
  );
  return response?.data || {};
};
