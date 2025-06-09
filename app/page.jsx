import Navbar from "@/components/landing/Navbar";
import Image from "next/image";
import React from "react";

function LandingPage() {
  return (
    <>
    <Navbar />
      <div className="container mx-auto p-4">
        {/* top section */}
        <div className="bg-white shadow w-full">
          <Image src="/logo.png" alt="hero" width={100} height={100} />
        </div>
      </div>
    </>
  );
}

export default LandingPage;
