"use client";

import { Autocomplete, AutocompleteItem, Select } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Key, useEffect, useState } from "react";

const YearPicker = ({ hideDescription }: { hideDescription?: boolean }) => {
  const [value, setValue] = useState<Key | null>("");
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => ({
    key: `${currentYear - i}`,
    label: `${currentYear - i}`,
  }));

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const year = searchParams.get("year");

    if (year && !value) {
      setValue(year);
    }
  }, [searchParams]);

  useEffect(() => {
    if (value && searchParams.get("year") !== value) {
      const params = new URLSearchParams(searchParams);
      params.set("year", value as string);
      // Construct the new URL with all active filters
      const newUrl = `${pathname}?${params.toString()}`;
      router.push(newUrl, { scroll: false });
    }
  }, [value]);

  return (
    <>
      <Autocomplete
        classNames={{
          base: "*:*:*:border-default-300",
        }}
        className="w-full md:max-w-xs border-default-300"
        variant="bordered"
        selectedKey={value as string}
        onSelectionChange={(e) => setValue(e as any)}
        defaultItems={years}
        label="Choose Year"
        labelPlacement="outside"
        placeholder="Choose Year"
        radius="sm"
        description={!hideDescription && "Filter based on year"}
      >
        {(years) => <AutocompleteItem key={years.key}>{years.label}</AutocompleteItem>}
      </Autocomplete>
    </>
  );
};

export default YearPicker;
