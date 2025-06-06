"use client";

import React, { use } from "react";

function CenterDetail({ params }) {
  const {center_identity} = use(params);

  console.log(center_identity);

  return <div>CenterDetail</div>;
}

export default CenterDetail;
