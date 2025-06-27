"use client";

import Image from "next/image";
import React from "react";
import { FaCheckCircle } from "react-icons/fa"; // Switched to FaCheckCircle for a more complete icon

function Success() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-xl shadow-lg py-8 text-center">
        <Image
          className="mx-auto"
          src="/logo.png"
          alt="Tamarind Logo"
          width={120}
          height={120}
        />

        <FaCheckCircle className="text-green-500 text-7xl mx-auto mt-6 animate-pulse" />

        <div className="mt-6 px-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Thank You for Your Feedback!
          </h1>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            We’re grateful for your valuable input. Your insights are helping us
            enhance our services to better serve you and our community. Stay
            tuned for improvements, and feel free to share more anytime!
          </p>
          <p className="mt-4 text-gray-500 text-sm">
            If you have any further questions or need assistance, please contact
            us at{" "}
            <a
              href="tel:+254725959552"
              className="text-blue-500 hover:underline"
            >
              +254 725 959 552
            </a>{" "}
            or{" "}
            <a
              href="tel:+254722205160"
              className="text-blue-500 hover:underline"
            >
              +254 722 205 160
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Success;
