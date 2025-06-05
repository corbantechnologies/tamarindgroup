"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchAccount } from "@/hooks/accounts/actions";
import React from "react";

function AdminDashboard() {
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();

  if (isLoadingAccount) {
    return <LoadingSpinner />;
  }

  return <div>Welcome {account?.email}</div>;
}

export default AdminDashboard;
