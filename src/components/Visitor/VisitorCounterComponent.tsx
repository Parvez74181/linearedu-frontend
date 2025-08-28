"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

const VisitorCounterComponent = () => {
  const pathname = usePathname();
  const setCounter = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_V1}/visitor/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  useEffect(() => {
    if (!pathname.startsWith("/dashboard")) {
      setCounter();
    }
  }, []);

  return <></>;
};

export default VisitorCounterComponent;
