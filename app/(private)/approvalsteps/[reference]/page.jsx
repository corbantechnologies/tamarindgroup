"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchApprovalStep } from "@/hooks/approvalsteps/actions";
import { updateApprovalStep } from "@/hooks/approvalsteps/actions";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { apiActions } from "@/tools/api";
import { Field, Form, Formik } from "formik";
import React, { use, useState } from "react";
import toast from "react-hot-toast";

function ApprovalStepDetail({ params }) {
  const { reference } = use(params);
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState(false);

  const {
    isLoading: isLoadingStep,
    data: step,
    refetch: refetchStep,
  } = useFetchApprovalStep(reference);

  if (isLoadingStep) {
    return <LoadingSpinner />;
  }

  if (!step) {
    return (
      <div className="container mx-auto p-4 text-red-600">
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Approval Step Details</h2>
      <div className="bg-white border border-gray-200 rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700">
              Request Title
            </h3>
            <p className="text-gray-900">{step.request_info.title}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Description</h3>
            <p className="text-gray-900">{step.request_info.description}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Status</h3>
            <span
              className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                step.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-800"
                  : step.status === "APPROVED"
                  ? "bg-green-100 text-green-800"
                  : step.status === "REJECTED"
                  ? "bg-red-100 text-red-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {step.status}
            </span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Approver</h3>
            <p className="text-gray-900">{step.approver}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Step Order</h3>
            <p className="text-gray-900">{step.step_order}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Comments</h3>
            <p className="text-gray-900">{step.comments || "None"}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Created At</h3>
            <p className="text-gray-900">{formatDate(step.created_at)}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-700">Updated At</h3>
            <p className="text-gray-900">{formatDate(step.updated_at)}</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-700 mb-2">
          Update Approval Step
        </h3>

        <Formik
          initialValues={{
            status: step.status || "",
            comments: step.comments || "",
          }}
          onSubmit={async (values) => {
            setLoading(true);
            try {
              await apiActions?.patch(
                `/api/v1/approvalsteps/${reference}/`,
                values,
                axios
              );
              toast.success("Approval step updated successfully.");
              refetchStep();
            } catch (error) {
              toast.error("Failed to update approval step.");
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
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm
                  p-2 focus:ring-blue-500 focus:border-blue-500 ${
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
                  className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm
                  p-2 focus:ring-blue-500 focus:border-blue-500 ${
                    touched.comments ? "border-red-500" : ""
                  }`}
                  rows="4"
                />
              </div>

              <button
                type="submit"
                className={`inline-flex items-center px-4 py-2 border border-transparent
                rounded-md shadow-sm text-sm font-medium text-white bg-blue-600
                hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2
                focus:ring-blue-500 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default ApprovalStepDetail;
