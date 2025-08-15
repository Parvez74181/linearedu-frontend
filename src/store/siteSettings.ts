import { siteSetting } from "@/types";
import { create } from "zustand";

type SiteSettingsStore = {
  settings: siteSetting;
  updateSettings: (newSettings: Partial<siteSetting>) => void;
};

const initialSettings: siteSetting = {
  phone: "",
  address: "",
  email: "",
  fb_page: "",
  fb_group: "",
  twitter: "",
  instagram: "",
  whatsapp: "",
};

export const useSiteSettings = create<SiteSettingsStore>((set) => ({
  settings: initialSettings,

  // Update settings (merges with existing)
  updateSettings: (newSettings) =>
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    })),
}));
