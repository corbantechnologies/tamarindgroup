"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import { createFeedback } from "@/services/feedbacks";
import Image from "next/image";
import React, { use, useState } from "react";
import RatingButtons from "@/components/general/RatingButtons"; // Use the new component
import { useRouter } from "next/navigation";

function Feedback({ params }) {
  const { form_identity } = use(params);
  const router = useRouter();

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
        const subResponse = { question: subQuestionId, rating: value };
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
            rating: value,
            sub_responses: { [subQuestionId]: subResponse },
          });
        }
      } else {
        const answer = {
          question: questionId,
          ...(typeof value === "object" && value !== null
            ? value
            : { rating: value }), // Handle text or rating
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

    const submissionData = {
      feedback_form: formData.feedback_form,
      guest_name: formData.guest_name,
      answers: formData.answers.map((answer) => {
        const mappedAnswer = { question: answer.question };
        if (answer.rating !== undefined && answer.rating !== null) {
          mappedAnswer.rating = answer.rating;
        }
        if (answer.yes_no !== undefined && answer.yes_no !== null) {
          mappedAnswer.yes_no = answer.yes_no;
        }
        if (answer.text !== undefined && answer.text !== "") {
          mappedAnswer.text = answer.text;
        }
        if (answer.sub_responses) {
          mappedAnswer.sub_responses = answer.sub_responses;
        }
        return mappedAnswer;
      }),
    };

    if (feedbackForm?.is_accomodation) {
      if (
        !formData.apartment_no ||
        !formData.arrival_date ||
        !formData.checkout_date
      ) {
        setError(
          "Apartment No, Arrival Date, and Checkout Date are required for accommodation forms."
        );
        setIsSubmitting(false);
        return;
      }
      submissionData.apartment_no = formData.apartment_no;
      submissionData.arrival_date = formData.arrival_date;
      submissionData.checkout_date = formData.checkout_date;
    }

    try {
      await createFeedback(submissionData);
      router.push("/success");
    } catch (err) {
      router.push("/error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingFeedbackForm) return <LoadingSpinner />;

  return (
    <div className="flex items-center justify-center min-h-screen py-2 px-4">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow ">
        <Image
          className="mx-auto"
          src={`${feedbackForm?.logo || "/logo.png"}`}
          alt="Tamarind Logo"
          width={100}
          height={100}
        />
        <h2 className="text-2xl font-bold mb-4 text-center">
          {feedbackForm?.title}
        </h2>
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
              className="mt-2 block w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  className="mt-2 block w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Arrival Date *
                  </label>
                  <input
                    type="date"
                    name="arrival_date"
                    value={formData.arrival_date}
                    onChange={handleInputChange}
                    className="mt-2 block w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="mt-2 block w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </>
          )}
          {feedbackForm?.questions?.map((question) => (
            <div key={question.reference} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {question.text}
              </label>
              {question.type === "RATING" && (
                <RatingButtons
                  value={
                    formData.answers.find(
                      (a) => a.question === question.identity
                    )?.rating || 0
                  }
                  onChange={(rating) =>
                    handleAnswerChange(question.identity, rating)
                  }
                />
              )}
              {question.type === "YES_NO" && (
                <div className="mt-2 flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`yesno-${question.identity}`}
                      value="true"
                      checked={
                        formData.answers.find(
                          (a) => a.question === question.identity
                        )?.yes_no === true
                      }
                      onChange={() =>
                        handleAnswerChange(question.identity, {
                          yes_no: true,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`yesno-${question.identity}`}
                      value="false"
                      checked={
                        formData.answers.find(
                          (a) => a.question === question.identity
                        )?.yes_no === false
                      }
                      onChange={() =>
                        handleAnswerChange(question.identity, {
                          yes_no: false,
                        })
                      }
                      className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              )}
              {question.type === "TEXT" && (
                <textarea
                  value={
                    formData.answers.find(
                      (a) => a.question === question.identity
                    )?.text || ""
                  }
                  onChange={(e) =>
                    handleAnswerChange(question.identity, {
                      text: e.target.value,
                    })
                  }
                  className="mt-2 block w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                      <RatingButtons
                        value={
                          formData.answers.find(
                            (a) => a.question === question.identity
                          )?.sub_responses?.[subQ.identity]?.rating || 0
                        }
                        onChange={(rating) =>
                          handleAnswerChange(
                            question.identity,
                            rating,
                            subQ.identity
                          )
                        }
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
            className={`w-full text-white secondary-button font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
              isSubmitting && "opacity-50 cursor-not-allowed"
            }`}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
