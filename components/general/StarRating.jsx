"use client";

import React from "react";

const StarRating = ({ rating, maxRating = 5 }) => {
  const filledStars = Math.min(Math.max(0, Math.round(rating)), maxRating); // Ensure rating is between 0 and maxRating
  const hasHalfStar = rating % 1 !== 0; // Check for decimal (e.g., 3.5)

  return (
    <div className="flex items-center">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        let starClass = "text-yellow-400";

        if (starValue <= filledStars) {
          starClass += " filled"; // Full star
        } else if (
          hasHalfStar &&
          starValue === Math.ceil(rating) &&
          rating % 1 >= 0.25
        ) {
          starClass += " half"; // Half star
        } else {
          starClass += " empty"; // Empty star
        }

        return (
          <span key={index} className={`text-2xl ${starClass}`}>
            ★
          </span>
        );
      })}
      <span className="ml-2 text-gray-600">
        {rating.toFixed(1)} / {maxRating}
      </span>
    </div>
  );
};

export default StarRating;
