"use client";

import {
  getFeedbacksByAllFilters,
  getFeedbacksByFeedbackForm,
} from "@/services/feedbacks";
import { useQuery } from "@tanstack/react-query";

export function useFetchFeedbacksByFeedbackForm(form_identity) {

  return useQuery({
    queryKey: ["feedbacks", form_identity],
    queryFn: () => getFeedbacksByFeedbackForm(form_identity),
    enabled: !!form_identity,
  });
}

export function useFetchFeedbacksByAllFilters(
  form_identity,
  startDate,
  endDate
) {

  return useQuery({
    queryKey: ["feedbacks", form_identity, startDate, endDate],
    queryFn: () =>
      getFeedbacksByAllFilters(form_identity, startDate, endDate),
    enabled: !!form_identity && !!startDate && !!endDate,
  });
}
