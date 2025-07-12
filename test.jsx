"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateQuestion from "@/forms/questions/CreateQuestion";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import { useFetchFeedbacksByFeedbackForm } from "@/hooks/feedbacks/actions";
import Link from "next/link";
import React, { use, useState, useMemo } from "react";
import StarRating from "@/components/general/StarRating";
import UpdateFeedbackForm from "@/forms/feedbackforms/UpdateFeedbackForm"; // Import the update form component

function FeedbackFormDetail({ params }) {
  const { form_identity } = use(params);

  const {
    isLoading: isLoadingFeedbackForm,
    data: feedbackForm,
    refetch: refetchFeedbackForm,
  } = useFetchFeedbackForm(form_identity);

  const {
    isLoading: isLoadingFeedbacks,
    data: allFeedbacks,
    refetch: refetchFeedbacks,
  } = useFetchFeedbacksByFeedbackForm(form_identity);

  const [specificDate, setSpecificDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // New state for update modal
  const itemsPerPage = 10;


  const filterFeedbacks = useMemo(() => {
    if (!allFeedbacks) return [];
    const createdAtDate = (feedback) =>
      new Date(feedback.created_at).toISOString().split("T")[0];
    if (specificDate) {
      return allFeedbacks.filter(
        (feedback) => createdAtDate(feedback) === specificDate
      );
    } else if (startDate && endDate) {
      return allFeedbacks.filter((feedback) => {
        const date = createdAtDate(feedback);
        return date >= startDate && date <= endDate;
      });
    }
    return allFeedbacks; // Default to all feedbacks if no filter
  }, [allFeedbacks, specificDate, startDate, endDate]);

  const paginateFeedbacks = (feedbacks, page, itemsPerPage) => {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return feedbacks.slice(startIndex, endIndex);
  };

  const paginatedFeedbacks = paginateFeedbacks(
    filterFeedbacks,
    currentPage,
    itemsPerPage
  );
  const totalPages = Math.ceil((filterFeedbacks?.length || 0) / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const toggleRow = (reference) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(reference)) {
      newExpandedRows.delete(reference);
    } else {
      newExpandedRows.add(reference);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleClearFilters = () => {
    setSpecificDate("");
    setStartDate("");
    setEndDate("");
  };

  if (isLoadingFeedbackForm || isLoadingFeedbacks) {
    return <LoadingSpinner />;
  }

  return (
    <div id="feedback-form">
      {/* top section */}
      <h6 className="text-sm text-gray-400 uppercase mb-2">
        {feedbackForm?.center}
      </h6>
      <section className="mb-3 mt-3">
        <div className="mb-3 flex md:flex-row flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold">
              {feedbackForm?.title} Reviews
            </h2>
          </div>
          {/* buttons */}
          <div className="flex gap-2">
            <button
              className="secondary-button px-3 py-1 rounded text-center leading-[1.5rem]"
              onClick={() => setIsModalOpen(true)}
            >
              Add question
            </button>
            {feedbackForm?.questions?.length > 0 && (
              <Link
                href={`/feedback/${feedbackForm?.form_identity}`}
                target="_blank"
                className="primary-button px-3 py-1 rounded text-center leading-[1.5rem]"
              >
                Public Link
              </Link>
            )}
            <button
              className="secondary-button px-3 py-1 rounded text-center leading-[1.5rem]"
              onClick={() => setIsUpdateModalOpen(true)} // Trigger update modal
            >
              Update
            </button>
            <Link
              href={`/reports/${feedbackForm?.form_identity}`}
              target="_blank"
              className="primary-button px-3 py-1 rounded text-center leading-[1.5rem]"
            >
              Generate Report
            </Link>
          </div>
          {/* end of buttons */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 py-2">
          <div className="md:border-r border-gray-300">
            <p className="font-semibold">Total Reviews</p>
            <h3 className="text-2xl font-bold">
              {feedbackForm?.total_submissions}
            </h3>
          </div>
          <div className="md:border-r border-gray-300">
            <p className="font-semibold">Average Rating</p>
            <h3 className="text-2xl font-bold">
              <StarRating rating={feedbackForm?.average_rating || 0} />
            </h3>
          </div>
          <div>
            <p className="font-semibold">Total Questions</p>
            <h3 className="text-2xl font-bold">
              {feedbackForm?.questions?.length}
            </h3>
          </div>
        </div>
      </section>
      {/* end of top section */}

      {/* lower section */}
      <section className="mb-3 mt-3 py-3">
        <div className="mb-3 p-3 rounded shadow bg-white border border-gray-300">
          <div className="mb-3 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-300 pb-3">
            <h6 className="text-xl font-semibold">Responses</h6>
            <div className="flex md:flex-row flex-col gap-4">
              <div>
                <label className="mr-2 text-gray-700">Specific Date:</label>
                <input
                  type="date"
                  value={specificDate}
                  onChange={(e) => {
                    setSpecificDate(e.target.value);
                    setStartDate("");
                    setEndDate("");
                  }}
                  className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={startDate || endDate}
                />
              </div>
              <div>
                <label className="mr-2 text-gray-700">Start Date:</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setSpecificDate("");
                  }}
                  className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={specificDate}
                />
              </div>
              <div>
                <label className="mr-2 text-gray-700">End Date:</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setSpecificDate("");
                  }}
                  className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={specificDate}
                />
              </div>
              <button
                onClick={handleClearFilters}
                className="primary-button px-3 py-1 rounded text-center leading-[1.5rem]"
              >
                Clear
              </button>
            </div>
          </div>
          <div className="mb-4 text-sm text-gray-600">
            {filterFeedbacks.length} records found
          </div>
          {filterFeedbacks?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border rounded border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-base">
                    <th className="px-2 py-2 text-left min-w-[2px]">#</th>
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
                  {paginatedFeedbacks.map((feedback, index) => {
                    const displayIndex =
                      (currentPage - 1) * itemsPerPage + index + 1;
                    return (
                      <React.Fragment key={feedback.reference}>
                        <tr
                          className={
                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-2 py-2 border-t border-gray-300 text-base text-center">
                            {displayIndex}
                          </td>
                          <td className="px-2 py-2 border-t border-gray-300 text-base">
                            {feedback.guest_name}
                          </td>
                          <td className="px-2 py-2 border-t border-gray-300 text-base">
                            {new Date(feedback.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-2 py-2 border-t border-gray-300 text-base">
                            <button
                              onClick={() => toggleRow(feedback.reference)}
                              className="text-blue-500 cursor-pointer"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                        {expandedRows.has(feedback.reference) && (
                          <tr
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td
                              colSpan="4"
                              className="px-2 py-2 border-t border-gray-300"
                            >
                              <ul>
                                {feedback.responses.map((resp) => (
                                  <li key={resp.reference} className="mb-2">
                                    <div className="font-semibold italic">
                                      {resp.actual_question.text}:
                                    </div>
                                    <div>
                                      {resp.rating !== null
                                        ? resp.rating
                                        : resp.text !== null
                                        ? resp.text
                                        : resp.yes_no !== null
                                        ? resp.yes_no
                                          ? "Yes"
                                          : "No"
                                        : "N/A"}
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsModalOpen(false)}
            >
              ✕
            </button>
            <CreateQuestion
              feedbackForm={feedbackForm}
              refetch={refetchFeedbackForm}
              closeModal={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}

      {isUpdateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setIsUpdateModalOpen(false)}
            >
              ✕
            </button>
            <UpdateFeedbackForm
              refetch={refetchFeedbackForm}
              closeModal={() => setIsUpdateModalOpen(false)}
              center={feedbackForm?.center} // Pass the center data
              feedbackForm={feedbackForm} // Pass the current feedback form data
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackFormDetail;
