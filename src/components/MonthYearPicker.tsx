"use client";

import { useEffect, useState } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
type Props = {
  title?: string;
  hideDescription?: boolean;
};
export default function MonthYearPicker({ title, hideDescription }: Props) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [viewYear, setViewYear] = useState(currentYear);

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const yearMonth = searchParams.get("yearMonth");

    if (yearMonth && !selectedYear && !selectedMonth) {
      setSelectedYear(yearMonth.split("-")[0] as any);
      setSelectedMonth((+yearMonth.split("-")[1] - 1) as any);
    }
  }, [searchParams]);

  const handleMonthSelect = (monthIndex: number) => {
    setSelectedMonth(monthIndex);
    setSelectedYear(viewYear);
    if (searchParams.get("yearMonth") === viewYear + "-" + (monthIndex + 1).toString().padStart(2, "0")) {
      return;
    }
    const params = new URLSearchParams(searchParams);
    params.set("yearMonth", viewYear + "-" + (monthIndex + 1).toString().padStart(2, "0"));
    // Construct the new URL with all active filters
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false });
  };

  const getDisplayValue = () => {
    if (selectedMonth !== null && selectedYear !== null) {
      const monthStr = (selectedMonth + 1).toString().padStart(2, "0");
      return `${selectedYear}-${monthStr}`;
    }
    return "";
  };

  const getDisplayText = () => {
    if (selectedMonth !== null && selectedYear !== null) {
      return `${monthNames[selectedMonth]} ${selectedYear}`;
    }
    return "Select month and year";
  };

  const handleClear = () => {
    setSelectedMonth(null);
    setSelectedYear(null);
    setIsOpen(false);

    const params = new URLSearchParams(searchParams);
    params.delete("yearMonth");
    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl, { scroll: false }); // Optional: prevent scroll reset
  };

  const handlePrevYear = () => {
    setViewYear((prev) => prev - 1);
  };

  const handleNextYear = () => {
    setViewYear((prev) => prev + 1);
  };

  return (
    <div className="w-full md:w-xs space-y-2">
      <label className="text-sm pb-5">{title || "Select Year and Month"}</label>

      <Popover isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
        <PopoverTrigger>
          <div>
            <div className="relative">
              <input
                type="text"
                readOnly
                value={getDisplayValue()}
                placeholder="YYYY-MM"
                className="flex h-10 w-full rounded-lg border-2 border-default-400 bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer "
              />
              <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            </div>
            {!hideDescription && <p className="text-tiny text-foreground-400 p-1"> Filter based on month and year</p>}
          </div>
        </PopoverTrigger>

        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            {/* Year Navigation */}
            <div className="flex items-center justify-between">
              <Button radius="sm" variant="bordered" onPress={handlePrevYear} className="h-8 w-8 bg-transparent">
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="text-lg font-semibold">{viewYear}</div>

              <Button radius="sm" variant="bordered" onPress={handleNextYear} className="h-8 w-8 bg-transparent">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Month Grid */}
            <div className="grid grid-cols-3 gap-2">
              {months.map((month, index) => {
                const isSelected = selectedMonth === index && selectedYear === viewYear;
                const isCurrent = index === currentMonth && viewYear === currentYear;

                return (
                  <Button
                    key={month}
                    variant="bordered"
                    radius="sm"
                    onPress={() => {
                      handleMonthSelect(index);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "h-10 text-sm",
                      isCurrent && !isSelected && "border-primary",
                      isSelected && "bg-primary text-primary-foreground"
                    )}
                  >
                    {month}
                  </Button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex justify-between pt-2">
              <Button radius="sm" onPress={handleClear}>
                Clear
              </Button>
              <div className="text-sm text-muted-foreground">{getDisplayText()}</div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
