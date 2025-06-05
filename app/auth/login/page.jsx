"use client";

import { signIn, getSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import Image from "next/image";

function Login() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });
    const session = await getSession();

    setLoading(false);
    if (response?.error) {
      toast?.error("Invalid email or password");
    } else {
      toast?.success("Login successful! Redirecting...");
      if (session?.user?.is_admin === true) {
        router.push("/admin/dashboard");
      } else {
        router.push("/");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow ">
        <Image
          className="mx-auto"
          src="/logo.png"
          alt="Tamarind Logo"
          width={100}
          height={100}
        />
        <h2 className="mb-6 text-2xl font-bold ">Sign in to our platform</h2>
      </div>
    </div>
  );
}

export default Login;
