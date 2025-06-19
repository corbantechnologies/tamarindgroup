"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { updateFeedbackForm } from "@/services/feedbackforms";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

function UpdateFeedbackForm({ refetch, closeModal, center, feedbackForm }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <>
      <Formik
        initialValues={{
          logo: null,
          center: feedbackForm?.center,
          title: feedbackForm?.title || "",
          description: feedbackForm?.description || "",
          is_accomodation: feedbackForm?.is_accomodation || false,
        }}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const formData = new FormData();

            if (values?.logo) {
              formData.append("logo", values?.logo);
            }
            formData.append("center", values?.center);
            formData.append("title", values?.title);
            formData.append("description", values?.description);
            formData.append("is_accomodation", values?.is_accomodation);
            await updateFeedbackForm(
              formData,
              axios,
              feedbackForm?.form_identity
            );
            toast?.success("Feedback form updated successfully!");
            refetch();
            closeModal();
          } catch (error) {
            toast?.error("Error creating feedback form");
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ setFieldValue }) => (
          <Form className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow">
            <Image
              className="mx-auto"
              src="/logo.png"
              alt="Tamarind Logo"
              width={100}
              height={100}
            />
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
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Form Logo
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                onChange={(e) => setFieldValue("logo", e.target.files[0])}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none py-2 px-3"
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
              {loading ? "Updating..." : "Update Feedback Form"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default UpdateFeedbackForm;
