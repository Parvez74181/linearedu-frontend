"use client";

import useThemeStore from "@/store/themeStore";
import { Switch, SwitchProps, useSwitch, VisuallyHidden } from "@heroui/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitch = (props: SwitchProps) => {
  const { Component, slots, isSelected, getBaseProps, getInputProps, getWrapperProps } = useSwitch(props);

  return (
    <div className="flex flex-col gap-2">
      <Component {...getBaseProps()}>
        <VisuallyHidden>
          <input {...getInputProps()} />
        </VisuallyHidden>
        <div
          {...getWrapperProps()}
          className={slots.wrapper({
            class: [
              "w-8 h-8",
              "flex items-center justify-center",
              "rounded-full border !bg-transparent border-default-400 hover:!bg-default-200",
            ],
          })}
        >
          {isSelected ? <SunIcon className="p-0.5" /> : <MoonIcon className="p-0.5" />}
        </div>
      </Component>
    </div>
  );
};
export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [isSelected, setIsSelected] = useState(theme === "dark");

  useEffect(() => {
    setMounted(true);
    setIsSelected(theme === "dark");
  }, [theme]);

  if (!mounted) return null;

  const handleThemeSwitch = (selected: boolean) => {
    setIsSelected(selected);
    setTheme(selected ? "dark" : "light");
    useThemeStore.getState().setTheme(selected ? "dark" : "light");
  };

  return (
    <div className="flex items-center gap-2">
      <ThemeSwitch
        isSelected={isSelected}
        onValueChange={handleThemeSwitch}
        color="default"
        size="sm"
        thumbIcon={({ className }) =>
          isSelected ? <MoonIcon className={className} /> : <SunIcon className={className} />
        }
      ></ThemeSwitch>
    </div>
  );
}
