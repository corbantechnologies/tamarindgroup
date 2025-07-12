"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateFeedbackForm from "@/forms/feedbackforms/CreateFeedbackForm";
import { useFetchCenter } from "@/hooks/centers/actions";
import Link from "next/link";
import React, { use, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";

function CenterDetail({ params }) {
  const { center_identity } = use(params);


  const {
    isLoading: isLoadingCenter,
    data: center,
    refetch: refetchCenter,
  } = useFetchCenter(center_identity);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalQuestions =
    center?.feedback_forms?.reduce(
      (sum, form) => sum + (form?.questions?.length || 0),
      0
    ) || 0;

  const totalSubmissions =
    center?.feedback_forms?.reduce(
      (sum, form) => sum + (form?.form_submissions?.length || 0),
      0
    ) || 0;

  if (isLoadingCenter) {
    return <LoadingSpinner />;
  }

  return (
    <>
      {/* Header */}
      <div className="space-y-2 mb-2">
        <h1 className="text-3xl font-bold text-foreground">{center?.name}</h1>
        <p className="text-muted-foreground">{center?.description}</p>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">📍 {center?.location}</span>
          <span className="flex items-center gap-1">📞 {center?.contact}</span>
        </div>
      </div>
      <section className="mb-3">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Forms</p>
                  <p className="text-2xl font-bold">
                    {center?.feedback_forms?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary/10 rounded-lg">
                  <Users className="h-5 w-5 text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Submissions
                  </p>
                  <p className="text-2xl font-bold">{totalSubmissions}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Settings className="h-5 w-5 text-accent-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Questions
                  </p>
                  <p className="text-2xl font-bold">{totalQuestions}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      <section id="center">
        {/* Feedback forms */}
        <div className="mb-3 px-4 py-6 rounded shadow bg-white border-gray-300">
          <div className="mb-3 flex justify-between items-center border-b border-gray-300 pb-3">
            <h6 className="text-xl font-semibold">Feedback Forms</h6>
            <button
              className="primary-button px-2 py-1 rounded text-center leading-[1.5rem]"
              onClick={() => setIsModalOpen(true)}
            >
              Create Form
            </button>
          </div>

          {center?.feedback_forms?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border rounded border-gray-300">
                <thead>
                  <tr className="bg-gray-200 text-gray-700 text-sm">
                    <th className="px-2 py-2 text-left min-w-[120px]">Title</th>
                    <th className="px-2 py-2 text-left min-w-[150px]">
                      Description
                    </th>
                    <th className="px-2 py-2 text-left min-w-[80px]">
                      Questions
                    </th>
                    <th className="px-2 py-2 text-left min-w-[80px]">
                      Submissions
                    </th>
                    <th className="px-2 py-2 text-left min-w-[100px]">
                      Accommodation
                    </th>
                    <th className="px-2 py-2 text-left min-w-[80px]">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {center?.feedback_forms?.map((feedbackForm, index) => (
                    <tr
                      key={feedbackForm?.reference}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-2 py-2 border-t text-sm">
                        {feedbackForm?.title}
                      </td>
                      <td className="px-2 py-2 border-t text-sm">
                        {feedbackForm?.description}
                      </td>
                      <td className="px-2 py-2 border-t text-sm">
                        {feedbackForm?.questions?.length}
                      </td>
                      <td className="px-2 py-2 border-t text-sm">
                        {feedbackForm?.form_submissions?.length}
                      </td>
                      <td className="px-2 py-2 border-t text-sm">
                        {feedbackForm?.is_accomodation ? "Yes" : "No"}
                      </td>
                      <td className="px-2 py-2 border-t text-sm">
                        <Link
                          href={`/centers/${center_identity}/${feedbackForm?.form_identity}`}
                          className="text-blue-600 hover:underline"
                        >
                          Manage
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-3 w-full bg-blue-100">
              No feedback forms available for this center
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setIsModalOpen(false)}
              >
                ✕
              </button>
              <CreateFeedbackForm
                refetch={refetchCenter}
                closeModal={() => setIsModalOpen(false)}
                center={center}
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}

export default CenterDetail;
