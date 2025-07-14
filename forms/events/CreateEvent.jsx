import React from "react";
import { Formik, Form, Field, FieldArray, ErrorMessage } from "formik";
import * as Yup from "yup";
import { createEvent } from "@/services/events";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";

// Validation schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string().required("Event name is required"),
  description: Yup.string().required("Description is required"),
  start_date: Yup.date().required("Start date is required").nullable(),
  start_time: Yup.string().nullable(),
  end_date: Yup.date()
    .nullable()
    .when("start_date", (start_date, schema) =>
      start_date
        ? schema.min(start_date, "End date must be after start date")
        : schema
    ),
  end_time: Yup.string()
    .nullable()
    .when(["start_date", "end_date", "start_time"], {
      is: (start_date, end_date, start_time) =>
        start_date && end_date && start_time && start_date === end_date,
      then: Yup.string()
        .nullable()
        .test(
          "end-time-after-start",
          "End time must be after start time on the same day",
          function (end_time) {
            const { start_time } = this.parent;
            if (!start_time || !end_time) return true;
            return end_time > start_time;
          }
        ),
    }),
  venue: Yup.string().required("Venue is required"),
  capacity: Yup.number()
    .required("Capacity is required")
    .positive("Capacity must be positive")
    .integer("Capacity must be an integer"),
  image: Yup.mixed().nullable(),
  ticket_types: Yup.array()
    .of(
      Yup.object().shape({
        name: Yup.string().required("Ticket type name is required"),
        price: Yup.number()
          .required("Price is required")
          .min(0, "Price cannot be negative"),
        quantity_available: Yup.number()
          .nullable()
          .when("is_limited", {
            is: true,
            then: Yup.number().min(
              1,
              "Quantity available must be at least 1 when limited"
            ),
          }),
        is_limited: Yup.boolean(),
      })
    )
    .min(1, "At least one ticket type is required")
    .test(
      "total-tickets-vs-capacity",
      "Total ticket quantities cannot exceed event capacity",
      function (ticket_types) {
        const { capacity } = this.parent;
        if (!capacity || !ticket_types) return true;
        const totalTickets = ticket_types.reduce(
          (sum, tt) =>
            sum +
            (tt.is_limited && tt.quantity_available
              ? Number(tt.quantity_available)
              : 0),
          0
        );
        return totalTickets <= capacity;
      }
    ),
});

function CreateEvent({ refetch, closeModal }) {
  const axios = useAxiosAuth();
  const initialValues = {
    name: "",
    description: "",
    start_date: "",
    start_time: "",
    end_date: "",
    end_time: "",
    venue: "",
    capacity: "",
    image: null,
    ticket_types: [
      { name: "", price: "", quantity_available: "", is_limited: false },
    ],
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      // Prepare payload
      const payload = {
        ...values,
        ticket_types: values.ticket_types.map((tt) => ({
          name: tt.name,
          price: parseFloat(tt.price),
          quantity_available:
            tt.is_limited && tt.quantity_available
              ? parseInt(tt.quantity_available)
              : undefined,
          is_limited: tt.is_limited,
        })),
      };

      // Handle image upload if present
      const formData = new FormData();
      Object.entries(payload).forEach(([key, value]) => {
        if (key === "ticket_types") {
          formData.append(key, JSON.stringify(value));
        } else if (key === "image" && value) {
          formData.append(key, value);
        } else {
          formData.append(key, value);
        }
      });

      // Submit to API
      await createEvent(formData, axios);

      // Refetch events and close modal
      refetch();
      resetForm();
      closeModal();
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Event</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, isSubmitting, setFieldValue }) => (
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
              <ErrorMessage
                name="name"
                component="div"
                className="text-red-500 text-sm mt-1"
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
              <ErrorMessage
                name="description"
                component="div"
                className="text-red-500 text-sm mt-1"
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
                <ErrorMessage
                  name="start_date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>
              <div>
                <label
                  htmlFor="start_time"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Start Time
                </label>
                <Field
                  name="start_time"
                  type="time"
                  className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <ErrorMessage
                  name="start_time"
                  component="div"
                  className="text-red-500 text-sm mt-1"
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
                <ErrorMessage
                  name="end_date"
                  component="div"
                  className="text-red-500 text-sm mt-1"
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
                <ErrorMessage
                  name="end_time"
                  component="div"
                  className="text-red-500 text-sm mt-1"
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
              <ErrorMessage
                name="venue"
                component="div"
                className="text-red-500 text-sm mt-1"
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
              <ErrorMessage
                name="capacity"
                component="div"
                className="text-red-500 text-sm mt-1"
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
                name="image"
                type="file"
                accept="image/*"
                onChange={(event) =>
                  setFieldValue("image", event.currentTarget.files[0])
                }
                className="block w-full border border-gray-300 rounded-md p-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <ErrorMessage
                name="image"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            {/* Ticket Types */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket Types
              </label>
              <FieldArray name="ticket_types">
                {({ push, remove }) => (
                  <div className="space-y-4">
                    {values.ticket_types.map((ticket, index) => (
                      <div
                        key={index}
                        className="border border-gray-200 p-6 rounded-lg bg-gray-50"
                      >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Ticket Type {index + 1}
                          </h3>
                          {values.ticket_types.length > 1 && (
                            <button
                              type="button"
                              className="text-red-500 hover:text-red-700 font-medium"
                              onClick={() => remove(index)}
                            >
                              Remove
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={`ticket_types.${index}.name`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Ticket Name
                            </label>
                            <Field
                              name={`ticket_types.${index}.name`}
                              type="text"
                              className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter ticket name"
                            />
                            <ErrorMessage
                              name={`ticket_types.${index}.name`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`ticket_types.${index}.price`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Price
                            </label>
                            <Field
                              name={`ticket_types.${index}.price`}
                              type="number"
                              step="0.01"
                              className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter price"
                            />
                            <ErrorMessage
                              name={`ticket_types.${index}.price`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor={`ticket_types.${index}.quantity_available`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Quantity Available (Optional)
                            </label>
                            <Field
                              name={`ticket_types.${index}.quantity_available`}
                              type="number"
                              className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter quantity"
                            />
                            <ErrorMessage
                              name={`ticket_types.${index}.quantity_available`}
                              component="div"
                              className="text-red-500 text-sm mt-1"
                            />
                          </div>
                          <div className="flex items-center">
                            <label
                              htmlFor={`ticket_types.${index}.is_limited`}
                              className="block text-sm font-medium text-gray-700 mr-3"
                            >
                              Limited Quantity?
                            </label>
                            <Field
                              name={`ticket_types.${index}.is_limited`}
                              type="checkbox"
                              className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="primary-button px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors"
                      onClick={() =>
                        push({
                          name: "",
                          price: "",
                          quantity_available: "",
                          is_limited: false,
                        })
                      }
                    >
                      Add Ticket Type
                    </button>
                    <ErrorMessage
                      name="ticket_types"
                      component="div"
                      className="text-red-500 text-sm mt-2"
                    />
                  </div>
                )}
              </FieldArray>
            </div>

            {/* Submit Button */}
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
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating..." : "Create Event"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreateEvent;
