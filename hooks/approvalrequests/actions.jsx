"use client";

import {
  getApprovalRequest,
  getApprovalRequests,
} from "@/services/approvalrequests";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../general/useAxiosAuth";

export function useFetchApprovalRequests() {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["approvalRequests"],
    queryFn: () => getApprovalRequests(axios),
  });
}

export function useFetchApprovalRequest(reference) {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["approvalRequest", reference],
    queryFn: () => getApprovalRequest(axios, reference),
    enabled: !!reference,
  });
}
