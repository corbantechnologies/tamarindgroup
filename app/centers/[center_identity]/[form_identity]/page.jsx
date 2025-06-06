"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import React, { use } from "react";

function FeedbackFormDetail({ params }) {
  const { center_identity, form_identity } = use(params);

  const {
    isLoading: isLoadingFeedbackForm,
    data: feedbackForm,
    refetch: refetchFeedbackForm,
  } = useFetchFeedbackForm(form_identity);

  console.log(feedbackForm);

  if (isLoadingFeedbackForm) {
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
      </section>
    </div>
  );
}

export default FeedbackFormDetail;
