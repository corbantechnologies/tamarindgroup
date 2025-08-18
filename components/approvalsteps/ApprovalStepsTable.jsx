import React from "react";

function ApprovalStepsTable({ approvalSteps, pagination, onPageChange }) {
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

  // Filter steps where approver is finance@mail.com or manager@mail.com
  const filteredSteps =
    approvalSteps?.filter(
      (step) =>
        step.approver === "finance@mail.com" ||
        step.approver === "manager@mail.com"
    ) || [];

  // Calculate pagination details
  const totalItems = pagination?.count || filteredSteps.length;
  const currentPage = pagination?.page || 1;
  const itemsPerPage = 5; // Fixed page size
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers
  const pageNumbers = [];
  const maxPagesToShow = 5;
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
              Title
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
              Description
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
              Status
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
              Approver
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
              Step Order
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
              Comments
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
              Created At
            </th>
            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border-b">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredSteps.length > 0 ? (
            filteredSteps.map((step) => (
              <tr key={step.reference} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {step.request_info.title}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {step.request_info.description}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                      step.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : step.status === "APPROVED"
                        ? "bg-green-100 text-green-800"
                        : step.status === "REJECTED"
                        ? "bg-red-100 text-red-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {step.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {step.approver}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {step.step_order}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {step.comments || "None"}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  {formatDate(step.created_at)}
                </td>
                <td className="px-4 py-2 text-sm text-gray-900 border-b">
                  <button
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                    onClick={() => alert(`View details for ${step.reference}`)}
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
                No approval steps requiring your approval.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-gray-600">
            Showing {startIndex} to {endIndex} of {totalItems} steps
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={!pagination?.previous}
              className={`px-3 py-1 rounded text-sm font-medium primary-button ${
                !pagination?.previous
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
            >
              Previous
            </button>

            {pageNumbers.map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded text-sm font-medium ${
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
              className={`px-3 py-1 rounded text-sm font-medium primary-button ${
                !pagination?.next
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600"
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
