"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
import { useFetchFeedbackForms } from "@/hooks/feedbackforms/actions";
import Image from "next/image";
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
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

      <section id="centers" className="mb-3">
        <h6 className="text-xl font-semibold italic underline mb-2">Centers</h6>
        {centers?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {centers?.map((center) => (
              <div
                key={center.reference}
                className="bg-white p-4 rounded shadow"
              >
                <div>
                  {center?.logo ? (
                    <Image
                      src={center?.logo}
                      alt={center?.name}
                      width={50}
                      height={50}
                      className="w-full h-32 object-cover mb-2 rounded"
                    />
                  ) : (
                    <Image
                      src="/logo.png"
                      alt={center?.name}
                      width={50}
                      height={50}
                      className="w-full h-32 object-cover mb-2 rounded"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-bold">{center?.name}</h4>
                  <p>{center?.description}</p>
                  <p className="text-sm text-gray-500">
                    Reference: {center?.reference}
                  </p>
                </div>
              </div>
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
