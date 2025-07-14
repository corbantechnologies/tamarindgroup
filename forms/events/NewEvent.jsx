import React, { useState } from "react";
import { Formik, Field, FieldArray, Form } from "formik";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createEvent } from "@/services/events";
import { useRouter } from "next/navigation";
import { apiMultipartActions } from "@/tools/api";
import toast from "react-hot-toast";

function NewEvent({ closeModal }) {
  const axios = useAxiosAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Event</h2>
      <Formik
        initialValues={{
          name: "",
          description: "",
          start_date: "",
          start_time: "",
          end_date: "",
          end_time: "",
          venue: "",
          capacity: "",
          image: null,
        }}
        onSubmit={async (values) => {
          // Submit to backend
          setLoading(true);
          try {
            const formData = new FormData();
            if (values.image) {
              formData.append("image", values.image);
            }
            formData.append("name", values.name);
            formData.append("description", values.description);
            formData.append("start_date", values.start_date);
            formData.append(
              "start_time",
              values.start_time ? `${values.start_time}:00` : ""
            );
            formData.append("end_date", values.end_date || "");
            formData.append(
              "end_time",
              values.end_time ? `${values.end_time}:00` : ""
            );
            formData.append("venue", values.venue);
            formData.append(
              "capacity",
              values.capacity ? values.capacity.toString() : ""
            );

            const response = await apiMultipartActions?.post(
              `/api/v1/events/`,
              formData,
              axios
            );
            router?.push(`/admin/events/${response?.data?.identity}`);
            setLoading(false);
            toast.success(
              "Event created successfully! Proceed to add tickets."
            );
            closeModal();
          } catch (error) {
            toast.error("Failed to create event. Please try again.");
            // console.error("Create Event Error:", error.response?.data || error);
          } finally {
            setLoading(false);
          }
        }}
      >
        {({ values, setFieldValue }) => (
          <Form className="space-y-6">
            {/* Event Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Event Name
              </label>
              <Field
                name="name"
                type="text"
                className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event name"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <Field
                name="description"
                as="textarea"
                className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="5"
                placeholder="Describe the event"
              />
            </div>

            {/* Start Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="start_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Date
                </label>
                <Field
                  name="start_date"
                  type="date"
                  className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Time (Optional)
                </label>
                <Field
                  name="start_time"
                  type="time"
                  className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* End Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="end_date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Date (Optional)
                </label>
                <Field
                  name="end_date"
                  type="date"
                  className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label
                  htmlFor="end_time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  End Time (Optional)
                </label>
                <Field
                  name="end_time"
                  type="time"
                  className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Venue */}
            <div>
              <label
                htmlFor="venue"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Venue
              </label>
              <Field
                name="venue"
                type="text"
                className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter venue name"
              />
            </div>

            {/* Capacity */}
            <div>
              <label
                htmlFor="capacity"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Capacity
              </label>
              <Field
                name="capacity"
                type="number"
                className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event capacity"
              />
            </div>

            {/* Image */}
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Image (Optional)
              </label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={(e) => setFieldValue("image", e.target.files[0])}
                className="block w-full border border-gray-300 rounded-md p-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 mt-6">
              <button
                type="button"
                className="secondary-button px-6 py-2 rounded hover:bg-gray-200 transition-colors"
                onClick={closeModal}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-button px-6 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {loading ? "Creating..." : "Create Event"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default NewEvent;
