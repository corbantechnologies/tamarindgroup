"use client";

import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createCenter } from "@/services/centers";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateCenter({ refetch, closeModal }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <>
      <Formik
        initialValues={{
          logo: null,
          name: "",
          description: "",
          location: "",
          contact: "",
        }}
        onSubmit={async (values) => {
          setLoading(true);
          try {
            const formData = new FormData();

            if (values?.logo) {
              formData.append("logo", values?.logo);
            }
            formData.append("name", values?.name);
            formData.append("description", values?.description);
            formData.append("location", values?.location);
            formData.append("contact", values?.contact);

            await createCenter(formData, axios);
            toast?.success("Center created successfully!");
            refetch();
            closeModal();
          } catch (error) {
            toast?.error("Something went wrong!");
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
              Create Center
            </h2>

            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Center Logo
              </label>
              <input
                type="file"
                id="logo"
                name="logo"
                onChange={(e) => setFieldValue("logo", e.target.files[0])}
                className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none py-2 px-3"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Center Name
              </label>
              <Field
                type="text"
                id="name"
                name="name"
                className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="contact"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Contact
              </label>
              <Field
                type="text"
                id="contact"
                name="contact"
                className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Location
              </label>
              <Field
                type="text"
                id="location"
                name="location"
                className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>

            <div className="mb-6">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Description
              </label>
              <Field
                type="textarea"
                id="description"
                name="description"
                className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
            <button
              type="submit"
              className={`w-full text-white secondary-button font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Center"}
            </button>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default CreateCenter;
