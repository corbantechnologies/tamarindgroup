"use client"

import { apiActions } from "@/tools/api";

export const makePayment = async (values) => {
    await apiActions?.post(`/api/v1/payments/pay/`, values);
}