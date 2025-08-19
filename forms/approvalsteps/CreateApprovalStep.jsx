import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createApprovalRequest } from "@/services/approvalrequests";
import { apiActions } from "@/tools/api";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateApprovalStep({ refetch, closeModal, users, approvalRequest }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <>
      <Formik
        initialValues={{
          approval_reqest: approvalRequest,
          approver: "",
          step_order: "",
        }}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            await apiActions?.post(`/api/v1/approvalsteps/`, values, axios);
            toast.success("Approval step created successfully!");
            closeModal();
            refetch();
          } catch (error) {
            console.error("Error creating approval step:", error);
            toast.error("Failed to create approval step. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ touched, values }) => (
          <Form className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h2 className="mb-6 text-2xl font-bold text-center">
              Create Approval Step
            </h2>
            <Field
              type="hidden"
              name="approval_reqest"
              value={approvalRequest}
            />
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Approver
              </label>
              <Field
                as="select"
                name="approver"
                className={`mt-1 block w-full border-gray-600 border rounded-md shadow-sm
                    focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 ${
                      touched.approver ? "border-red-500" : ""
                    }`}
              >
                <option value="">Select an approver</option>
                {users?.map((user) => (
                  <option key={user?.email} value={user?.email}>
                    {user?.name}
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
                className={`mt-1 block w-full border-gray-600 border rounded-md shadow-sm
                        focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 ${
                          touched.step_order ? "border-red-500" : ""
                        }`}
                placeholder="Enter step order"
                required
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CreateApprovalStep;
