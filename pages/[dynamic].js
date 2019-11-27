import React from "react";
import { useRouter } from "next/router";

const Dynamic = () => {
  const router = useRouter();
  const { dynamic } = router.query;

  return <div>My dynamic page slug: {dynamic}</div>;
};

export default Dynamic;
