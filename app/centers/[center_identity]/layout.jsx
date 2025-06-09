"use client";

import Navbar from "@/components/centers/Navbar";
import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchCenter } from "@/hooks/centers/actions";
import React, { use } from "react";

function CenterLayout({ children, params }) {
  const { center_identity } = use(params);

  const { isLoading: isLoadingCenter, data: center } =
    useFetchCenter(center_identity);

  if (isLoadingCenter) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <Navbar center={center} />
      <div className="container mx-auto p-4">{children}</div>
    </div>
  );
}

export default CenterLayout;
