"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchEvent } from "@/hooks/events/actions";
import { useParams } from "next/navigation";
import React from "react";

function EventDetail() {
  const { identity } = useParams();
  const {
    isLoading: isLoadingEvent,
    data: event,
    refetch: refetchEvent,
  } = useFetchEvent(identity);

  if (isLoadingEvent) return <LoadingSpinner />;

  return <div>{identity}</div>;
}

export default EventDetail;
