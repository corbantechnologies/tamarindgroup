"use client";
import { msa_directory } from "@/data/directory-msa";
import { useRouter } from "next/navigation";
import React, { use } from "react";
import { FaArrowLeft } from "react-icons/fa";

function DirectoryDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();

  // Find the item in msa_directory by id
  let item = null;
  for (const category of msa_directory) {
    const foundItem = category.items.find((i) => i.id.toString() === id);
    if (foundItem) {
      item = foundItem;
      break;
    }
  }

  return (
    <>
      <div className="bg-white px-2 flex py-4 items-center justify-between">
        <FaArrowLeft
          className="cursor-pointer text-xl  "
          onClick={() => router.back()}
        />
        <h2 className="flex-1 text-center font-bold text-2xl">{item.name}</h2>
        <div className="w-4"></div>
      </div>

      <section
        className="min-h-[40vh] flex items-center"
        style={{
          backgroundImage: `url(${item.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="px-3 text-white">
          <div className="max-w-2xl my-auto p-4">
            <h1 className="text-5xl font-bold mb-4">{item.name}</h1>
            <p className="mb-4">{item.subtitle}</p>
          </div>
        </div>
      </section>

      <section>
        <div>
          <div className="mb-3 px-4 py-6">
            <div className="mb-3 flex justify-between items-center border-b border-gray-300 pb-3">
              <h6 className="text-xl font-semibold">Description</h6>
            </div>
            <p>{item.description}</p>
          </div>
        </div>
      </section>
    </>
  );
}

export default DirectoryDetail;
