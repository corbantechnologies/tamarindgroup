"use client";

import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import React from "react";

function FinanceDashboard() {
  const {
    isLoading: isLoadingApprovalRequests,
    data: approvalRequests,
    refetch: refetchApprovalRequests,
  } = useFetchApprovalRequests();

  console.log("Approval Requests:", approvalRequests);
  

  return <div>FinanceDashboard</div>;
}

export default FinanceDashboard;
