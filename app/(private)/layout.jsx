"use client";

import Navbar from "@/components/private/Navbar";
import React from "react";

function PrivateLayout({ children }) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

export default PrivateLayout;
