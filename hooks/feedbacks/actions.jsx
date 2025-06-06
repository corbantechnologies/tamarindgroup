"use client";

import {
  getFeedbacksByAllFilters,
  getFeedbacksByFeedbackForm,
} from "@/services/feedbacks";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";

export function useFetchFeedbacksByFeedbackForm(form_identity) {
  const axios = useAxiosAuth();

  return useQuery({
    queryKey: ["feedbacks", form_identity],
    queryFn: () => getFeedbacksByFeedbackForm(form_identity, axios),
    enabled: !!form_identity,
  });
}

export function useFetchFeedbacksByAllFilters(
  form_identity,
  startDate,
  endDate
) {
  const axios = useAxiosAuth();

  return useQuery({
    queryKey: ["feedbacks", form_identity, startDate, endDate],
    queryFn: () =>
      getFeedbacksByAllFilters(form_identity, startDate, endDate, axios),
    enabled: !!form_identity && !!startDate && !!endDate,
  });
}
