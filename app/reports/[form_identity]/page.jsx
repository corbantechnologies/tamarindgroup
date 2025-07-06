"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import Link from "next/link";
import React, { use, useState, useMemo } from "react";
import jsPDF from "jspdf";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

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

  const generateDefaultQuestionReport = () => {
    const questionStats = {};
    feedbackForm?.questions.forEach((question) => {
      if (question.type === "RATING") {
        const ratings = filterResponses
          .filter((r) => r.question === question.identity && r.rating !== null)
          .map((r) => r.rating);
        questionStats[question.identity] = {
          type: "RATING",
          average:
            ratings.length > 0
              ? ratings.reduce((a, b) => a + b, 0) / ratings.length
              : 0,
        };
      } else if (question.type === "YES_NO") {
        const yesNo = filterResponses
          .filter((r) => r.question === question.identity && r.yes_no !== null)
          .map((r) => r.yes_no);
        const yesCount = yesNo.filter((v) => v).length;
        const noCount = yesNo.filter((v) => !v).length;
        const yesPercentage =
          yesNo.length > 0 ? (yesCount / yesNo.length) * 100 : 0;
        const noPercentage =
          yesNo.length > 0 ? (noCount / yesNo.length) * 100 : 0;
        questionStats[question.identity] = {
          type: "YES_NO",
          yesPercentage,
          noPercentage,
        };
      }
    });
    return questionStats;
  };

  const generateQuestionReport = () => {
    const question = feedbackForm?.questions.find(
      (q) => q.identity === selectedQuestion
    );
    if (!question) return null;

    const responses = filterResponses;
    if (question.type === "RATING") {
      const ratings = responses
        .filter((r) => r.question === selectedQuestion && r.rating !== null)
        .map((r) => r.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((a, b) => a + b, 0) / ratings.length
          : 0;
      return { averageRating, ratings };
    } else if (question.type === "YES_NO") {
      const yesNo = responses
        .filter((r) => r.question === selectedQuestion && r.yes_no !== null)
        .map((r) => r.yes_no);
      const yesCount = yesNo.filter((v) => v).length;
      const noCount = yesNo.filter((v) => !v).length;
      const yesPercentage =
        yesNo.length > 0 ? (yesCount / yesNo.length) * 100 : 0;
      const noPercentage =
        yesNo.length > 0 ? (noCount / yesNo.length) * 100 : 0;
      return { yesPercentage, noPercentage };
    } else if (question.type === "TEXT") {
      const texts = responses
        .filter((r) => r.question === selectedQuestion)
        .map((r) => r.text)
        .filter((t) => t);
      return { texts };
    }
    return null;
  };

  const summaryReport =
    reportType === "summary" ? generateSummaryReport() : null;
  const defaultQuestionReport =
    reportType === "question-specific" && !selectedQuestion
      ? generateDefaultQuestionReport()
      : null;
  const questionReport =
    reportType === "question-specific" && selectedQuestion
      ? generateQuestionReport()
      : null;

  const COLORS = ["#3490dc", "#e3342f"];

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 128); // Dark blue header
    doc.text(`Feedback Report: ${feedbackForm?.title}`, 105, 20, {
      align: "center",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black for body
    doc.setFillColor(245, 245, 245); // Lighter gray background
    doc.rect(10, 30, 190, 260, "F");

    let yOffset = 40;
    if (reportType === "summary" && summaryReport) {
      doc.autoTable({
        startY: yOffset,
        head: [["Metric", "Value"]],
        body: [
          ["Total Submissions", summaryReport.totalSubmissions],
          ["Average Rating", `${summaryReport.averageRating.toFixed(1)}`],
          ["Yes Percentage", `${summaryReport.yesPercentage.toFixed(1)}%`],
          ["No Percentage", `${summaryReport.noPercentage.toFixed(1)}%`],
          ["Rating Responses", summaryReport.ratingCount],
          ["Yes/No Responses", summaryReport.yesNoCount],
        ],
        theme: "grid",
        styles: { cellPadding: 2, fontSize: 10, halign: "left" },
        headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] },
      });
      yOffset = doc.lastAutoTable.finalY + 10;
    } else if (reportType === "question-specific" && questionReport) {
      const questionText = feedbackForm.questions.find(
        (q) => q.identity === selectedQuestion
      )?.text;
      doc.text(`Report for: ${questionText}`, 20, (yOffset += 10));
      let body = [];
      if (questionReport.averageRating !== undefined) {
        body.push([
          "Average Rating",
          `${questionReport.averageRating.toFixed(1)}`,
        ]);
      }
      if (questionReport.yesPercentage !== undefined) {
        body.push([
          "Yes Percentage",
          `${questionReport.yesPercentage.toFixed(1)}%`,
        ]);
        body.push([
          "No Percentage",
          `${questionReport.noPercentage.toFixed(1)}%`,
        ]);
      }
      if (questionReport.texts) {
        questionReport.texts.forEach((text, index) => {
          body.push([`Comment ${index + 1}`, text]);
        });
      }
      doc.autoTable({
        startY: yOffset,
        head: [["Metric", "Value"]],
        body: body,
        theme: "grid",
        styles: { cellPadding: 2, fontSize: 10, halign: "left" },
        headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] },
      });
      yOffset = doc.lastAutoTable.finalY + 10;
    }

    doc.save(`report_${form_identity}.pdf`);
  };

  if (isLoadingFeedbackForm) return <LoadingSpinner />;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-6 px-4 bg-gray-50">
      <div className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-lg">
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
                <option value="">All Questions</option>
                {feedbackForm?.questions.map((q) => (
                  <option key={q.identity} value={q.identity}>
                    {q.text}
                  </option>
                ))}
              </select>
            )}
            <button
              onClick={handleClearFilters}
              className="primary-button px-3 py-1 rounded text-center"
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
              <div className="mt-4 h-64">
                <h4 className="text-lg font-medium">Yes/No Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: "Yes", value: summaryReport.yesPercentage },
                        { name: "No", value: summaryReport.noPercentage },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {COLORS.map((color, index) => (
                        <Cell key={`cell-${index}`} fill={color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
          {reportType === "question-specific" && (
            <div>
              {!selectedQuestion && defaultQuestionReport && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    Overview by Question
                  </h3>
                  {Object.entries(defaultQuestionReport).map(([id, stats]) => {
                    const question = feedbackForm.questions.find(
                      (q) => q.identity === id
                    );
                    return (
                      <div key={id} className="mb-6">
                        <h4 className="text-lg font-medium">
                          {question?.text}
                        </h4>
                        {stats.type === "RATING" && (
                          <p>Average Rating: {stats.average.toFixed(1)}</p>
                        )}
                        {stats.type === "YES_NO" && (
                          <div className="mt-4 h-64">
                            <h5 className="text-md font-medium">
                              Yes/No Distribution
                            </h5>
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={[
                                    { name: "Yes", value: stats.yesPercentage },
                                    { name: "No", value: stats.noPercentage },
                                  ]}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  label
                                >
                                  {COLORS.map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                  ))}
                                </Pie>
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              {selectedQuestion && questionReport && (
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
                  <div className="mt-4">
                    {questionReport.ratings && (
                      <div>
                        <h4 className="text-lg font-medium">
                          Rating Distribution
                        </h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={Array.from({ length: 5 }, (_, i) => {
                                const rating = i + 1;
                                return {
                                  name: rating.toString(),
                                  value: questionReport.ratings.filter(
                                    (r) => Math.floor(r) === rating
                                  ).length,
                                };
                              })}
                            >
                              <Bar dataKey="value" fill="#3490dc" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                    {questionReport.yesPercentage !== undefined && (
                      <div>
                        <h4 className="text-lg font-medium">
                          Yes/No Distribution
                        </h4>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  {
                                    name: "Yes",
                                    value: questionReport.yesPercentage,
                                  },
                                  {
                                    name: "No",
                                    value: questionReport.noPercentage,
                                  },
                                ]}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                label
                              >
                                {COLORS.map((color, index) => (
                                  <Cell key={`cell-${index}`} fill={color} />
                                ))}
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <button
          className="primary-button px-4 py-2 rounded text-center leading-[1.5rem]"
          onClick={downloadPDF}
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
