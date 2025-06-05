"use client";

import { useSession } from "next-auth/react";

function useAxiosAuth() {
  const { data: session } = useSession();

  const tokens = session?.user?.token;

  const authenticationHeader = {
    headers: {
      Authorization: "Token " + tokens,
      "Content-Type": "multipart/form-data",
    },
  };

  return authenticationHeader;
}

export default useAxiosAuth;
