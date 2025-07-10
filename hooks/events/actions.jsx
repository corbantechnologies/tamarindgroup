"use client";

import { getEvent, getEvents } from "@/services/events";
import { useQuery } from "@tanstack/react-query";

export function useFetchEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: () => getEvents(),
  });
}

export function useFetchEvent(event_identity) {
  return useQuery({
    queryKey: ["events", event_identity],
    queryFn: () => getEvent(event_identity),
    enabled: !!event_identity,
  });
}
