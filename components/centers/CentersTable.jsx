import Link from "next/link";
import React, { useState } from "react";

function CentersTable({ centers }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination for Centers
  const indexOfLastCenter = currentPage * itemsPerPage;
  const indexOfFirstCenter = indexOfLastCenter - itemsPerPage;
  const currentCenters = Array.isArray(centers)
    ? centers.slice(indexOfFirstCenter, indexOfLastCenter)
    : [];
  const totalPages = Math.ceil((centers?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full table-auto border rounded border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-700 text-sm">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Phone</th>
              <th className="border border-gray-300 px-4 py-2">Location</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentCenters.length > 0 ? (
              currentCenters.map((center) => (
                <tr key={center.reference}>
                  <td className="border border-gray-300 px-4 py-2">
                    {center?.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {center?.contact}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {center?.location}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link
                      href={`/centers/${center?.center_identity}`}
                      className="primary-button px-2 py-1 rounded text-center leading-[1.5rem]"
                    >
                      View
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No centers available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {currentCenters.length > 0 && (
        <div className="mt-4 flex justify-between items-center">
          <button
            className="primary-button px-4 py-2 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index + 1}
                className={`px-3 py-1 rounded ${
                  currentPage === index + 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            className="primary-button px-4 py-2 rounded disabled:opacity-50"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default CentersTable;
