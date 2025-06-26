"use client";

import React, { useState, useCallback } from "react";

const RatingStars = ({ value, onChange, maxRating = 5 }) => {
  const [rating, setRating] = useState(value || 0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = useCallback(
    (newRating) => {
      setRating(newRating);
      if (onChange) onChange(newRating);
    },
    [onChange]
  );

  const handleMouseEnter = useCallback((newRating) => {
    setHoverRating(newRating);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoverRating(0);
  }, []);

  const displayedRating = hoverRating || rating;

  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= displayedRating;
        const isHalf =
          !Number.isInteger(displayedRating) &&
          starValue === Math.ceil(displayedRating) &&
          displayedRating % 1 >= 0.25;

        return (
          <span
            key={index}
            className={`text-2xl cursor-pointer ${
              isFilled ? "text-yellow-400" : "text-gray-300"
            } ${isHalf ? "relative overflow-hidden" : ""}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onMouseLeave={handleMouseLeave}
          >
            ★
            {isHalf && (
              <span
                className="absolute left-0 top-0 text-yellow-400"
                style={{ width: "50%", overflow: "hidden" }}
              >
                ★
              </span>
            )}
          </span>
        );
      })}
    </div>
  );
};

export default RatingStars;
