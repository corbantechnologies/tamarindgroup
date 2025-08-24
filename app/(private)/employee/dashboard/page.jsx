"use client";

import ApprovalRequestsTable from "@/components/approvalrequests/ApprovalRequestsTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import MakeApprovalRequest from "@/forms/approvalrequests/MakeApprovalRequest";
import { useFetchAccount, useFetchUsers } from "@/hooks/accounts/actions";
import { useFetchApprovalRequests } from "@/hooks/approvalrequests/actions";
import React, { useState } from "react";

function EmployeeDashboard() {
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

  const {
    isLoading: isLoadingApprovalRequests,
    data: approvalRequests,
    refetch: refetchApprovalRequests,
  } = useFetchApprovalRequests();

  console.log(approvalRequests);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
          <p>No approval requests found.</p>
        )}
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className=" p-6 rounded-lg shadow-lg w-full max-w-md max-h-full overflow-y-auto">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <MakeApprovalRequest
              refetch={refetchApprovalRequests}
              closeModal={() => setIsModalOpen(false)}
              users={users}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmployeeDashboard;
