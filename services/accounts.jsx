"use client";

import { apiActions } from "@/tools/api";

export const getUser = async (userId, axios) => {
  const response = await apiActions?.get(`/api/v1/auth/${userId}/`, axios);
  return response?.data || {};
};

export const updateProfile = async (userId, formData, axios) => {
  await apiActions?.patch(`/api/v1/auth/${userId}/`, formData, axios);
};

export const getUsers = async (axios) => {
  const response = await apiActions?.get("/api/v1/auth/", axios);
  return response?.data?.results || [];
};
