"use client";
import { apiActions } from "@/tools/api";

export const createQuestion = async (values, axios) => {
  await apiActions?.post("/api/v1/questions/", values, axios);
};
