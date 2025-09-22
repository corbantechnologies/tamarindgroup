"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import CreateApprovalStep from "@/forms/approvalsteps/CreateApprovalStep";
import { useFetchAccount, useFetchUsers } from "@/hooks/accounts/actions";
import { useFetchApprovalStep } from "@/hooks/approvalsteps/actions";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { apiActions } from "@/tools/api";
import { Field, Form, Formik } from "formik";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

function ApprovalStepDetail({ params }) {
  const { reference } = useParams();
  const axios = useAxiosAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    isLoading: isLoadingAccount,
    data: account,
    refetch: refetchAccount,
  } = useFetchAccount();

  const {
    isLoading: isLoadingStep,
    data: step,
    refetch: refetchStep,
  } = useFetchApprovalStep(reference);

  console.log(step)

  const { isLoading: isLoadingUsers, data: users } = useFetchUsers();

  if (isLoadingStep || isLoadingUsers) {
    return <LoadingSpinner />;
  }

  if (!step) {
    return (
      <div className="container mx-auto max-w-3xl p-4 sm:p-6 text-red-600 bg-white rounded-lg shadow-sm">
        Approval step not found.
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto max-w-3xl p-4 sm:p-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-600 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500"
          >
            <svg
              className="w-5 h-5 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back
          </button>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-600">
            Approval Step Details
          </h2>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Request Title
              </h3>
              <p className="text-gray-800">{step.request_info.title}</p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Description
              </h3>
              <p className="text-gray-800">{step.request_info.description}</p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Status
              </h3>
              <span
                className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                  step.status === "Pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : step.status === "Approved"
                    ? "bg-green-100 text-green-800"
                    : step.status === "Rejected"
                    ? "bg-red-100 text-red-800"
                    : step.status === "Reviewed"
                    ? "bg-blue-100 text-blue-800"
                    : step.status === "Skipped"
                    ? "bg-gray-100 text-gray-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {step.status}
              </span>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Approver
              </h3>
              <p className="text-gray-800">{step.approver}</p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Step Order
              </h3>
              <p className="text-gray-800">{step.step_order}</p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Comments
              </h3>
              <p className="text-gray-800">{step.comments || "None"}</p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Created At
              </h3>
              <p className="text-gray-800">{formatDate(step.created_at)}</p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Updated At
              </h3>
              <p className="text-gray-800">{formatDate(step.updated_at)}</p>
            </div>
            <div className="sm:col-span-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700">
                Attachments
              </h3>
              {step.attachments && step.attachments.length > 0 ? (
                <ul className="list-disc pl-5 text-gray-800">
                  {step.attachments.map((attachment, index) => (
                    <li key={index}>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal-400 hover:text-teal-500 hover:underline"
                      >
                        {attachment.name}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-800">No attachments available.</p>
              )}
            </div>
          </div>

          {step.status === "Pending" && (
            <>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                Update Approval Step
              </h3>
              <Formik
                initialValues={{
                  status: "",
                  comments: "",
                  is_final: false,
                }}
                onSubmit={async (values) => {
                  if (!values.status) {
                    toast.error("Please select a status.");
                    return;
                  }
                  setLoading(true);
                  try {
                    await apiActions.patch(
                      `/api/v1/approvalsteps/${reference}/`,
                      values,
                      axios
                    );
                    toast.success("Approval step updated successfully.");
                    refetchStep();
                  } catch (error) {
                    toast.error(
                      `Failed to update approval step: ${
                        error.response?.data?.detail || error.message
                      }`
                    );
                    console.error("Error updating approval step:", error);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                {({ touched }) => (
                  <Form className="space-y-4">
                    <div>
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Status
                      </label>
                      <Field
                        as="select"
                        id="status"
                        name="status"
                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-400 focus:border-teal-400 sm:text-sm ${
                          touched.status ? "border-red-500" : ""
                        }`}
                        required
                      >
                        <option value="">Select Status</option>
                        <option value="Approved">Approve</option>
                        <option value="Rejected">Reject</option>
                        <option value="Reviewed">Review</option>
                        <option value="Skipped">Skip</option>
                      </Field>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <Field
                          type="checkbox"
                          name="is_final"
                          className="h-4 w-4 text-teal-400 focus:ring-teal-400 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">
                          Mark as Final Step
                        </span>
                      </label>
                    </div>
                    <div>
                      <label
                        htmlFor="comments"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Comments (Optional)
                      </label>
                      <Field
                        as="textarea"
                        id="comments"
                        name="comments"
                        className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-teal-400 focus:border-teal-400 sm:text-sm ${
                          touched.comments ? "border-red-500" : ""
                        }`}
                        rows="4"
                      />
                    </div>
                    <div>
                      <button
                        type="submit"
                        disabled={loading}
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300 ${
                          loading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {loading ? "Updating..." : "Update"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </>
          )}

          {(step.status === "Approved" || step.status === "Reviewed") &&
            !step.is_final && (
              <div className="mt-6">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-400 hover:bg-teal-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-300"
                >
                  Create Next Approval Step
                </button>
              </div>
            )}

          {isModalOpen && (
            <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
              <div className="relative bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-lg max-h-[90vh] overflow-y-auto">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl font-semibold"
                >
                  ✕
                </button>
                <CreateApprovalStep
                  refetch={refetchStep}
                  closeModal={() => setIsModalOpen(false)}
                  users={users}
                  approvalRequest={step?.approval_request}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ApprovalStepDetail;
