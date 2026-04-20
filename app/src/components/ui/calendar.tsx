"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-white", className)}
      classNames={{
        root: "p-3 text-white",
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3",
        month_caption: "flex items-center justify-center relative h-8 mb-2",
        caption_label: "text-sm font-semibold text-white",
        nav: "absolute inset-x-0 flex items-center justify-between px-1 pointer-events-none",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 p-0 bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white pointer-events-auto",
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 p-0 bg-transparent border-white/20 text-white/70 hover:bg-white/10 hover:text-white pointer-events-auto",
        ),
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 h-8 flex items-center justify-center text-[0.65rem] font-medium text-white/40 uppercase tracking-wider",
        week: "flex w-full mt-1",
        day: "w-9 h-9 text-center text-sm p-0 relative",
        day_button: cn(
          "w-9 h-9 rounded-md font-normal text-white/90 hover:bg-white/10 transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/50",
        ),
        selected: "[&>button]:bg-[var(--color-brand)] [&>button]:text-black [&>button]:font-bold [&>button]:hover:bg-[var(--color-brand)]",
        today: "[&>button]:text-[var(--color-brand)] [&>button]:font-bold",
        outside: "[&>button]:text-white/30",
        disabled: "[&>button]:text-white/20 [&>button]:line-through",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
