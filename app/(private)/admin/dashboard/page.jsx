"use client";

import CentersTable from "@/components/centers/CentersTable";
import EventsTable from "@/components/events/EventsTable";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateCenter from "@/forms/centers/CreateCenter";
import CreateEvent from "@/forms/events/CreateEvent";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import { useFetchEvents } from "@/hooks/events/actions";
import { useFetchFeedbackForms } from "@/hooks/feedbackforms/actions";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

function AdminDashboard() {
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
  const [eventModalOpen, setEventModalOpen] = useState(false);

  if (
    isLoadingAccount ||
    isLoadingCenters ||
    isLoadingFeedbackForms ||
    isLoadingEvents
  ) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <section className="mb-3">
        <h2 className="text-2xl font-bold">Hello {account?.name || "User"}</h2>
      </section>

      <section id="summary" className="mb-3 mt-3">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold">Information</h4>
            <p>{account?.name}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="font-bold text-2xl">{centers?.length || 0}</p>
            <h4>Total Centers</h4>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="font-bold text-2xl">{feedbackForms?.length || 0}</p>
            <h4>Feedback Forms</h4>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <p className="font-bold text-2xl">{events?.length || 0}</p>
            <h4>Events</h4>
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
            <CentersTable centers={centers} />
          ) : (
            <div className="p-3 w-full bg-blue-100">No centers available</div>
          )}
        </div>
      </section>

      <section className="mb-3 mt-3 py-3">
        <div className="mb-3 p-3 rounded shadow bg-white border border-gray-300">
          <div className="mb-3 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-300 pb-3">
            <h6 className="text-xl font-semibold">Events</h6>
            <button
              className="secondary-button px-2 py-1 rounded text-center leading-[1.5rem]"
              onClick={() => setEventModalOpen(true)}
            >
              Create Event
            </button>
          </div>

          {events?.length > 0 ? (
            <EventsTable events={events} />
          ) : (
            <div className="p-3 w-full bg-blue-100">No events available</div>
          )}
        </div>
      </section>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md max-h-[80vh] overflow-y-auto">
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

      {eventModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-start justify-center z-50 pt-4">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
              onClick={() => setEventModalOpen(false)}
            >
              ✕
            </button>
            <CreateEvent
              refetch={refetchEvents}
              closeModal={() => setEventModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
