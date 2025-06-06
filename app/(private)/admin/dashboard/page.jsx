"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { useFetchCenters } from "@/hooks/centers/actions";
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

  console.log(centers);

  if (isLoadingAccount || isLoadingCenters) {
    return <LoadingSpinner />;
  }

  return (
    <div className="p-4">
      <section className="mb-3">
        <h2 className="text-2xl font-bold">Hello {account?.name}</h2>
      </section>

      <section id="summary" className="mb-3">
        <h6 className="text-xl font-semibold italic underline mb-2">Summary</h6>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ">
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold">Total Centers</h4>
            <p>{centers?.length || 0}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold">Total Centers</h4>
            <p>{centers?.length || 0}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-bold">Total Centers</h4>
            <p>{centers?.length || 0}</p>
          </div>
        </div>
      </section>

      <section id="centers" className="mb-3">
        <h6 className="text-xl font-semibold italic underline mb-2">Centers</h6>
        {centers?.length > 0 ? (
          <div>
            <ul className="list-disc pl-5">
              {centers.map((center) => (
                <li key={center.id} className="mb-2">
                  {center.name}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No centers available.</p>
        )}
      </section>
    </div>
  );
}

export default AdminDashboard;
