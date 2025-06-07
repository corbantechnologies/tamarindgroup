"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import { useFetchFeedbackForms } from "@/hooks/feedbackforms/actions";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

  console.log(centers);

  if (isLoadingAccount || isLoadingCenters || isLoadingFeedbackForms) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto p-4">
      <section className="mb-3">
        <h2 className="text-2xl font-bold">Hello {account?.name}</h2>
      </section>

      <section id="summary" className="mb-3">
        <h6 className="text-xl font-semibold italic underline mb-2">Summary</h6>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold">Information</h4>
            <p>{account?.name}</p>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold">Total Centers</h4>
            <p>{centers?.length || 0}</p>
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
            <h6 className="text-xl font-semibold">Responses</h6>

            <button className="primary-button px-2 py-1 rounded text-center leading-[1.5rem]">
              Create Center
            </button>
          </div>

          {centers?.length > 0 ? (
            <></>
          ) : (
            <div className="p-3 w-full bg-blue-100">No centers available</div>
          )}
        </div>
      </section>

      <section id="centers" className="mb-3">
        <h6 className="text-xl font-semibold italic underline mb-2">Centers</h6>
        {centers?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {centers?.map((center) => (
              <Link
                href={`/centers/${center?.center_identity}`}
                key={center.reference}
                className="bg-white p-4 rounded shadow flex flex-row items-start"
              >
                <div className="flex-shrink-0 w-1/3">
                  <div className="flex-shrink-0 w-1/3">
                    <Image
                      src={center?.logo || "/logo.png"}
                      alt={center?.name}
                      width={128}
                      height={128}
                      className="w-full h-32 object-contain mb-2 rounded"
                    />
                  </div>
                </div>
                <div className="flex-1 pl-4">
                  <h4 className="font-bold">{center?.name}</h4>
                  <p>{center?.location}</p>
                  <p>{center?.contact}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p>No centers available.</p>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
