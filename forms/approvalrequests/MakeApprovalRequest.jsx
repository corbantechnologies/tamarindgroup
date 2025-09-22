"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createApprovalRequest } from "@/services/approvalrequests";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

function MakeApprovalRequest({ refetch, closeModal, users }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <>
      <Formik
        initialValues={{
          request_type: "",
          title: "",
          description: "",
          attachment: null,
          first_approver: "",
        }}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const formData = new FormData();
            formData.append("request_type", values.request_type);
            formData.append("title", values.title);
            formData.append("description", values.description);
            if (values.attachment) {
              formData.append("attachment", values.attachment);
            }
            formData.append("first_approver", values.first_approver);

            await createApprovalRequest(formData, axios);
            toast.success("Approval request created successfully!");
            closeModal();
            refetch();
          } catch (error) {
            console.error("Error creating approval request:", error);
            toast.error("Failed to create approval request. Please try again.");
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow">
            <Image
              className="mx-auto"
              src="/logo.png"
              alt="Tamarind Logo"
              width={100}
              height={100}
            />

            <h2 className="mb-6 text-2xl font-bold text-center">
              Create Approval Request
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Request Type
              </label>
              <Field
                as="select"
                name="request_type"
                className="mt-1 block w-full border-gray-600 border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
              >
                <option value="">Select Request Type</option>
                <option value="LPO">Local Purchase Order (LPO)</option>
                <option value="Credit Note">Credit Note</option>
                <option value="Debit Note">Debit Note</option>
                <option value="Invoice">Invoice</option>
                <option value="Quotation">Quotation</option>
                <option value="Payment">Payment</option>
                <option value="Expense">Expense</option>
                <option value="Leave">Leave</option>
                <option value="Role">Role Change</option>
                <option value="Specials">Specials</option>
              </Field>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <Field
                type="text"
                name="title"
                className="mt-1 block w-full border-gray-600 border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                placeholder="Enter request title"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <Field
                as="textarea"
                name="description"
                className="mt-1 block w-full border-gray-600 border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
                placeholder="Enter request description"
                rows="4"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Attachment
              </label>
              <input
                type="file"
                name="attachment"
                id="attachment"
                onChange={(e) => setFieldValue("attachment", e.target.files[0])}
                className="mt-1 block w-full border-gray-600 border  rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                First Approver
              </label>
              <Field
                as="select"
                name="first_approver"
                className="mt-1 block w-full border-gray-600 border rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3"
              >
                <option value="">Select First Approver</option>
                {users?.map((user) => (
                  <option key={user?.email} value={user?.email}>
                    {user?.name}
                  </option>
                ))}
              </Field>
            </div>

            <button
              type="submit"
              className={`w-full text-white secondary-button font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Submit Request"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default MakeApprovalRequest;
