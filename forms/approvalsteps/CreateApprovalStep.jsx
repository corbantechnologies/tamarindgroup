"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { apiActions } from "@/tools/api";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateApprovalStep({ refetch, closeModal, users, approvalRequest }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <Formik
      initialValues={{
        approval_request: approvalRequest,
        approver: "",
        step_order: "",
      }}
      onSubmit={async (values) => {
        if (!values.approval_request) {
          toast.error("Approval request is required.");
          return;
        }
        setLoading(true);
        try {
          await apiActions.post("/api/v1/approvalsteps/", values, axios);
          toast.success("Approval step created successfully!");
          closeModal();
          refetch();
        } catch (error) {
          console.error("Error creating approval step:", error);
          toast.error(
            error.response?.data?.approval_request?.[0] ||
              "Failed to create approval step."
          );
        } finally {
          setLoading(false);
        }
      }}
    >
      {({ touched }) => (
        <Form className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow">
          <h2 className="mb-6 text-2xl font-bold text-center">
            Create Approval Step
          </h2>
          <Field
            type="hidden"
            name="approval_request"
            value={approvalRequest}
          />
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Approver
            </label>
            <Field
              as="select"
              name="approver"
              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${
                touched.approver ? "border-red-500" : ""
              }`}
            >
              <option value="">Select an approver</option>
              {users?.map((user) => (
                <option key={user.email} value={user.email}>
                  {user.name}
                </option>
              ))}
            </Field>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Step Order
            </label>
            <Field
              type="number"
              name="step_order"
              className={`mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500 ${
                touched.step_order ? "border-red-500" : ""
              }`}
              placeholder="Enter step order"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default CreateApprovalStep;
