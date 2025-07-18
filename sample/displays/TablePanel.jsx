"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import { useFetchFeedbacksByFeedbackForm } from "@/hooks/feedbacks/actions";
import React, { use, useState } from "react";

function FeedbackFormDetail({ params }) {
  const { center_identity, form_identity } = use(params);

  const {
    isLoading: isLoadingFeedbackForm,
    data: feedbackForm,
    refetch: refetchFeedbackForm,
  } = useFetchFeedbackForm(form_identity);

  const {
    isLoadingFeedbacks: isLoadingFeedbacksByFeedbackForm,
    data: feedbacks,
    refetch: refetchFeedbacksByFeedbackForm,
  } = useFetchFeedbacksByFeedbackForm(form_identity);

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const itemsPerPage = 10;

  const paginateFeedbacks = (feedbacks, page, itemsPerPage) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return feedbacks.slice(startIndex, endIndex);
  };

  const paginatedFeedbacks = paginateFeedbacks(
    feedbacks || [],
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil((feedbacks?.length || 0) / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const openModal = (feedback) => setSelectedFeedback(feedback);
  const closeModal = () => setSelectedFeedback(null);

  if (isLoadingFeedbackForm || isLoadingFeedbacksByFeedbackForm) {
    return <LoadingSpinner />;
  }

  return (
    <div id="feedback-form">
      <section className="mb-3">
        <h6 className="text-sm text-gray-400 uppercase mb-2">
          {feedbackForm?.center}
        </h6>
        <h5 className="text-xl font-semibold">{feedbackForm?.title} Reviews</h5>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p>Total Reviews</p>
            <h3>{feedbackForm?.total_submissions}</h3>
          </div>
          <div>
            <p>Average Ratings</p>
            <h3>{feedbackForm?.total_submissions}</h3>
          </div>
          <div>
            <p>5</p>
            <p>4</p>
            <p>3</p>
            <p>2</p>
            <p>1</p>
          </div>
        </div>
      </section>

      <section className="mb-3">
        <div className="mb-3 p-3 rounded shadow bg-white border border-gray-300">
          <div className="mb-3 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-300 pb-3">
            <h6 className="text-xl font-semibold">Responses</h6>
            <input
              type="text"
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search"
            />
            <div className="flex gap-4">
              <div>
                <label className="mr-2 text-gray-700">Start Date:</label>
                <input
                  type="date"
                  className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mr-2 text-gray-700">End Date:</label>
                <input
                  type="date"
                  className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {feedbacks?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border rounded border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-base">
                    <th className="px-2 py-2 text-left min-w-[120px]">
                      Guest Name
                    </th>
                    <th className="px-2 py-2 text-left min-w-[80px]">Date</th>
                    <th className="px-2 py-2 text-left min-w-[120px]">
                      Responses
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedFeedbacks.map((feedback, index) => (
                    <tr
                      key={feedback.reference}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-2 py-2 border-t border-gray-300 text-base">
                        {feedback.guest_name}
                      </td>
                      <td className="px-2 py-2 border-t border-gray-300 text-base">
                        {new Date(feedback.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-2 py-2 border-t border-gray-300 text-base">
                        <button
                          onClick={() => openModal(feedback)}
                          className="text-blue-500 cursor-pointer"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-4 flex items-center gap-2 mb-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-1 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Prev
                </button>
                <span className="px-4 py-2 text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-1 cursor-pointer bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          ) : (
            <div className="p-3 w-full bg-blue-100">No responses available</div>
          )}
        </div>
      </section>

      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg w-1/2">
            <h3 className="text-lg font-semibold mb-2">
              Responses for {selectedFeedback.guest_name}
            </h3>
            <ul className="list-disc pl-5">
              {selectedFeedback.responses.map((resp) => (
                <li key={resp.reference} className="mb-1">
                  {resp.actual_question.text}:{" "}
                  {resp.rating ?? resp.text ?? resp.yes_no}
                </li>
              ))}
            </ul>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackFormDetail;
