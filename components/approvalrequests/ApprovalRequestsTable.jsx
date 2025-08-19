import React, { useState } from "react";

function ApprovalRequestsTable({ approvalrequests }) {
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page

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

  // Calculate pagination details
  const totalItems = approvalrequests?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = approvalrequests?.slice(startIndex, endIndex) || [];

  // Handle page navigation
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers (show limited range for brevity)
  const pageNumbers = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-auto border rounded border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Title</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Request Type</th>
            <th className="border border-gray-300 px-4 py-2">Created By</th>
            <th className="border border-gray-300 px-4 py-2">First Approver</th>
            <th className="border border-gray-300 px-4 py-2">Created At</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems && currentItems.length > 0 ? (
            currentItems.map((request) => (
              <tr key={request.reference} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {request.title}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {request.description}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
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
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {request.request_type}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {request.created_by}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {request.first_approver || "None"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {formatDate(request.created_at)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                    onClick={() =>
                      alert(`View details for ${request.reference}`)
                    }
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="px-4 py-2 text-sm text-gray-500 text-center"
              >
                No approval requests available.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of{" "}
            {totalItems} requests
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
              }`}
            >
              Previous
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
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
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-100 text-blue-700 hover:bg-blue-200"
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
