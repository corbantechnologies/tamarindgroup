import Navbar from "@/components/landing/Navbar";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function LandingPage() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto p-4">
        {/* top section */}
        <section className="grid sm:grid-cols-2 gap-4 px-4 py-18 items-center">
          <div>
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

          <div>
            <Image
              src="/dhow.jpg"
              alt="hero"
              width={600}
              height={600}
              className="w-full rounded-md"
            />
          </div>
        </section>
      </div>
    </>
  );
}

export default LandingPage;
