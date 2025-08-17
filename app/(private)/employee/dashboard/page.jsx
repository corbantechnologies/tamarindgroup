"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchAccount } from "@/hooks/accounts/actions";
import {
  useFetchApprovalRequest,
  useFetchApprovalRequests,
} from "@/hooks/approvalrequests/actions";
import React from "react";

function EmployeeDashboard() {
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();

  const {
    isLoading: isLoadingApprovalRequests,
    data: approvalRequests,
    refetch: refetchApprovalRequests,
  } = useFetchApprovalRequests();

  if (isLoadingAccount || isLoadingApprovalRequests) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <section className="mb-3">
        <h2 className="text-2xl font-bold">Hello {account?.name || "User"}</h2>
      </section>

      <section className="mb-3">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Your Approval Requests</h3>

          <button className="primary-button px-2 py-1 rounded">Request</button>
        </div>

        {approvalRequests?.length > 0 ? (
          <ul className="list-disc pl-5">
            {approvalRequests.map((approvalRequest) => (
              <li key={approvalRequest.reference}>
                {approvalRequest.description}
              </li>
            ))}
          </ul>
        ) : (
          <p>No approval requests found.</p>
        )}
      </section>
    </div>
  );
}

export default EmployeeDashboard;
