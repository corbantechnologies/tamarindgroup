"use client";
import { msa_directory } from "@/data/directory-msa";
import React, { use } from "react";

function DirectoryDetail({ params }) {
  const { id } = use(params);

  // Find the item in msa_directory by id
  let item = null;
  for (const category of msa_directory) {
    const foundItem = category.items.find((i) => i.id.toString() === id);
    if (foundItem) {
      item = foundItem;
      break;
    }
  }

  console.log(item);

  return <div>DirectoryDetail</div>;
}

export default DirectoryDetail;
