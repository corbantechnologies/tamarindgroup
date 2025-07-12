"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import { useFetchEvents } from "@/hooks/events/actions";
import { useFetchFeedbackForms } from "@/hooks/feedbackforms/actions";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useMemo } from "react";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();

  const {
    isLoading: isLoadingCenters,
    data: centers,
    refetch: refetchCenters,
  } = useFetchCenters();

  const {
    isLoading: isLoadingFeedbackForms,
    data: feedbackForms,
    refetch: refetchFeedbackForms,
  } = useFetchFeedbackForms();

  const {
    isLoading: isLoadingEvents,
    data: events,
    refetch: refetchEvents,
  } = useFetchEvents();

  const [isModalOpen, setIsModalOpen] = useState(false);

  if (
    isLoadingAccount ||
    isLoadingCenters ||
    isLoadingFeedbackForms ||
    isLoadingEvents
  ) {
    return <LoadingSpinner />;
  }

  // Calculate statistics
  const stats = useMemo(() => {
    const totalBookings = mockEvents.reduce(
      (acc, event) =>
        acc +
        event.ticket_types.reduce(
          (typeAcc, type) => typeAcc + type.bookings.length,
          0
        ),
      0
    );

    const confirmedBookings = mockEvents.reduce(
      (acc, event) =>
        acc +
        event.ticket_types.reduce(
          (typeAcc, type) =>
            typeAcc +
            type.bookings.filter((b) => b.status === "CONFIRMED").length,
          0
        ),
      0
    );

    const totalRevenue = mockEvents.reduce(
      (acc, event) =>
        acc +
        event.ticket_types.reduce(
          (typeAcc, type) =>
            typeAcc +
            type.bookings
              .filter((b) => b.payment_status === "Completed")
              .reduce(
                (bookingAcc, booking) =>
                  bookingAcc + parseFloat(booking.amount),
                0
              ),
          0
        ),
      0
    );

    const conversionRate =
      totalBookings > 0 ? (confirmedBookings / totalBookings) * 100 : 0;

    return {
      totalBookings,
      confirmedBookings,
      totalRevenue,
      conversionRate,
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <section className="mb-3">
        <h2 className="text-2xl font-bold">Hello {account?.name}</h2>
      </section>

      <section id="summary" className="mb-3 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold">Information</h4>
            <p>{account?.name}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold">Total Centers</h4>
            <p>{centers?.length || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold">Events</h4>
            <p>{events?.length || 0}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold">Feedback Forms</h4>
            <p>{feedbackForms?.length || 0}</p>
          </div>
        </div>
      </section>

      <section className="mb-3 mt-3 py-3">
        <div className="mb-3 p-3 rounded shadow bg-white border border-gray-300">
          <div className="mb-3 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-300 pb-3">
            <h6 className="text-xl font-semibold">Centers</h6>
            <button
              className="primary-button px-2 py-1 rounded text-center leading-[1.5rem]"
              onClick={() => setIsModalOpen(true)}
            >
              Create Center
            </button>
          </div>

          {centers?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full table-auto border rounded border-gray-300">
                  <thead>
                    <tr className="bg-gray-200 text-gray-700 text-sm">
                      <th className="border border-gray-300 px-4 py-2">Name</th>
                      <th className="border border-gray-300 px-4 py-2">
                        Phone
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Location
                      </th>
                      <th className="border border-gray-300 px-4 py-2">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {centers?.map((center) => (
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
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-3 w-full bg-blue-100">No centers available</div>
          )}
        </div>
      </section>

      <section className="mb-3 mt-3 py-3">
        <div className="mb-3 p-3 rounded shadow bg-white border border-gray-300">
          <div className="mb-3 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-300 pb-3">
            <h6 className="text-xl font-semibold">Events</h6>
            <button className="primary-button px-2 py-1 rounded text-center leading-[1.5rem]">
              Create Event
            </button>
          </div>
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <CreateCenter
              refetch={refetchCenters}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
