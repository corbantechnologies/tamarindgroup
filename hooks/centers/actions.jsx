"use client";

import { getCenter, getCenters } from "@/services/centers";
import { useQuery } from "@tanstack/react-query";

export function useFetchCenters() {
  return useQuery({
    queryKey: ["centers"],
    queryFn: () => getCenters(),
  });
}

export function useFetchCenter(center_identity) {
  return useQuery({
    queryKey: ["centers", center_identity],
    queryFn: () => getCenter(center_identity),
    enabled: !!center_identity,
  });
}
