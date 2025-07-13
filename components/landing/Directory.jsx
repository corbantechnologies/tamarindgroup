"use client";
import { msa_directory } from "@/data/directory-msa";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

function Directory() {
  const [activeTab, setActiveTab] = useState("100");

  const handleItemClick = (item) => {
    // Implement navigation to detail page (e.g., using Next.js router)
  };

  return (
    <section className="container mx-auto p-4 mb-3">
      <h2 className="text-3xl font-bold text-center">Hotel Directory</h2>
      <div className="mt-6">
        <div className="overflow-x-auto">
          <div className="flex  justify-center items-center space-x-4 border-b border-gray-200 pb-2 min-w-max">
            {msa_directory.map((category) => (
              <div
                key={category.id}
                className="flex items-center cursor-pointer px-4 py-2 hover:bg-gray-100 rounded-md"
                onClick={() => setActiveTab(category.id.toString())}
              >
                <span className="mr-2">{category.icon}</span>
                <span
                  className={`relative ${
                    activeTab === category.id.toString()
                      ? "border-b-2 border-yellow-500 text-yellow-500 font-semibold"
                      : "text-gray-500"
                  }`}
                >
                  {category.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {msa_directory
            .filter((category) => category.id.toString() === activeTab)
            .map((category) =>
              category.items.map((item) => (
                <Link
                  href={`/directory/${item.id}`}
                  key={item.id}
                  className="bg-white shadow-md rounded-lg p-2 flex items-center cursor-pointer hover:bg-gray-50"
                  onClick={() => handleItemClick(item)}
                >
                  <div className="w-1/3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={100}
                      className="object-cover rounded-md"
                    />
                  </div>
                  <div className="w-2/3 pl-4">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <p className="text-gray-600">{item.subtitle}</p>
                  </div>
                </Link>
              ))
            )}
        </div>
      </div>
    </section>
  );
}

export default Directory;
