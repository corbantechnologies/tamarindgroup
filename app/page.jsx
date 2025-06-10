import Navbar from "@/components/landing/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function LandingPage() {
  return (
    <>
      <Navbar />
      <section
        className="relative min-h-[80vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/dhow.jpg')" }}
      >
        <div className="container mx-auto px-4 text-center text-white">
          <div className="max-w-2xl mx-auto bg-black/50 p-8 rounded-md">
            <h1 className="text-5xl font-bold mb-4">The Tamarind Group</h1>
            <p className="mb-4">
              Experience Kenya’s best restaurants with Tamarind Group. Enjoy
              flame-grilled meats at Carnivore restaurant and top seafood in
              Tamarind Mombasa. Every meal is a culinary adventure. Craving a
              lively grill, seafood feast, or refined bar experience?
            </p>
            <div className="mt-3">
              <Link href={"/"} className="secondary-button p-3 font-bold">
                Directory →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default LandingPage;
