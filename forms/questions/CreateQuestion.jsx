"use client";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createQuestion } from "@/services/questions";
import { Field, Form, Formik } from "formik";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";

function CreateQuestion({ feedbackForm, closeModal, refetch }) {
  const [loading, setLoading] = useState(false);
  const axios = useAxiosAuth();

  return (
    <Formik
      initialValues={{
        feedback_form: feedbackForm?.form_identity,
        text: "",
        type: "", // RATING, TEXT, YES_NO
        order: 0,
      }}
      onSubmit={async (values) => {
        setLoading(true);
        try {
          await createQuestion(values, axios);
          toast?.success("Question created successfully!");
          refetch();
          closeModal();
        } catch (error) {
          toast?.error("Error creating question");
          console.log(error)
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
            Create Question
          </h2>

          <div className="mb-6 hidden">
            <label
              htmlFor="feedbackForm"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Feedback Form
            </label>
            <Field
              type="text"
              id="feedbackForm"
              name="feedbackForm"
              className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              disabled
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="text"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Question Text
            </label>
            <Field
              type="text"
              id="text"
              name="text"
              className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="type"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Type
            </label>
            <Field
              as="select"
              id="type"
              name="type"
              className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            >
              <option value="">Select Type</option>
              <option value="RATING">Rating</option>
              <option value="TEXT">Text</option>
              <option value="YES_NO">Yes/No</option>
            </Field>
          </div>

          <div className="mb-6">
            <label
              htmlFor="order"
              className="block mb-2 text-sm font-medium text-gray-900"
            >
              Order
            </label>
            <Field
              type="number"
              id="order"
              name="order"
              className="text-sm text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              min="0"
            />
          </div>

          <button
            type="submit"
            className={`w-full text-white secondary-button font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Question"}
          </button>
        </Form>
      )}
    </Formik>
  );
}

export default CreateQuestion;
