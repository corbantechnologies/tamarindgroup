"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import Link from "next/link";
import React, { use, useState, useMemo } from "react";

function ReportGenerator({ params }) {
  const { form_identity } = use(params);

  const {
    isLoading: isLoadingFeedbackForm,
    data: feedbackForm,
    refetch: refetchFeedbackForm,
  } = useFetchFeedbackForm(form_identity);

  const [reportType, setReportType] = useState("summary");
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const [specificDate, setSpecificDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleClearFilters = () => {
    setSpecificDate("");
    setStartDate("");
    setEndDate("");
    setSelectedQuestion("");
  };

  const createdAtDate = (response) =>
    new Date(response.created_at).toISOString().split("T")[0];

  const filterResponses = useMemo(() => {
    if (!feedbackForm?.form_submissions) return [];
    let filtered = feedbackForm.form_submissions.flatMap(
      (submission) => submission.responses
    );
    if (specificDate) {
      filtered = filtered.filter(
        (response) => createdAtDate(response) === specificDate
      );
    } else if (startDate && endDate) {
      filtered = filtered.filter((response) => {
        const date = createdAtDate(response);
        return date >= startDate && date <= endDate;
      });
    }
    if (reportType === "question-specific" && selectedQuestion) {
      filtered = filtered.filter(
        (response) => response.question === selectedQuestion
      );
    }
    return filtered;
  }, [
    feedbackForm,
    specificDate,
    startDate,
    endDate,
    reportType,
    selectedQuestion,
  ]);

  const generateSummaryReport = () => {
    const totalSubmissions = feedbackForm?.total_submissions || 0;
    const ratings = filterResponses
      .filter((r) => r.rating !== null)
      .map((r) => r.rating);
    const yesNo = filterResponses
      .filter((r) => r.yes_no !== null)
      .map((r) => r.yes_no);
    const averageRating =
      ratings.length > 0
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : 0;
    const yesCount = yesNo.filter((v) => v).length;
    const noCount = yesNo.filter((v) => !v).length;
    const yesPercentage =
      yesNo.length > 0 ? (yesCount / yesNo.length) * 100 : 0;
    const noPercentage = yesNo.length > 0 ? (noCount / yesNo.length) * 100 : 0;

    return {
      totalSubmissions,
      averageRating,
      yesPercentage,
      noPercentage,
      ratingCount: ratings.length,
      yesNoCount: yesNo.length,
    };
  };

  const generateQuestionReport = () => {
    const question = feedbackForm?.questions.find(
      (q) => q.identity === selectedQuestion
    );
    if (!question) return null;

    const responses = filterResponses;
    if (question.type === "RATING") {
      const ratings = responses.map((r) => r.rating).filter((r) => r !== null);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
      return { averageRating, ratings };
    } else if (question.type === "YES_NO") {
      const yesNo = responses.map((r) => r.yes_no).filter((r) => r !== null);
      const yesCount = yesNo.filter((v) => v).length;
      const noCount = yesNo.filter((v) => !v).length;
      const yesPercentage =
        yesNo.length > 0 ? (yesCount / yesNo.length) * 100 : 0;
      const noPercentage =
        yesNo.length > 0 ? (noCount / yesNo.length) * 100 : 0;
      return { yesPercentage, noPercentage };
    } else if (question.type === "TEXT") {
      const texts = responses.map((r) => r.text).filter((t) => t);
      return { texts };
    }
    return null;
  };

  const summaryReport =
    reportType === "summary" ? generateSummaryReport() : null;
  const questionReport =
    reportType === "question-specific" ? generateQuestionReport() : null;

  if (isLoadingFeedbackForm) return <LoadingSpinner />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 px-4 bg-gray-50">
      <div className="w-full max-w-4xl p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Report for {feedbackForm?.title}
        </h2>
        <div className="mb-6 p-4 border border-gray-300 rounded bg-gray-50">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="summary">Summary Report</option>
              <option value="question-specific">
                Question-Specific Report
              </option>
            </select>
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
            {reportType === "question-specific" && (
              <select
                value={selectedQuestion}
                onChange={(e) => setSelectedQuestion(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a Question</option>
                {feedbackForm?.questions.map((q) => (
                  <option key={q.identity} value={q.identity}>
                    {q.text}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={handleClearFilters}
              className="primary-button px-3 py-1 rounded text-center leading-[1.5rem]"
            >
              Clear
            </button>
          </div>
          <p className="text-sm text-gray-600">
            {filterResponses.length} responses found
          </p>
        </div>
        <div className="mb-6">
          {reportType === "summary" && summaryReport && (
            <div>
              <h3 className="text-xl font-semibold mb-2">Summary Report</h3>
              <p>Total Submissions: {summaryReport.totalSubmissions}</p>
              <p>Average Rating: {summaryReport.averageRating.toFixed(1)}</p>
              <p>Yes Percentage: {summaryReport.yesPercentage.toFixed(1)}%</p>
              <p>No Percentage: {summaryReport.noPercentage.toFixed(1)}%</p>
              <p>Rating Responses: {summaryReport.ratingCount}</p>
              <p>Yes/No Responses: {summaryReport.yesNoCount}</p>
            </div>
          )}
          {reportType === "question-specific" &&
            questionReport &&
            selectedQuestion && (
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Report for{" "}
                  {
                    feedbackForm.questions.find(
                      (q) => q.identity === selectedQuestion
                    )?.text
                  }
                </h3>
                {questionReport.averageRating !== undefined && (
                  <p>
                    Average Rating: {questionReport.averageRating.toFixed(1)}
                  </p>
                )}
                {questionReport.yesPercentage !== undefined && (
                  <p>
                    Yes Percentage: {questionReport.yesPercentage.toFixed(1)}%
                  </p>
                )}
                {questionReport.noPercentage !== undefined && (
                  <p>
                    No Percentage: {questionReport.noPercentage.toFixed(1)}%
                  </p>
                )}
                {questionReport.texts && questionReport.texts.length > 0 && (
                  <div>
                    <p>Sample Comments:</p>
                    <ul>
                      {questionReport.texts.map((text, index) => (
                        <li key={index} className="ml-4">
                          {text}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          {/* Placeholder for charts - to be implemented */}
          <div className="mt-4">
            {reportType === "summary" && (
              <div>
                <h4 className="text-lg font-medium">Yes/No Distribution</h4>
                {/* Pie chart placeholder */}
                <div>Chart will appear here</div>
              </div>
            )}
            {reportType === "question-specific" && questionReport && (
              <div>
                {questionReport.ratings && (
                  <div>
                    <h4 className="text-lg font-medium">Rating Distribution</h4>
                    {/* Bar chart placeholder */}
                    <div>Chart will appear here</div>
                  </div>
                )}
                {questionReport.yesPercentage !== undefined && (
                  <div>
                    <h4 className="text-lg font-medium">Yes/No Distribution</h4>
                    {/* Pie chart placeholder */}
                    <div>Chart will appear here</div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <button
          className="primary-button px-4 py-2 rounded text-center leading-[1.5rem]"
          onClick={() => alert("PDF download to be implemented")}
        >
          Download PDF
        </button>
        <Link
          href={`/feedback/${form_identity}`}
          className="secondary-button px-4 py-2 rounded text-center leading-[1.5rem] ml-2"
        >
          Back to Form
        </Link>
      </div>
    </div>
  );
}

export default ReportGenerator;
