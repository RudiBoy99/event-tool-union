"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker, useDayPicker } from "react-day-picker"
import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function CustomMonthCaption({ calendarMonth }: { calendarMonth: { date: Date } }) {
  const { goToMonth, nextMonth, previousMonth, formatters } = useDayPicker()
  const label =
    formatters?.formatCaption?.(calendarMonth.date, { locale: undefined }) ??
    calendarMonth.date.toLocaleDateString(undefined, { month: "long", year: "numeric" })

  const navBtn =
    "h-7 w-7 p-0 inline-flex items-center justify-center rounded-md border border-white/20 text-white/70 bg-transparent hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"

  return (
    <div className="flex items-center justify-center gap-3 h-8 mb-2">
      <button
        type="button"
        onClick={() => previousMonth && goToMonth(previousMonth)}
        disabled={!previousMonth}
        className={navBtn}
        aria-label="Vorheriger Monat"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      <span className="text-sm font-semibold text-white min-w-[8ch] text-center">{label}</span>
      <button
        type="button"
        onClick={() => nextMonth && goToMonth(nextMonth)}
        disabled={!nextMonth}
        className={navBtn}
        aria-label="Nächster Monat"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  )
}

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 text-white", className)}
      classNames={{
        root: "p-3 text-white",
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-3",
        nav: "hidden",
        month_grid: "w-full border-collapse",
        weekdays: "flex",
        weekday: "w-9 h-8 flex items-center justify-center text-[0.65rem] font-medium text-white/40 uppercase tracking-wider",
        week: "flex w-full mt-1",
        day: "w-9 h-9 text-center text-sm p-0 relative",
        day_button: cn(
          "w-9 h-9 rounded-md font-normal text-white/90 hover:bg-white/10 transition-colors",
          "focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]/50",
        ),
        selected:
          "[&>button]:bg-[var(--color-brand)] [&>button]:text-black [&>button]:font-bold [&>button]:hover:bg-[var(--color-brand)]",
        today: "[&>button]:text-[var(--color-brand)] [&>button]:font-bold",
        outside: "[&>button]:text-white/30",
        disabled: "[&>button]:text-white/20 [&>button]:line-through",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        MonthCaption: CustomMonthCaption,
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
