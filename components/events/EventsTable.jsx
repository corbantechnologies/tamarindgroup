import Link from "next/link";
import React from "react";

function EventsTable({ events }) {
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
            {events?.map((event) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default EventsTable;
