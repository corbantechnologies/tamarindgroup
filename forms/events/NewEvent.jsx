import React from "react";
import { Formik, Field, FieldArray, Form } from "formik";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import { createEvent } from "@/services/events";

function NewEvent({ closeModal, refetchEvents }) {
  const axios = useAxiosAuth();

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
          ticket_types: [
            { name: "", price: "", quantity_available: "", is_limited: false },
          ],
        }}
        onSubmit={async (values) => {
          // Create JSON object for logging
          const logData = {
            name: values.name,
            description: values.description,
            start_date: values.start_date,
            start_time: values.start_time ? `${values.start_time}:00` : "",
            end_date: values.end_date,
            end_time: values.end_time ? `${values.end_time}:00` : "",
            venue: values.venue,
            capacity: values.capacity ? Number(values.capacity) : null,
            ticket_types: values.ticket_types.map((ticket) => ({
              name: ticket.name,
              price: ticket.price ? Number(ticket.price) : null,
              quantity_available: ticket.quantity_available
                ? Number(ticket.quantity_available)
                : null,
              is_limited: ticket.is_limited,
            })),
          };

          // Log JSON object
          console.log(JSON.stringify(logData, null, 4));

          // Create FormData for backend
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

          // Append ticket_types as nested structure
          values.ticket_types.forEach((ticket, index) => {
            formData.append(`ticket_types[${index}][name]`, ticket.name || "");
            formData.append(
              `ticket_types[${index}][price]`,
              ticket.price ? ticket.price.toString() : ""
            );
            if (ticket.is_limited && ticket.quantity_available) {
              formData.append(
                `ticket_types[${index}][quantity_available]`,
                ticket.quantity_available.toString()
              );
            }
            formData.append(
              `ticket_types[${index}][is_limited]`,
              ticket.is_limited.toString()
            );
          });

          // Debug FormData contents
          for (const [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
          }

          // Submit to backend
          try {
            await createEvent(formData, axios);
            refetchEvents(); // Refresh event list
            closeModal(); // Close modal on success
          } catch (error) {
            console.error("Create Event Error:", error.response?.data || error);
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
                  </div>
                )}
              </FieldArray>
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
                Create Event
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default NewEvent;
