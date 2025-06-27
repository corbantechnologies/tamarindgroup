"use client";

import React, { useState, useCallback } from "react";

const RatingButtons = ({ value, onChange, maxRating = 5 }) => {
  const [rating, setRating] = useState(value || 0);
  const [hoverIndex, setHoverIndex] = useState(null);

  const handleClick = useCallback(
    (newRating) => {
      setRating(newRating);
      if (onChange) onChange(newRating);
    },
    [onChange]
  );

  const handleMouseEnter = useCallback((index) => {
    setHoverIndex(index);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverIndex(null);
  }, []);

  return (
    <div className="flex space-x-4">
      {" "}
      {/* Changed from space-x-2 to space-x-4 */}
      {[...Array(maxRating)].map((_, index) => {
        const buttonValue = index + 1;
        const isSelected = buttonValue <= (hoverIndex || rating);
        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(buttonValue)}
            onMouseEnter={() => handleMouseEnter(buttonValue)}
            onMouseLeave={handleMouseLeave}
            className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-colors duration-200 ${
              isSelected
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {buttonValue}
          </button>
        );
      })}
    </div>
  );
};

export default RatingButtons;
