"use client";

import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "../general/useAxiosAuth";
import { getApprovalStep, getApprovalSteps } from "@/services/approvalsteps";

export function useFetchApprovalSteps() {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["approvalSteps"],
    queryFn: () => getApprovalSteps(axios),
  });
}

export function useFetchApprovalStep(reference) {
  const axios = useAxiosAuth();
  return useQuery({
    queryKey: ["approvalStep", reference],
    queryFn: () => getApprovalStep(axios, reference),
    enabled: !!reference,
  });
}
