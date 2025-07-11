import { createBooking } from "@/services/bookings";
import { Formik } from "formik";
import React, { useState } from "react";

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
  const bookingData = null;

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
            onSubmit={async (values) => {
              setLoading(true);
              try {
                const formData = new FormData();
                formData.append("ticket_type", values.ticket_type);
                formData.append("quantity", values.quantity);
                formData.append("name", values.name);
                formData.append("email", values.email);
                formData.append("phone", values.phone);

                // submit the form data to the server and save the response to local storage
                const response = await createBooking(
                  `/api/v1/bookings/`,
                  formData
                );
                localStorage.setItem("booking", JSON.stringify(response.data));
                setLoading(false);
                refetchEvent();
                closeModal();
              } catch (error) {
                console.error("Error creating booking:", error);
                setLoading(false);
              } finally {
                setLoading(false);
              }
            }}
          ></Formik>
        )}
      </div>
    </div>
  );
}

export default MakeBooking;
