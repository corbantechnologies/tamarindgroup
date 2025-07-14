"use client";
import { useParams } from "next/navigation";
import React from "react";

function EventDetail() {
  const { identity } = useParams();
  return <div>{identity}</div>;
}

export default EventDetail;
