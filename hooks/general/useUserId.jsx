"use client";
import { useSession } from "next-auth/react";
import React from "react";

function useUserId() {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  return userId;
}

export default useUserId;
