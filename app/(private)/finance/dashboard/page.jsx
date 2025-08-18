"use client";

import ApprovalRequestsTable from "@/components/approvalrequests/ApprovalRequestsTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchAccount, useFetchUsers } from "@/hooks/accounts/actions";
import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import React from "react";

function FinanceDashboard() {
  const {
    isLoading: isLoadingApprovalRequests,
    data: approvalRequests,
    refetch: refetchApprovalRequests,
  } = useFetchApprovalRequests();

  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();

  const {
    isLoading: isLoadingUsers,
    data: users,
    refetch: refetchUsers,
  } = useFetchUsers();

  console.log("Approval Requests:", approvalRequests);

  if (isLoadingAccount || isLoadingApprovalRequests || isLoadingUsers) {
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

          <button
            onClick={() => setIsModalOpen(true)}
            className="primary-button px-2 py-1 rounded"
          >
            Request
          </button>
        </div>

        {approvalRequests?.length > 0 ? (
          <ApprovalRequestsTable approvalrequests={approvalRequests} />
        ) : (
          <div className="p-3 bg-gray-400 italic text-white rounded">
            No approval requests found.
          </div>
        )}
      </section>
    </div>
  );
}

export default FinanceDashboard;
