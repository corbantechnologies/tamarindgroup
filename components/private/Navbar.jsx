"use client";

import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";

function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sticky top-0 z-50 p-3 bg-white shadow">
      <div className="flex justify-between items-center">
        <Link href="/admin/dashboard">
          <Image src="/logo.png" width={80} height={80} alt="logo" />
        </Link>

        {/* Hamburger Menu */}
        <button
          className="md:hidden flex items-center"
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="w-6 h-6 text-gray-700"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        <div
          className={`${
            isOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row gap-4 absolute md:static top-16 left-0 w-full md:w-auto bg-white p-3 md:p-0 z-40`}
        >
          <ul className="flex flex-col md:flex-row md:items-center gap-4">
            <li
              className={`${
                pathname === "/admin/dashboard"
                  ? "text-[var(--mainRed)]"
                  : "text-[var(--mainBlue)]"
              } hover:text-[var(--mainBlue)] transition-colors`}
            >
              <Link href="/admin/dashboard" onClick={() => setIsOpen(false)}>
                Dashboard
              </Link>
            </li>

            {/* <li
              className={`${
                pathname === "/admin/centers"
                  ? "text-[var(--mainRed)]"
                  : "text-[var(--mainBlue)]"
              } hover:text-[var(--mainBlue)] transition-colors`}
            >
              <Link href="/admin/centers" onClick={() => setIsOpen(false)}>
                Centers
              </Link>
            </li> */}

            <li
              className={`${
                pathname === "/admin/events"
                  ? "text-[var(--mainRed)]"
                  : "text-[var(--mainBlue)]"
              } hover:text-[var(--mainBlue)] transition-colors`}
            >
              <Link href="/admin/events" onClick={() => setIsOpen(false)}>
                Events
              </Link>
            </li>

            <li>
              <button
                onClick={() => signOut()}
                className="primary-button px-2 py-1 rounded text-center leading-[1.5rem]"
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
