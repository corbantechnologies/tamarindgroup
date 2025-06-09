"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createFeedbackForm } from "@/services/feedbackforms";
import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateFeedbackForm({ refetch, closeModal, center }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <>
      <Formik
        initialValues={{
          center: center?.name,
          title: "",
          description: "",
          is_accomodation: false,
        }}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const formData = new FormData();

            formData.append("center", values?.center);
            formData.append("title", values?.title);
            formData.append("description", values?.description);
            formData.append("is_accomodation", values?.is_accomodation);
            await createFeedbackForm(formData, axios);
            toast?.success("Feedback form created successfully!");
            refetch();
            closeModal();
          } catch (error) {
            toast?.error("Error creating feedback form");
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ touched }) => (
          <Form className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow">
            <h2 className="mb-6 text-2xl font-bold text-center">
              Create Feedback Form
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Center
              </label>
              <Field
                className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                id="center"
                name="center"
                type="text"
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <Field
                className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                id="title"
                name="title"
                type="text"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <Field
                className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                id="description"
                name="description"
                type="text"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2 flex items-center">
                Is Accommodation Form
              </label>
              <div className="flex items-center">
                <Field
                  className="h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  id="is_accomodation"
                  name="is_accomodation"
                  type="checkbox"
                />
              </div>
            </div>
            <button
              type="submit"
              className={`w-full text-white secondary-button font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Feedback Form"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CreateFeedbackForm;
