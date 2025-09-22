import React, { useState } from "react";

function ApprovalRequestsTable({ approvalrequests }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const itemsPerPage = 5;

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

  // Sort approvalrequests: PENDING first, then others
  const sortedRequests = [...(approvalrequests || [])].sort((a, b) => {
    if (a.status === "PENDING" && b.status !== "PENDING") return -1;
    if (a.status !== "PENDING" && b.status === "PENDING") return 1;
    return 0;
  });

  // Filter requests based on statusFilter
  const filteredRequests =
    statusFilter === "ALL"
      ? sortedRequests
      : sortedRequests.filter((request) => request.status === statusFilter);

  // Calculate pagination details
  const totalItems = filteredRequests?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredRequests.slice(startIndex, endIndex) || [];

  // Handle page navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

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
          <option value="ALL">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="APPROVED">APPROVED</option>
          <option value="REJECTED">REJECTED</option>
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
              <th className="hidden lg:table-cell px-4 sm:px-6 py-2 sm:py-3 text-left min-w-[120px]">
                Request Type
              </th>
              <th className="px-4 sm:px-6 py-2 sm:py-3 text-left min-w-[120px]">
                Created By
              </th>
              <th className="hidden md:table-cell px-4 sm:px-6 py-2 sm:py-3 text-left min-w-[120px]">
                First Approver
              </th>
              <th className="hidden lg:table-cell px-4 sm:px-6 py-2 sm:py-3 text-left min-w-[150px]">
                Created At
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems && currentItems.length > 0 ? (
              currentItems.map((request) => (
                <tr
                  key={request.reference}
                  className="hover:bg-gray-100 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    {request.title}
                  </td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    {request.description}
                  </td>
                  <td className="px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    <span
                      className={`inline-flex px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                        request.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : request.status === "APPROVED"
                          ? "bg-green-100 text-green-800"
                          : request.status === "REJECTED"
                          ? "bg-red-100 text-red-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {request.status}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    {request.request_type}
                  </td>
                  <td className="px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    {request.created_by}
                  </td>
                  <td className="hidden md:table-cell px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    {request.first_approver || "None"}
                  </td>
                  <td className="hidden lg:table-cell px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-900 border-t border-gray-200">
                    {formatDate(request.created_at)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-500 text-center"
                >
                  No approval requests found for the selected status.
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
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} requests
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              Previous
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
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
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium ${
                currentPage === totalPages
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

export default ApprovalRequestsTable;
