import { create } from "zustand";

interface ThemeState {
  theme: any;
  setTheme: (theme: any) => void;
}

const useThemeStore = create<ThemeState>((set) => ({
  theme: null,
  setTheme: (theme) => set({ theme }),
}));

export default useThemeStore;
