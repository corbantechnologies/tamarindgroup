"use client";

import React, { use, useState, useMemo } from "react";
import UpdateFeedbackForm from "@/forms/feedbackforms/UpdateFeedbackForm"; // Import the update form component
import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateQuestion from "@/forms/questions/CreateQuestion";
import { useFetchFeedbackForm } from "@/hooks/feedbackforms/actions";
import { useFetchFeedbacksByFeedbackForm } from "@/hooks/feedbacks/actions";
import {
  Plus,
  ExternalLink,
  FileText,
  Users,
  Star,
  BarChart3,
  Filter,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton"; // Import the update form component
import StatsCard from "@/components/private/StatsCard";

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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
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
    return allFeedbacks;
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
      {/* Header Section */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{feedbackForm?.center}</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {feedbackForm?.title} Reviews
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and analyze feedback responses
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setIsModalOpen(true)} variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Question
            </Button>

            {feedbackForm?.questions?.length > 0 && (
              <Button asChild variant="outline">
                <a
                  href={`/feedback/${feedbackForm?.form_identity}`}
                  target="_blank"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Public Link
                </a>
              </Button>
            )}

            <Button
              variant="outline"
              onClick={() => setIsUpdateModalOpen(true)}
            >
              Update
            </Button>

            <Button asChild variant="outline">
              <a
                href={`/reports/${feedbackForm?.form_identity}`}
                target="_blank"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Generate Report
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-3 mt-3">
        <StatsCard
          title="Total Reviews"
          value={feedbackForm?.total_submissions || 0}
          icon={Users}
          color="blue"
        />
        <StatsCard
          title="Average Rating"
          value={feedbackForm?.average_rating || 0}
          icon={Star}
          color="green"
        />
        <StatsCard
          title="Total Questions"
          value={feedbackForm?.questions?.length || 0}
          icon={FileText}
          color="purple"
        />
      </div>

      {/* Responses Section */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Responses
            </CardTitle>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {(specificDate || startDate || endDate) && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>

          {showFilters && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                <div className="space-y-2">
                  <Label>Specific Date</Label>
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
                  <Label>Start Date</Label>
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
                  <Label>End Date</Label>
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
              </div>
            </>
          )}
        </CardHeader>

        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="secondary">
              {filterFeedbacks.length} records found
            </Badge>
          </div>

          {filterFeedbacks?.length > 0 ? (
            <div className="space-y-4">
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Guest Name</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedFeedbacks.map((feedback, index) => {
                      const displayIndex =
                        (currentPage - 1) * itemsPerPage + index + 1;
                      const isExpanded = expandedRows.has(feedback.reference);

                      return (
                        <React.Fragment key={feedback.reference}>
                          <TableRow>
                            <TableCell className="font-medium text-center">
                              {displayIndex}
                            </TableCell>
                            <TableCell>{feedback.guest_name}</TableCell>
                            <TableCell>
                              {new Date(
                                feedback.created_at
                              ).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleRow(feedback.reference)}
                              >
                                {isExpanded ? "Hide" : "View"}
                              </Button>
                            </TableCell>
                          </TableRow>

                          {isExpanded && (
                            <TableRow>
                              <TableCell colSpan={4} className="bg-muted/50">
                                <div className="p-4 space-y-3">
                                  {feedback.responses.map((resp) => (
                                    <div
                                      key={resp.reference}
                                      className="space-y-1"
                                    >
                                      <p className="font-medium text-sm">
                                        {resp.actual_question.text}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {resp.rating !== null
                                          ? `Rating: ${resp.rating}/5`
                                          : resp.text !== null
                                          ? resp.text
                                          : resp.yes_no !== null
                                          ? resp.yes_no
                                            ? "Yes"
                                            : "No"
                                          : "N/A"}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No responses yet</h3>
              <p className="text-muted-foreground">
                Responses will appear here once people start submitting
                feedback.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

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
