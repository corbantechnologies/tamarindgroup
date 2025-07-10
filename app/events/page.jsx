"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchEvents } from "@/hooks/events/actions";
import React from "react";

function Events() {
  const {
    isLoading: isLoadingEvents,
    data: events,
    refetch: refetchEvents,
  } = useFetchEvents();

  if (isLoadingEvents) {
    return <LoadingSpinner />;
  }

  console.log(events);

  return <div>Events</div>;
}

export default Events;
