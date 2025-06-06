"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import { useFetchFeedbacksByFeedbackForm } from "@/hooks/feedbacks/actions";
import React, { use } from "react";

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

  console.log(feedbacks);

  if (isLoadingFeedbackForm || isLoadingFeedbacksByFeedbackForm) {
    return <LoadingSpinner />;
  }

  return (
    <div id="feedback-form">
      {/* TODO: add filtering functionality: filter by date range */}
      {/* TODO: add form for editing a feedback form */}
      {/* TODO: add a form for updating the questions in a feedback form */}
      <section className="mb-3">
        {/* summary */}
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
            {/* TODO: get averages from the backend then display it with stars */}
            <h3>{feedbackForm?.total_submissions}</h3>
          </div>

          <div>
            {/* TODO: create progress bars */}
            <p>5</p>
            <p>4</p>
            <p>3</p>
            <p>2</p>
            <p>1</p>
          </div>
        </div>
      </section>

      <section className="mb-3">
        {/* Display all reviews */}
        <div className="mb-3 p-3 rounded shadow bg-white border border-gray-300">
          <div className="mb-3 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-gray-300 pb-3">
            <h6 className="text-xl font-semibold">Responses</h6>

            <div>
              {/* search bar */}
              <input
                type="text"
                className="border border-gray-300"
                placeholder="Search"
              />
            </div>

            <div className="flex gap-4">
              <div>
                <label className="mr-2">Start Date:</label>
                <input type="date" className="border border-gray-300" />
              </div>

              <div>
                <label className="mr-2">End Date:</label>
                <input type="date" className="border border-gray-300" />
              </div>
            </div>
          </div>

          {feedbacks?.length > 0 ? (
            <div></div>
          ) : (
            <div className="p-3 w-full bg-blue-100">No responses available</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default FeedbackFormDetail;
