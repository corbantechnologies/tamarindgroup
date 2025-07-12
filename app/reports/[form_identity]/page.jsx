"use client";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import Link from "next/link";
import React, { use, useState, useMemo, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  Star,
  ThumbsUp,
  MessageSquare,
  Calendar,
  Filter,
  BarChart3,
  PieChart as PieChartIcon,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

function ReportGenerator({ params }) {
  const { form_identity } = use(params);

  const {
    isLoading: isLoadingFeedbackForm,
    data: feedbackForm,
    refetch: refetchFeedbackForm,
  } = useFetchFeedbackForm(form_identity);

  const [reportType, setReportType] = useState("summary");
  const [selectedQuestion, setSelectedQuestion] = useState("all"); // Changed default to "all" instead of ""
  const [specificDate, setSpecificDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [allQuestionsPage, setAllQuestionsPage] = useState(1);
  const [specificTextPage, setSpecificTextPage] = useState(1);
  const [summaryTextPage, setSummaryTextPage] = useState(1);

  const handleClearFilters = () => {
    setSpecificDate("");
    setStartDate("");
    setEndDate("");
    setSelectedQuestion("all"); // Use "all" instead of ""
    setAllQuestionsPage(1);
    setSpecificTextPage(1);
    setSummaryTextPage(1);
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
    if (reportType === "question-specific" && selectedQuestion !== "all") {
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
    const texts = filterResponses
      .filter((r) => r.text)
      .map((r) => r.text)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
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
      texts,
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
          ratings: ratings,
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
      } else if (question.type === "TEXT") {
        const texts = filterResponses
          .filter((r) => r.question === question.identity && r.text)
          .map((r) => r.text)
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        questionStats[question.identity] = {
          type: "TEXT",
          texts,
        };
      }
    });
    return questionStats;
  };

  const generateQuestionReport = () => {
    const question = feedbackForm?.questions.find(
      (q) => q.identity === selectedQuestion
    );
    if (!question || selectedQuestion === "all") return null;

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
        .filter((t) => t)
        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      return { texts };
    }
    return null;
  };

  const summaryReport =
    reportType === "summary" ? generateSummaryReport() : null;
  const defaultQuestionReport =
    reportType === "question-specific" && selectedQuestion === "all"
      ? generateDefaultQuestionReport()
      : null;
  const questionReport =
    reportType === "question-specific" && selectedQuestion !== "all"
      ? generateQuestionReport()
      : null;

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6"];
  const pieChartRef = useRef(null);
  const barChartRef = useRef(null);

  const downloadPDF = async () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 128);
    doc.text(`Feedback Report: ${feedbackForm?.title}`, 105, 20, {
      align: "center",
    });
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.setFillColor(245, 245, 245);
    doc.rect(10, 30, 190, 260, "F");

    let yOffset = 40;
    if (reportType === "summary" && summaryReport) {
      autoTable(doc, {
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
      if (summaryReport.texts && summaryReport.texts.length > 0) {
        autoTable(doc, {
          startY: yOffset,
          head: [["Comments"]],
          body: summaryReport.texts.map((text) => [text]),
          theme: "grid",
          styles: { cellPadding: 2, fontSize: 10, halign: "left" },
          headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] },
        });
        yOffset = doc.lastAutoTable.finalY + 10;
      }
    } else if (reportType === "question-specific") {
      if (selectedQuestion === "all" && defaultQuestionReport) {
        doc.text("Ratings for All Questions", 20, (yOffset += 10));
        const body = feedbackForm.questions
          .filter((q) => defaultQuestionReport[q.identity]?.type === "RATING")
          .map((q) => [
            q.text,
            defaultQuestionReport[q.identity]?.average?.toFixed(1) || "N/A",
          ]);
        autoTable(doc, {
          startY: yOffset,
          head: [["Question", "Average Rating"]],
          body: body,
          theme: "grid",
          styles: { cellPadding: 2, fontSize: 10, halign: "left" },
          headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] },
        });
        yOffset = doc.lastAutoTable.finalY + 10;
      } else if (questionReport) {
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
        }
        if (questionReport.texts && questionReport.texts.length > 0) {
          body.push(["Comments", ""]);
          questionReport.texts.forEach((text, index) => {
            body.push([`Comment ${index + 1}`, text]);
          });
        } else {
          body.push(["No Data", ""]);
        }
        autoTable(doc, {
          startY: yOffset,
          head: [["Metric", "Value"]],
          body: body,
          theme: "grid",
          styles: { cellPadding: 2, fontSize: 10, halign: "left" },
          headStyles: { fillColor: [0, 0, 128], textColor: [255, 255, 255] },
        });
        yOffset = doc.lastAutoTable.finalY + 10;

        if (questionReport.yesPercentage !== undefined && pieChartRef.current) {
          const pieCanvas = await html2canvas(pieChartRef.current, {
            useCORS: true,
            scale: 2,
          });
          const imgData = pieCanvas.toDataURL("image/png");
          const imgWidth = 190;
          const imgHeight = (pieCanvas.height * imgWidth) / pieCanvas.width;
          if (imgData.length > 100) {
            doc.addPage();
            doc.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
            yOffset = imgHeight + 30;
          }
        }
        if (questionReport.ratings && barChartRef.current) {
          const barCanvas = await html2canvas(barChartRef.current, {
            useCORS: true,
            scale: 2,
          });
          const imgData = barCanvas.toDataURL("image/png");
          const imgWidth = 190;
          const imgHeight = (barCanvas.height * imgWidth) / barCanvas.width;
          if (imgData.length > 100) {
            doc.addPage();
            doc.addImage(imgData, "PNG", 10, 20, imgWidth, imgHeight);
            yOffset = imgHeight + 30;
          }
        }
      }
    }

    doc.save(`report_${form_identity}.pdf`);
  };

  if (isLoadingFeedbackForm) return <LoadingSpinner />;

  const StatCard = ({ title, value, icon: Icon, description, trend }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div className="flex items-center space-x-2">
              <p className="text-3xl font-bold">{value}</p>
              {trend && (
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {trend}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
          </div>
          <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Icon className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ChartCard = ({ title, children, className = "" }) => (
    <Card
      className={`hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <div className="container mx-auto p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              {feedbackForm?.title || "Feedback Report"}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              className="flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>Reset Filters</span>
            </Button>
            <Button
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              onClick={downloadPDF}
            >
              <Download className="h-4 w-4" />
              <span>Export PDF</span>
            </Button>
            <Link
              href={`/feedback/${form_identity}`}
              className="flex items-center space-x-2 bg-gradient-to-r from-gray-600 to-gray-800 hover:from-gray-700 hover:to-gray-900 text-white px-4 py-2 rounded"
            >
              <FileText className="h-4 w-4" />
              <span>Back to Form</span>
            </Link>
          </div>
        </div>

        <Card className="border-2 border-dashed border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border border-gray-200">
                    <SelectItem value="summary">Summary Report</SelectItem>
                    <SelectItem value="question-specific">
                      Question Analysis
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specificDate">Specific Date</Label>
                <Input
                  type="date"
                  value={specificDate}
                  onChange={(e) => {
                    setSpecificDate(e.target.value);
                    setStartDate("");
                    setEndDate("");
                  }}
                  disabled={startDate || endDate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setSpecificDate("");
                  }}
                  disabled={specificDate}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setSpecificDate("");
                  }}
                  disabled={specificDate}
                />
              </div>

              {reportType === "question-specific" && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="question">Select Question</Label>
                  <Select
                    value={selectedQuestion}
                    onValueChange={setSelectedQuestion}
                  >
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="All Questions" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border border-gray-200">
                      <SelectItem value="all">All Questions</SelectItem>
                      {feedbackForm?.questions.map((q) => (
                        <SelectItem key={q.identity} value={q.identity}>
                          {q.text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center justify-between">
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>{filterResponses.length} responses found</span>
              </Badge>
            </div>
          </CardContent>
        </Card>

        {reportType === "summary" && summaryReport && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total Submissions"
                value={summaryReport.totalSubmissions.toLocaleString()}
                icon={Users}
                description="Overall response count"
                trend="+12%"
              />
              <StatCard
                title="Average Rating"
                value={summaryReport.averageRating.toFixed(1)}
                icon={Star}
                description="Out of 5 stars"
                trend="+0.3"
              />
              <StatCard
                title="Positive Responses"
                value={`${summaryReport.yesPercentage.toFixed(0)}%`}
                icon={ThumbsUp}
                description="Yes/No questions"
                trend="+5%"
              />
              <StatCard
                title="Text Responses"
                value={summaryReport.texts.length}
                icon={MessageSquare}
                description="Written feedback"
                trend="+18"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="Response Distribution">
                <div className="h-80" ref={pieChartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          {
                            name: "Positive",
                            value: summaryReport.yesPercentage,
                          },
                          {
                            name: "Negative",
                            value: summaryReport.noPercentage,
                          },
                        ]}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ percent }) =>
                          `${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {COLORS.slice(0, 2).map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>

              <ChartCard title="Rating Trends">
                <div className="h-80" ref={barChartRef}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { name: "Ratings", count: summaryReport.ratingCount },
                        { name: "Yes/No", count: summaryReport.yesNoCount },
                        { name: "Comments", count: summaryReport.texts.length },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill={COLORS[0]}
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </ChartCard>
            </div>

            {summaryReport.texts && summaryReport.texts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MessageSquare className="h-5 w-5" />
                    <span>Recent Comments</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {summaryReport.texts
                      .slice((summaryTextPage - 1) * 5, summaryTextPage * 5)
                      .map((text, index) => (
                        <div
                          key={index}
                          className="p-4 bg-slate-50 rounded-lg border-l-4 border-l-blue-400"
                        >
                          <p className="text-sm text-gray-700">{text}</p>
                        </div>
                      ))}
                  </div>
                  {summaryReport.texts.length > 5 && (
                    <div className="mt-4 flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        onClick={() => setSummaryTextPage(summaryTextPage - 1)}
                        disabled={summaryTextPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSummaryTextPage(summaryTextPage + 1)}
                        disabled={
                          summaryTextPage * 5 >= summaryReport.texts.length
                        }
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                      <span className="text-sm text-muted-foreground mt-2">
                        Page {summaryTextPage}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {reportType === "question-specific" && (
          <div className="space-y-6">
            {selectedQuestion === "all" && defaultQuestionReport && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Overview by Question</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {Object.entries(defaultQuestionReport).map(
                      ([id, stats]) => {
                        const question = feedbackForm.questions.find(
                          (q) => q.identity === id
                        );
                        const ratingData = Array.from(
                          { length: 5 },
                          (_, i) => ({
                            rating: (i + 1).toString(),
                            count:
                              stats.ratings?.filter(
                                (r) => Math.floor(r) === i + 1
                              ).length || 0,
                          })
                        );
                        const textResponses =
                          stats.type === "TEXT"
                            ? stats.texts.slice(
                                (allQuestionsPage - 1) * 5,
                                allQuestionsPage * 5
                              )
                            : [];
                        return (
                          <Card
                            key={id}
                            className="hover:shadow-lg transition-all duration-300"
                          >
                            <CardHeader>
                              <CardTitle>{question?.text}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {stats.type === "RATING" && (
                                <StatCard
                                  title="Average Rating"
                                  value={stats.average.toFixed(1)}
                                  icon={Star}
                                />
                              )}
                              {stats.type === "YES_NO" && (
                                <div className="space-y-4">
                                  <StatCard
                                    title="Yes Percentage"
                                    value={`${stats.yesPercentage.toFixed(0)}%`}
                                    icon={ThumbsUp}
                                  />
                                  <ChartCard title="Yes/No Distribution">
                                    <div className="h-64">
                                      <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                      >
                                        <BarChart
                                          data={[
                                            {
                                              name: "Yes",
                                              value: stats.yesPercentage,
                                            },
                                            {
                                              name: "No",
                                              value: stats.noPercentage,
                                            },
                                          ]}
                                        >
                                          <CartesianGrid strokeDasharray="3 3" />
                                          <XAxis dataKey="name" />
                                          <YAxis />
                                          <Tooltip />
                                          <Bar
                                            dataKey="value"
                                            fill={COLORS[0]}
                                          />
                                        </BarChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </ChartCard>
                                </div>
                              )}
                              {stats.type === "TEXT" &&
                                textResponses.length > 0 && (
                                  <div className="space-y-4">
                                    <CardTitle>Comments</CardTitle>
                                    {textResponses.map((text, index) => (
                                      <div
                                        key={index}
                                        className="p-2 bg-slate-50 rounded"
                                      >
                                        <p className="text-sm text-gray-700">
                                          {text}
                                        </p>
                                      </div>
                                    ))}
                                    {stats.texts.length > 5 && (
                                      <div className="mt-2 flex justify-center space-x-2">
                                        <Button
                                          variant="outline"
                                          onClick={() =>
                                            setAllQuestionsPage(
                                              allQuestionsPage - 1
                                            )
                                          }
                                          disabled={allQuestionsPage === 1}
                                        >
                                          <ChevronLeft className="h-4 w-4 mr-2" />
                                          Previous
                                        </Button>
                                        <Button
                                          variant="outline"
                                          onClick={() =>
                                            setAllQuestionsPage(
                                              allQuestionsPage + 1
                                            )
                                          }
                                          disabled={
                                            allQuestionsPage * 5 >=
                                            stats.texts.length
                                          }
                                        >
                                          Next
                                          <ChevronRight className="h-4 w-4 ml-2" />
                                        </Button>
                                        <span className="text-sm text-muted-foreground mt-2">
                                          Page {allQuestionsPage}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                )}
                              {stats.type === "RATING" && (
                                <ChartCard title="Rating Trend">
                                  <div className="h-64">
                                    <ResponsiveContainer
                                      width="100%"
                                      height="100%"
                                    >
                                      <LineChart data={ratingData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="rating" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line
                                          type="monotone"
                                          dataKey="count"
                                          stroke={COLORS[0]}
                                        />
                                      </LineChart>
                                    </ResponsiveContainer>
                                  </div>
                                </ChartCard>
                              )}
                            </CardContent>
                          </Card>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
            {selectedQuestion !== "all" && questionReport && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>
                      Report for{" "}
                      {
                        feedbackForm.questions.find(
                          (q) => q.identity === selectedQuestion
                        )?.text
                      }
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {questionReport.averageRating !== undefined && (
                      <StatCard
                        title="Average Rating"
                        value={questionReport.averageRating.toFixed(1)}
                        icon={Star}
                      />
                    )}
                    {questionReport.yesPercentage !== undefined && (
                      <div>
                        <StatCard
                          title="Yes Percentage"
                          value={`${questionReport.yesPercentage.toFixed(0)}%`}
                          icon={ThumbsUp}
                        />
                        <ChartCard title="Yes/No Distribution">
                          <div className="h-64" ref={pieChartRef}>
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
                                      value: 100 - questionReport.yesPercentage,
                                    },
                                  ]}
                                  dataKey="value"
                                  nameKey="name"
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  label
                                >
                                  {COLORS.slice(0, 2).map((color, index) => (
                                    <Cell key={`cell-${index}`} fill={color} />
                                  ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </ChartCard>
                      </div>
                    )}
                    {questionReport.texts &&
                      questionReport.texts.length > 0 && (
                        <div>
                          <CardTitle>Comments</CardTitle>
                          <div className="space-y-4">
                            {questionReport.texts
                              .slice(
                                (specificTextPage - 1) * 5,
                                specificTextPage * 5
                              )
                              .map((text, index) => (
                                <div
                                  key={index}
                                  className="p-4 bg-slate-50 rounded-lg border-l-4 border-l-blue-400"
                                >
                                  <p className="text-sm text-gray-700">
                                    {text}
                                  </p>
                                </div>
                              ))}
                          </div>
                          {questionReport.texts.length > 5 && (
                            <div className="mt-4 flex justify-center space-x-2">
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setSpecificTextPage(specificTextPage - 1)
                                }
                                disabled={specificTextPage === 1}
                              >
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() =>
                                  setSpecificTextPage(specificTextPage + 1)
                                }
                                disabled={
                                  specificTextPage * 5 >=
                                  questionReport.texts.length
                                }
                              >
                                Next
                                <ChevronRight className="h-4 w-4 ml-2" />
                              </Button>
                              <span className="text-sm text-muted-foreground mt-2">
                                Page {specificTextPage}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    {questionReport.ratings && (
                      <ChartCard title="Rating Distribution">
                        <div className="h-64" ref={barChartRef}>
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={Array.from({ length: 5 }, (_, i) => ({
                                name: (i + 1).toString(),
                                value: questionReport.ratings.filter(
                                  (r) => Math.floor(r) === i + 1
                                ).length,
                              }))}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="name" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="value" fill={COLORS[0]} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </ChartCard>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ReportGenerator;
