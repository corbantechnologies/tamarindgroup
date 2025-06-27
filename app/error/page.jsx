"use client";

import Image from "next/image";
import React from "react";
import { FaExclamationTriangle } from "react-icons/fa"; // Icon for error
import { useRouter } from "next/navigation";
import Link from "next/link";

function Error() {
  const router = useRouter();

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

        <FaExclamationTriangle className="text-red-500 text-7xl mx-auto mt-6" />

        <div className="mt-6 px-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Oops, Something Went Wrong!
          </h1>
          <p className="mt-4 text-gray-600 text-lg leading-relaxed">
            We’re sorry, but an error occurred while processing your request.
            Please try again, or contact support if the issue persists.
          </p>
          <Link
            href="/"
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Return to Homepage
          </Link>
          {/* <button
            onClick={() => router.push("/")}
            className="mt-6 inline-block px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Return to Homepage
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default Error;
