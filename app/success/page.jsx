"use client";

import Image from "next/image";
import React from "react";
import { FaCheck } from "react-icons/fa";

function Success() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg py-6">
        <Image
          className="mx-auto"
          src="/logo.png"
          alt="Tamarind Logo"
          width={100}
          height={100}
        />

        <FaCheck className="text-green-500 text-6xl mx-auto mt-4" />

        <div className="mt-4 text-center px-6">
          <h1 className="text-2xl font-bold">
            Feedback Submitted Successfully
          </h1>
          <p className="mt-2">
            Thank you for submitting your feedback. This helps us improve our
            service delivery enabling us serve you better.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Success;
