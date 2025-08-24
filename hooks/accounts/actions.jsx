"use client";
import { useQuery } from "@tanstack/react-query";
import useAxiosAuth from "@/hooks/general/useAxiosAuth";
import useUserId from "@/hooks/general/useUserId";
import { getUser, getUsers } from "@/services/accounts";

export function useFetchAccount() {
  const userId = useUserId();
  const axios = useAxiosAuth();

  return useQuery({
    queryKey: ["account", userId],
    queryFn: () => getUser(userId, axios),
    enabled: !!userId,
  });
}

export function useFetchUsers() {
  const axios = useAxiosAuth();

  return useQuery({
    queryKey: ["users"],
    queryFn: () => getUsers(axios),
  });
}
