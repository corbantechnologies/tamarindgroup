"use client";

import LoadingSpinner from "@/components/general/LoadingSpinner";
import { useFetchApprovalStep } from "@/hooks/approvalsteps/actions";
import React, { use } from "react";

function ApprovalStepDetail({ params }) {
  const { reference } = use(params);

  const {
    isLoading: isLoadingStep,
    data: step,
    refetch: refetchStep,
  } = useFetchApprovalStep(reference);

  if (isLoadingStep) {
    return <LoadingSpinner />;
  }

  return <div>{reference}</div>;
}

export default ApprovalStepDetail;
