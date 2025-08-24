"use client";

import { apiActions, apiMultipartActions } from "@/tools/api";

export const createApprovalRequest = async (formData, axios) => {
  await apiMultipartActions?.post(`/api/v1/approvalrequests/`, formData, axios);
};

export const getApprovalRequests = async (axios) => {
  const response = await apiActions?.get(`/api/v1/approvalrequests/`, axios);
  return response?.data?.results || [];
};

export const getApprovalRequest = async (axios, reference) => {
  const response = await apiActions?.get(
    `/api/v1/approvalrequests/${reference}/`,
    axios
  );
  return response?.data || {};
};

export const updateApprovalRequest = async (axios, reference, formData) => {
  await apiMultipartActions?.put(
    `/api/v1/approvalrequests/${reference}/`,
    formData,
    axios
  );
};
