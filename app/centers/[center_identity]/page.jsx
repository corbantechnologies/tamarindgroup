"use client";

import { useFetchCenter } from "@/hooks/centers/actions";
import React, { use } from "react";

function CenterDetail({ params }) {
  const { center_identity } = use(params);

  console.log(center_identity);

  const {
    isLoading: isLoadingCenter,
    data: center,
    refetch: refetchCenter,
  } = useFetchCenter(center_identity);

  console.log(center);

  return (
    <section id="center">
      {/* Feedback forms */}
      <div className="mb-3 p-3 rounded shadow bg-white border-gray-300">
        <h6 className="text-xl mb-3 font-semibold">Feedback Forms</h6>

        {center?.feedback_forms?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full table-auto border rounded border-gray-300">
              <thead>
                <tr className="bg-gray-200 text-gray-700 text-sm">
                  <th className="px-2 py-2 text-left min-w-[120px]">Title</th>
                  <th className="px-2 py-2 text-left min-w-[150px]">
                    Description
                  </th>
                  <th className="px-2 py-2 text-left min-w-[80px]">
                    Questions
                  </th>
                  <th className="px-2 py-2 text-left min-w-[80px]">
                    Submissions
                  </th>
                  <th className="px-2 py-2 text-left min-w-[100px]">
                    Accommodation
                  </th>
                  <th className="px-2 py-2 text-left min-w-[80px]">Action</th>
                </tr>
              </thead>
              <tbody>
                {center?.feedback_forms?.map((feedbackForm, index) => (
                  <tr
                    key={feedbackForm?.id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-2 py-2 border-t text-sm">
                      {feedbackForm?.title}
                    </td>
                    <td className="px-2 py-2 border-t text-sm">
                      {feedbackForm?.description}
                    </td>
                    <td className="px-2 py-2 border-t text-sm">
                      {feedbackForm?.questions?.length}
                    </td>
                    <td className="px-2 py-2 border-t text-sm">
                      {feedbackForm?.form_submissions?.length}
                    </td>
                    <td className="px-2 py-2 border-t text-sm">
                      {feedbackForm?.is_accomodation ? "Yes" : "No"}
                    </td>
                    <td className="px-2 py-2 border-t text-sm">
                      <button className="text-blue-600 hover:underline">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-3 w-full bg-blue-100">
            No feedback forms available for this center
          </div>
        )}
      </div>
    </section>
  );
}

export default CenterDetail;
