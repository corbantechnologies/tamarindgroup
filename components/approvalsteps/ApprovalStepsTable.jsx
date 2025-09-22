import Link from "next/link";
import React, { useState } from "react";

function ApprovalStepsTable({ approvalSteps, pagination, onPageChange }) {
  const [statusFilter, setStatusFilter] = useState("All");

  // Format date to a readable format (e.g., "Aug 18, 2025, 6:35 PM")
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  // Sort approvalSteps: Pending first, then others
  const sortedSteps = [...(approvalSteps || [])].sort((a, b) => {
    if (a.status === "Pending" && b.status !== "Pending") return -1;
    if (a.status !== "Pending" && b.status === "Pending") return 1;
    return 0;
  });

  // Filter steps based on statusFilter
  const filteredSteps =
    statusFilter === "All"
      ? sortedSteps
      : sortedSteps.filter(
          (step) => step.status.toLowerCase() === statusFilter.toLowerCase()
        );

  // Calculate pagination details
  const totalItems = pagination?.count || filteredSteps.length;
  const currentPage = pagination?.page || 1;
  const itemsPerPage = 5;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const currentItems = filteredSteps.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate page numbers
  const pageNumbers = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Status Filter Dropdown */}
      <div className="mb-4 flex justify-end">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Skipped">Skipped</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto border border-gray-200 rounded-lg">
          <thead className="bg-gray-50 text-gray-700 text-xs sm:text-sm font-semibold">
            <tr>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-left min-w-[150px]">
                Title
              </th>
              <th className="hidden md:table-cell px-4 sm:px-6 py-2 sm:py-3 text-left min-w-[150px]">
                Description
              </th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-left min-w-[100px]">
                Status
              </th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-left min-w-[120px]">
                Approver
              </th>
              <th className="hidden lg:table-cell px-4 sm:px-6 py-2 sm:py-3 text-left min-w-[150px]">
                Created At
              </th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-left min-w-[100px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems?.length > 0 ? (
              currentItems.map((step) => (
                <tr
                  key={step.reference}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    {step.request_info.title}
                  </td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    {step.request_info.description}
                  </td>
                  <td className="px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    <span
                      className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        step.status === "Pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : step.status === "Approved"
                          ? "bg-green-100 text-green-800"
                          : step.status === "Rejected"
                          ? "bg-red-100 text-red-800"
                          : step.status === "Reviewed"
                          ? "bg-blue-100 text-blue-800"
                          : step.status === "Skipped"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {step.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    {step.approver}
                  </td>
                  <td className="hidden lg:table-cell px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    {formatDate(step.created_at)}
                  </td>
                  <td className="px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    <Link
                      href={`/approvalsteps/${step.reference}`}
                      className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-500 text-center"
                >
                  No approval steps found for the selected status.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4">
          <div className="text-xs sm:text-sm text-gray-600">
            Showing {startIndex} to {endIndex} of {totalItems} steps
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination?.previous}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                !pagination?.previous
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                  currentPage === page
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={!pagination?.next}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                !pagination?.next
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ApprovalStepsTable;
