// stores/userStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UserState {
  user: any;
  isAuthenticated: boolean;
  setUser: (user: any) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      setUser: (user) =>
        set(() => ({
          user,
          isAuthenticated: Boolean(user?.id),
        })),

      clearUser: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "user-store",
      storage: createJSONStorage(() => localStorage),

      version: 1,
    }
  )
);
