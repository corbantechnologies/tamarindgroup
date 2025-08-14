"use client";

import { apiActions } from "@/tools/api";

export const createApprovalStep = async (axios, formData) => {
  await apiActions?.post(`/api/v1/approvalsteps/`, formData, axios);
};

export const getApprovalSteps = async (axios) => {
  const response = await apiActions?.get(`/api/v1/approvalsteps/`, axios);
  return response?.data?.results || [];
};

export const getApprovalStep = async (axios, reference) => {
  const response = await apiActions?.get(
    `/api/v1/approvalsteps/${reference}/`,
    axios
  );
  return response?.data || {};
};

export const updateApprovalStep = async (axios, reference, formData) => {
  await apiActions?.put(`/api/v1/approvalsteps/${reference}/`, formData, axios);
};
