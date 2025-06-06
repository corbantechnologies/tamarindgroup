"use client";

import { apiMultipartActions } from "@/tools/api";

// Authenticated API calls for centers
export const createCenter = async (formData, axios) => {
  await apiMultipartActions?.post(`/api/v1/centers/`, formData, axios);
};

export const updateCenter = async (center_identity, formData, axios) => {
  await apiMultipartActions?.patch(
    `/api/v1/centers/${center_identity}/`,
    formData,
    axios
  );
};

export const deleteCenter = async (center_identity, axios) => {
  await apiMultipartActions?.delete(`/api/v1/centers/${center_identity}/`, axios);
};

// Public API calls for centers
export const getCenters = async () => {
  const response = await apiMultipartActions?.get(`/api/v1/centers/`);
  return response?.data?.results || [];
};

export const getCenter = async (center_identity) => {
  const response = await apiMultipartActions?.get(
    `/api/v1/centers/${center_identity}/`
  );
  return response?.data || {};
};
