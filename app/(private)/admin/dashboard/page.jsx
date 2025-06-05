"use client";

import { useFetchAccount } from "@/hooks/accounts/actions";
import React from "react";

function AdminDashboard() {
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();

  return <div>Welcome {account?.email}</div>;
}

export default AdminDashboard;
