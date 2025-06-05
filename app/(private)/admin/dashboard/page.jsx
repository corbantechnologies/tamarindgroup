"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import React from "react";

function AdminDashboard() {
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();

  const {
    isLoading: isLoadingCenters,
    data: centers,
    refetch: refetchCenters,
  } = useFetchCenters();

  console.log(centers);

  if (isLoadingAccount || isLoadingCenters) {
    return <LoadingSpinner />;
  }

  return <div>Welcome {account?.email}</div>;
}

export default AdminDashboard;
