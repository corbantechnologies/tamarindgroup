"use client";

import React from "react";

function TicketTypeChip({ ticketType, isLowestPrice }) {
  const formatPrice = (price) => {
    const numPrice = parseFloat(price);
    return numPrice.toLocaleString("en-KE", {
      style: "currency",
      currency: "KES",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
        isLowestPrice
          ? "bg-red-100 text-red-800 border border-red-200"
          : "bg-gray-100 text-gray-700 border border-gray-200"
      }`}
    >
      <span className="font-semibold">{formatPrice(ticketType.price)}</span>
      <span className="ml-2 text-xs opacity-75">{ticketType.name}</span>
      {ticketType.quantity_available && ticketType.quantity_available <= 10 && (
        <span className="ml-2 text-xs px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full">
          {ticketType.quantity_available} left
        </span>
      )}
    </div>
  );
}

export default TicketTypeChip;
