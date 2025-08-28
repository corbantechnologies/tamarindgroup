"use client";

import { apiActions } from "@/tools/api";

export const createApprovalStep = async (values, axios) => {
  await apiActions?.post(`/api/v1/approvalsteps/`, values, axios);
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

export const updateApprovalStep = async (reference, values, axios) => {
  await apiActions?.patch(
    `/api/v1/approvalsteps/${reference}/`,
    values,
    axios
  );
};
