"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import { createFeedback } from "@/services/feedbacks";
import React, { use, useState } from "react";
import toast from "react-hot-toast";

function Feedback({ params }) {
  const { form_identity } = use(params);

  const {
    isLoading: isLoadingFeedbackForm,
    data: feedbackForm,
    refetch: refetchFeedbackForm,
  } = useFetchFeedbackForm(form_identity);

  const [formData, setFormData] = useState({
    feedback_form: form_identity,
    guest_name: "",
    apartment_no: "",
    arrival_date: "",
    checkout_date: "",
    answers: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnswerChange = (questionId, value, subQuestionId = null) => {
    setFormData((prev) => {
      const existingAnswerIndex = prev.answers.findIndex(
        (a) => a.question === questionId
      );
      const newAnswers = [...prev.answers];

      if (subQuestionId) {
        const subResponse = { question: subQuestionId, rating: value.rating };
        if (existingAnswerIndex >= 0) {
          newAnswers[existingAnswerIndex] = {
            ...newAnswers[existingAnswerIndex],
            sub_responses: {
              ...(newAnswers[existingAnswerIndex].sub_responses || {}),
              [subQuestionId]: subResponse,
            },
          };
        } else {
          newAnswers.push({
            question: questionId,
            [questionId === "rate-the-food" ? "sub_responses" : "rating"]:
              value.rating,
            sub_responses: { [subQuestionId]: subResponse },
          });
        }
      } else {
        const answer = {
          question: questionId,
          ...(value.rating ? { rating: value.rating } : value),
        };
        if (existingAnswerIndex >= 0) {
          newAnswers[existingAnswerIndex] = answer;
        } else {
          newAnswers.push(answer);
        }
      }

      return { ...prev, answers: newAnswers };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (
      feedbackForm?.is_accomodation &&
      (!formData.apartment_no ||
        !formData.arrival_date ||
        !formData.checkout_date)
    ) {
      setError(
        "Apartment No, Arrival Date, and Checkout Date are required for accommodation forms."
      );
      setIsSubmitting(false);
      return;
    }

    try {
      await createFeedback(formData);
      toast.success("Feedback submitted successfully!");
      setFormData({
        feedback_form: form_identity,
        guest_name: "",
        apartment_no: "",
        arrival_date: "",
        checkout_date: "",
        answers: [],
      });
      refetchFeedbackForm();
    } catch (err) {
      setError(`Failed to submit feedback: ${err.message}`);
      toast.error(`Failed to submit feedback.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingFeedbackForm) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">{feedbackForm?.title}</h2>
      <p className="text-gray-600 mb-6">{feedbackForm?.description}</p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Guest Name *
          </label>
          <input
            type="text"
            name="guest_name"
            value={formData.guest_name}
            onChange={handleInputChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        {feedbackForm?.is_accomodation && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Apartment No *
              </label>
              <input
                type="text"
                name="apartment_no"
                value={formData.apartment_no}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Arrival Date *
              </label>
              <input
                type="date"
                name="arrival_date"
                value={formData.arrival_date}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Checkout Date *
              </label>
              <input
                type="date"
                name="checkout_date"
                value={formData.checkout_date}
                onChange={handleInputChange}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </>
        )}
        {feedbackForm?.questions?.map((question) => (
          <div key={question.reference} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {question.text}
            </label>
            {question.type === "RATING" && (
              <input
                type="number"
                min="1"
                max="5"
                value={
                  formData.answers.find((a) => a.question === question.identity)
                    ?.rating || ""
                }
                onChange={(e) =>
                  handleAnswerChange(question.identity, {
                    rating: parseInt(e.target.value),
                  })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                placeholder="Rate 1-5"
              />
            )}
            {question.type === "YES_NO" && (
              <select
                value={
                  formData.answers.find((a) => a.question === question.identity)
                    ?.yes_no || ""
                }
                onChange={(e) =>
                  handleAnswerChange(question.identity, {
                    yes_no: e.target.value === "true",
                  })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            )}
            {question.type === "TEXT" && (
              <textarea
                value={
                  formData.answers.find((a) => a.question === question.identity)
                    ?.text || ""
                }
                onChange={(e) =>
                  handleAnswerChange(question.identity, {
                    text: e.target.value,
                  })
                }
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                rows="3"
                placeholder="Enter your comments"
              />
            )}
            {question.sub_questions.length > 0 && (
              <div className="ml-4 mt-2 space-y-2">
                {question.sub_questions.map((subQ) => (
                  <div key={subQ.reference}>
                    <label className="block text-sm font-medium text-gray-700">
                      {subQ.text}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={
                        formData.answers.find(
                          (a) => a.question === question.identity
                        )?.sub_responses?.[subQ.identity]?.rating || ""
                      }
                      onChange={(e) =>
                        handleAnswerChange(
                          question.identity,
                          { rating: parseInt(e.target.value) },
                          subQ.identity
                        )
                      }
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Rate 1-5"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {error && <p className="text-red-600">{error}</p>}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default Feedback;
