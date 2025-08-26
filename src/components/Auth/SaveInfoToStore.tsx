"use client";

import { getSession } from "@/actions";
import { useUserStore } from "@/store/userStore";
import { useEffect } from "react";

const SaveInfoToStore = () => {
  const fetchSession = async () => {
    const session = await getSession();

    if (session.success) {
      useUserStore.getState().setUser(session as any);
    } else {
      useUserStore.getState().clearUser();
    }
  };
  useEffect(() => {
    fetchSession();
  }, []);

  return <></>;
};

export default SaveInfoToStore;
