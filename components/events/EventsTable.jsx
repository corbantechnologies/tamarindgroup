import Link from "next/link";
import React, { useState } from "react";

function EventsTable({ events = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Pagination for Events
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = Array.isArray(events)
    ? events.slice(indexOfFirstEvent, indexOfLastEvent)
    : [];
  const totalPages = Math.ceil((events?.length || 0) / itemsPerPage);

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
              <th className="border border-gray-300 px-4 py-2">Date</th>
              <th className="border border-gray-300 px-4 py-2">Time</th>
              <th className="border border-gray-300 px-4 py-2">Venue</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {currentEvents.length > 0 ? (
              currentEvents.map((event) => (
                <tr key={event?.reference}>
                  <td className="border border-gray-300 px-4 py-2">
                    {event.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {event.start_date}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {event.start_time}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {event.venue}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <Link
                      href={`/events/${event?.identity}`}
                      className="primary-button px-2 py-1 rounded text-center leading-[1.5rem]"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No events available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {currentEvents.length > 0 && (
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

export default EventsTable;
