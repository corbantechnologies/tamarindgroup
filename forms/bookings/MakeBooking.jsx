import { createBooking } from "@/services/bookings";
import { apiActions, apiMultipartActions } from "@/tools/api";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import * as Yup from "yup";

const validationSchema = Yup.object({
  ticket_type: Yup.string().required("Please select a ticket type"),
  quantity: Yup.number()
    .min(1, "Quantity must be at least 1")
    .required("Please enter quantity")
    .test(
      "quantity-available",
      "Quantity exceeds available tickets",
      function (value) {
        const ticketType = this?.parent?.ticket_type;
        const ticket = this?.options?.context?.ticket_types?.find(
          (t) => t?.identity === ticketType
        );
        return (
          !ticket?.quantity_available || value <= ticket?.quantity_available
        );
      }
    ),
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email address"),
  phone: Yup.string()
    .matches(
      /^\+\d{10,15}$/,
      "Phone number must include country code (e.g., +1234567890)"
    )
    .required("Phone number is required"),
});

function MakeBooking({ event, closeModal, refetchEvent }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if any ticket types are available
  const hasAvailableTickets = event.ticket_types.some(
    (ticket) => !ticket.quantity_available || ticket.quantity_available > 0
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">
            Book Tickets for {event.name}
          </h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {!hasAvailableTickets ? (
          <div className="text-center py-4">
            <p className="text-red-500 font-medium mb-4">
              Sorry, no tickets are available for this event.
            </p>
            <button
              onClick={() => {
                closeModal();
                router.push(`/events/${event.identity}`);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Back to Event
            </button>
          </div>
        ) : (
          <Formik
            initialValues={{
              ticket_type: "",
              quantity: 1,
              name: "",
              email: "",
              phone: "",
            }}
            validationSchema={validationSchema}
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
              setLoading(true);
              try {
                const formData = new FormData();
                formData.append("ticket_type", values.ticket_type);
                formData.append("quantity", values.quantity);
                formData.append("name", values.name);
                formData.append("email", values.email);
                formData.append("phone", values.phone);

                // submit the form data to the server and save the response to local storage
                const response = await apiMultipartActions?.post(
                  `/api/v1/bookings/create/event/`,
                  formData
                );
                router.push(`/payment/${response?.data?.reference}`);
                setLoading(false);
                refetchEvent();
                closeModal();
              } catch (error) {
                setLoading(false);
              } finally {
                setLoading(false);
              }
            }}
          >
            {({ isSubmitting, values, setFieldValue }) => {
              const selectedTicket = event.ticket_types.find(
                (t) => t.identity === values.ticket_type
              );
              const maxQuantity = selectedTicket?.quantity_available || 10;

              return (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="ticket_type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Ticket Type
                    </label>
                    <Field
                      as="select"
                      name="ticket_type"
                      className="mt-1 block p-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                    >
                      <option value="">Select a ticket type</option>
                      {event.ticket_types.map((ticket) => (
                        <option
                          key={ticket.id}
                          value={ticket.identity}
                          disabled={
                            ticket.quantity_available !== null &&
                            ticket.quantity_available <= 0
                          }
                        >
                          {ticket.name} - KES{" "}
                          {parseFloat(ticket.price).toLocaleString()}
                          {ticket.quantity_available !== null
                            ? ` (${ticket.quantity_available} available)`
                            : " (Unlimited)"}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="ticket_type"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="quantity"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Quantity
                    </label>
                    <div className="flex items-center mt-1">
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            "quantity",
                            Math.max(1, values.quantity - 1)
                          )
                        }
                        className="px-3 py-1 border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:bg-gray-100"
                        disabled={values.quantity <= 1}
                      >
                        -
                      </button>
                      <Field
                        type="number"
                        name="quantity"
                        min="1"
                        max={maxQuantity}
                        className="w-full px-3 py-1 text-center border-t border-b border-gray-300 focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setFieldValue(
                            "quantity",
                            Math.min(maxQuantity, values.quantity + 1)
                          )
                        }
                        className="px-3 py-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                        disabled={values.quantity >= maxQuantity}
                      >
                        +
                      </button>
                    </div>
                    <ErrorMessage
                      name="quantity"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                    {selectedTicket &&
                      selectedTicket.quantity_available !== null && (
                        <p className="text-sm text-gray-600 mt-1">
                          {selectedTicket.quantity_available} tickets available
                        </p>
                      )}
                  </div>

                  {values.ticket_type && (
                    <div className="text-sm text-gray-700">
                      <strong>Total Cost:</strong> KES{" "}
                      {(
                        parseFloat(
                          event.ticket_types.find(
                            (t) => t.identity === values.ticket_type
                          )?.price || 0
                        ) * values.quantity
                      ).toLocaleString()}
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Full Name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      className="mt-1 block p-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email (Optional, for ticket delivery)
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="mt-1 block p-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Phone Number <span className="text-red-500">*</span>{" "}
                      (Required for ticket verification)
                    </label>
                    <Field
                      type="text"
                      name="phone"
                      placeholder="+1234567890"
                      className="mt-1 block p-2 border w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                    />
                    <ErrorMessage
                      name="phone"
                      component="p"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <p className="text-xs text-gray-500">
                    Complete your booking within 15 minutes to secure your
                    tickets.
                  </p>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:bg-red-400"
                    >
                      {loading ? "Processing..." : "Proceed to Payment"}
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        )}
      </div>
    </div>
  );
}

export default MakeBooking;
