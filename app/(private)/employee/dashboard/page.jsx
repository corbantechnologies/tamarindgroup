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

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoadingAccount || isLoadingApprovalRequests || isLoadingUsers) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl p-4 sm:p-6">
        <section className="mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-indigo-700">
            Hello {account?.name || "User"}
          </h2>
        </section>

        <section className="mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
            <h3 className="text-lg sm:text-xl font-semibold text-indigo-700">
              Your Approval Requests
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="mt-2 sm:mt-0 bg-purple-400 text-white px-4 py-2 rounded-md hover:bg-purple-500 focus:ring-2 focus:ring-purple-300 focus:outline-none"
            >
              Request
            </button>
          </div>

          {Array.isArray(approvalRequests) && approvalRequests.length > 0 ? (
            <ApprovalRequestsTable approvalrequests={approvalRequests} />
          ) : (
            <div className="p-4 italic text-red-600 bg-white border border-red-200 rounded-lg shadow-sm">
              No approval requests found.
            </div>
          )}
        </section>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-semibold"
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
    </div>
  );
}

export default EmployeeDashboard;
