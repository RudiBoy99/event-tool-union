"use client"

import { format } from "date-fns"
import { de } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface DateTimeInputProps {
  date: Date | undefined
  onDateChange: (d: Date | undefined) => void
  time: string
  onTimeChange: (t: string) => void
  locale?: 'de' | 'en'
  dateLabel: string
  timeLabel: string
  pickDateLabel: string
}

export function DateTimeInput({
  date,
  onDateChange,
  time,
  onTimeChange,
  locale = 'de',
  dateLabel,
  timeLabel,
  pickDateLabel,
}: DateTimeInputProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {/* Date */}
      <div className="flex flex-col gap-1.5">
        <label className="label-caps">{dateLabel}</label>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "flex items-center gap-2 w-full h-10 px-3 text-sm text-left rounded-md border border-white/10 bg-white/[0.04] text-white hover:border-white/20 hover:bg-white/[0.06] transition-colors",
                !date && "text-white/50"
              )}
            >
              <CalendarIcon className="h-4 w-4 text-[var(--color-brand)]" />
              {date
                ? format(date, "PPP", { locale: locale === 'de' ? de : undefined })
                : pickDateLabel}
            </button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto">
            <Calendar
              mode="single"
              selected={date}
              onSelect={onDateChange}
              locale={locale === 'de' ? de : undefined}
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Time */}
      <div className="flex flex-col gap-1.5">
        <label className="label-caps">{timeLabel}</label>
        <div className="relative">
          <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-brand)] pointer-events-none" />
          <Input
            type="time"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
            step="300"
            className="h-10 pl-9 bg-white/[0.04] border-white/10 text-white [color-scheme:dark]"
          />
        </div>
      </div>
    </div>
  )
}
