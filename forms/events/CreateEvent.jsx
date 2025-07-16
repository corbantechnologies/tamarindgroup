import React, { useState } from "react";
// import { useForm, useFieldArray, Controller } from "react-hook-form";
import { createEvent } from "@/services/events";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import toast from "react-hot-toast";

function CreateEvent({ refetch, closeModal }) {
  const axios = useAxiosAuth();
  const [backendErrors, setBackendErrors] = useState({});
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting, isValid },
    reset,
  } = useForm({
    defaultValues: {
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
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticket_types",
  });

  const validateForm = (data) => {
    const newErrors = {};

    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      if (end < start) {
        newErrors.end_date = { message: "End date must be after start date" };
      }
    }

    if (
      data.start_date &&
      data.end_date &&
      data.start_time &&
      data.end_time &&
      new Date(data.start_date).toISOString().split("T")[0] ===
        new Date(data.end_date).toISOString().split("T")[0]
    ) {
      if (data.end_time <= data.start_time) {
        newErrors.end_time = {
          message: "End time must be after start time on the same day",
        };
      }
    }

    if (data.capacity && data.ticket_types) {
      const totalTickets = data.ticket_types.reduce(
        (sum, tt) =>
          sum +
          (tt.is_limited && tt.quantity_available
            ? Number(tt.quantity_available)
            : 0),
        0
      );
      if (totalTickets > Number(data.capacity)) {
        newErrors.ticket_types = {
          message: "Total ticket quantities cannot exceed event capacity",
        };
      }
    }

    return Object.keys(newErrors).length > 0 ? newErrors : null;
  };

  const onSubmit = async (data) => {
    setBackendErrors({});

    const customErrors = validateForm(data);
    if (customErrors) {
      Object.entries(customErrors).forEach(([key, error]) => {
        setBackendErrors((prev) => ({ ...prev, [key]: [error.message] }));
      });
      return;
    }

    try {
      const validTicketTypes = data.ticket_types.filter(
        (ticket) =>
          ticket.name.trim() && ticket.price !== "" && !isNaN(ticket.price)
      );

      if (validTicketTypes.length === 0) {
        setBackendErrors({
          ticket_types: ["At least one valid ticket type is required"],
        });
        return;
      }

      const formDataPayload = new FormData();

      if (data?.image) {
        formDataPayload.append("image", data?.image[0]);
      }
      formDataPayload.append("name", data.name);
      formDataPayload.append("description", data.description);
      formDataPayload.append("start_date", data.start_date);
      formDataPayload.append("start_time", data.start_time);
      formDataPayload.append("end_date", data.end_date);
      formDataPayload.append("end_time", data.end_time);
      formDataPayload.append("venue", data.venue);
      formDataPayload.append("capacity", data.capacity);
      formDataPayload.append("ticket_types", JSON.stringify(validTicketTypes));

      // Submit to API
      await createEvent(formDataPayload, axios);

      refetch();
      reset();
      closeModal();
    } catch (error) {
      console.error("Error creating event:", error);
      if (error.response?.data) {
        setBackendErrors(error.response.data);
      }
      toast.error("Failed to create event. Please check the form for errors.");
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Create Event</h2>
      {backendErrors.non_field_errors && (
        <div className="text-red-500 text-sm mb-4">
          {backendErrors.non_field_errors.join(", ")}
        </div>
      )}
      {backendErrors.ticket_types &&
        !Array.isArray(backendErrors.ticket_types) && (
          <div className="text-red-500 text-sm mb-4">
            {backendErrors.ticket_types}
          </div>
        )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Event Name
          </label>
          <Controller
            name="name"
            control={control}
            rules={{ required: "Event name is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event name"
              />
            )}
          />
          {errors.name && (
            <div className="text-red-500 text-sm mt-1">
              {errors.name.message}
            </div>
          )}
          {backendErrors.name && (
            <div className="text-red-500 text-sm mt-1">
              {backendErrors.name.join(", ")}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Description
          </label>
          <Controller
            name="description"
            control={control}
            rules={{ required: "Description is required" }}
            render={({ field }) => (
              <textarea
                {...field}
                className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows="5"
                placeholder="Describe the event"
              />
            )}
          />
          {errors.description && (
            <div className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </div>
          )}
          {backendErrors.description && (
            <div className="text-red-500 text-sm mt-1">
              {backendErrors.description.join(", ")}
            </div>
          )}
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
            <Controller
              name="start_date"
              control={control}
              rules={{ required: "Start date is required" }}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            {errors.start_date && (
              <div className="text-red-500 text-sm mt-1">
                {errors.start_date.message}
              </div>
            )}
            {backendErrors.start_date && (
              <div className="text-red-500 text-sm mt-1">
                {backendErrors.start_date.join(", ")}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="start_time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Time
            </label>
            <Controller
              name="start_time"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="time"
                  className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            {errors.start_time && (
              <div className="text-red-500 text-sm mt-1">
                {errors.start_time.message}
              </div>
            )}
            {backendErrors.start_time && (
              <div className="text-red-500 text-sm mt-1">
                {backendErrors.start_time.join(", ")}
              </div>
            )}
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
            <Controller
              name="end_date"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="date"
                  className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            {errors.end_date && (
              <div className="text-red-500 text-sm mt-1">
                {errors.end_date.message}
              </div>
            )}
            {backendErrors.end_date && (
              <div className="text-red-500 text-sm mt-1">
                {backendErrors.end_date.join(", ")}
              </div>
            )}
          </div>
          <div>
            <label
              htmlFor="end_time"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Time (Optional)
            </label>
            <Controller
              name="end_time"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  type="time"
                  className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              )}
            />
            {errors.end_time && (
              <div className="text-red-500 text-sm mt-1">
                {errors.end_time.message}
              </div>
            )}
            {backendErrors.end_time && (
              <div className="text-red-500 text-sm mt-1">
                {backendErrors.end_time.join(", ")}
              </div>
            )}
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
          <Controller
            name="venue"
            control={control}
            rules={{ required: "Venue is required" }}
            render={({ field }) => (
              <input
                {...field}
                type="text"
                className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter venue name"
              />
            )}
          />
          {errors.venue && (
            <div className="text-red-500 text-sm mt-1">
              {errors.venue.message}
            </div>
          )}
          {backendErrors.venue && (
            <div className="text-red-500 text-sm mt-1">
              {backendErrors.venue.join(", ")}
            </div>
          )}
        </div>

        {/* Capacity */}
        <div>
          <label
            htmlFor="capacity"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Capacity
          </label>
          <Controller
            name="capacity"
            control={control}
            rules={{
              required: "Capacity is required",
              validate: (value) =>
                (Number(value) > 0 && Number.isInteger(Number(value))) ||
                "Capacity must be a positive integer",
            }}
            render={({ field }) => (
              <input
                {...field}
                type="number"
                className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter event capacity"
              />
            )}
          />
          {errors.capacity && (
            <div className="text-red-500 text-sm mt-1">
              {errors.capacity.message}
            </div>
          )}
          {backendErrors.capacity && (
            <div className="text-red-500 text-sm mt-1">
              {backendErrors.capacity.join(", ")}
            </div>
          )}
        </div>

        {/* Image */}
        <div>
          <label
            htmlFor="image"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Image (Optional)
          </label>
          <Controller
            name="image"
            control={control}
            render={({ field: { onChange, value, ...field } }) => (
              <input
                {...field}
                type="file"
                accept="image/*"
                onChange={(e) => onChange(e.target.files)}
                className="block w-full border border-gray-300 rounded-md p-3 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            )}
          />
          {errors.image && (
            <div className="text-red-500 text-sm mt-1">
              {errors.image.message}
            </div>
          )}
          {backendErrors.image && (
            <div className="text-red-500 text-sm mt-1">
              {backendErrors.image.join(", ")}
            </div>
          )}
        </div>

        {/* Ticket Types */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Ticket Types
          </label>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 p-6 rounded-lg bg-gray-50"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Ticket Type {index + 1}
                  </h3>
                  {fields.length > 1 && (
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
                    <Controller
                      name={`ticket_types.${index}.name`}
                      control={control}
                      rules={{
                        required: "Ticket type name is required",
                        validate: (value) =>
                          value.trim() !== "" ||
                          "Ticket type name cannot be empty",
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="text"
                          className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter ticket name"
                        />
                      )}
                    />
                    {errors.ticket_types?.[index]?.name && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.ticket_types[index].name.message}
                      </div>
                    )}
                    {backendErrors.ticket_types &&
                      backendErrors.ticket_types[index]?.name && (
                        <div className="text-red-500 text-sm mt-1">
                          {backendErrors.ticket_types[index].name.join(", ")}
                        </div>
                      )}
                  </div>
                  <div>
                    <label
                      htmlFor={`ticket_types.${index}.price`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Price
                    </label>
                    <Controller
                      name={`ticket_types.${index}.price`}
                      control={control}
                      rules={{
                        required: "Price is required",
                        validate: (value) =>
                          (value !== "" &&
                            Number(value) >= 0 &&
                            !isNaN(value)) ||
                          "Price must be a non-negative number",
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          step="0.01"
                          className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter price"
                        />
                      )}
                    />
                    {errors.ticket_types?.[index]?.price && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.ticket_types[index].price.message}
                      </div>
                    )}
                    {backendErrors.ticket_types &&
                      backendErrors.ticket_types[index]?.price && (
                        <div className="text-red-500 text-sm mt-1">
                          {backendErrors.ticket_types[index].price.join(", ")}
                        </div>
                      )}
                  </div>
                  <div>
                    <label
                      htmlFor={`ticket_types.${index}.quantity_available`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Quantity Available (Optional)
                    </label>
                    <Controller
                      name={`ticket_types.${index}.quantity_available`}
                      control={control}
                      rules={{
                        validate: (value, formValues) =>
                          !formValues.ticket_types[index].is_limited ||
                          !value ||
                          (Number(value) >= 1 &&
                            Number.isInteger(Number(value))) ||
                          "Quantity available must be at least 1 when limited",
                      }}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="number"
                          className="block w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter quantity"
                        />
                      )}
                    />
                    {errors.ticket_types?.[index]?.quantity_available && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.ticket_types[index].quantity_available.message}
                      </div>
                    )}
                    {backendErrors.ticket_types &&
                      backendErrors.ticket_types[index]?.quantity_available && (
                        <div className="text-red-500 text-sm mt-1">
                          {backendErrors.ticket_types[
                            index
                          ].quantity_available.join(", ")}
                        </div>
                      )}
                  </div>
                  <div className="flex items-center">
                    <label
                      htmlFor={`ticket_types.${index}.is_limited`}
                      className="block text-sm font-medium text-gray-700 mr-3"
                    >
                      Limited Quantity?
                    </label>
                    <Controller
                      name={`ticket_types.${index}.is_limited`}
                      control={control}
                      render={({ field }) => (
                        <input
                          {...field}
                          type="checkbox"
                          checked={field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                          className="h-5 w-5 text-blue-500 rounded focus:ring-blue-500"
                        />
                      )}
                    />
                    {backendErrors.ticket_types &&
                      backendErrors.ticket_types[index]?.is_limited && (
                        <div className="text-red-500 text-sm mt-1">
                          {backendErrors.ticket_types[index].is_limited.join(
                            ", "
                          )}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              className={`primary-button px-4 py-2 rounded mt-4 hover:bg-blue-600 transition-colors ${
                !isValid ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() =>
                append({
                  name: "",
                  price: "",
                  quantity_available: "",
                  is_limited: false,
                })
              }
              disabled={!isValid}
            >
              Add Ticket Type
            </button>
            {errors.ticket_types?.message && (
              <div className="text-red-500 text-sm mt-2">
                {errors.ticket_types.message}
              </div>
            )}
          </div>
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
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateEvent;
