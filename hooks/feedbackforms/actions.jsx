"use client";

import { getFeedbackForm, getFeedbackForms } from "@/services/feedbackforms";
import { useQuery } from "@tanstack/react-query";

export function useFetchFeedbackForms() {
  return useQuery({
    queryKey: ["feedbackforms"],
    queryFn: () => getFeedbackForms(),
  });
}

export function useFetchFeedbackForm(form_identity) {
  return useQuery({
    queryKey: ["feedbackforms", form_identity],
    queryFn: () => getFeedbackForm(form_identity),
    enabled: !!form_identity,
  });
}
