"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock } from "lucide-react"

export interface TimePickerProps {
  value: string // format: "HH:MM"
  onChange: (value: string) => void
  disabled?: boolean
}

const HOURS = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, "0"))
const MINUTES = ["00", "15", "30", "45"]

export function TimePicker({ value, onChange, disabled }: TimePickerProps) {
  const [h, m] = value ? value.split(":") : ["", ""]

  const setHour = (newH: string) => {
    onChange(`${newH}:${m || "00"}`)
  }

  const setMinute = (newM: string) => {
    onChange(`${h || "12"}:${newM}`)
  }

  return (
    <div className="flex items-center gap-2 w-full">
      <Clock className="h-4 w-4 text-[var(--color-brand)] shrink-0" />

      <Select value={h} onValueChange={setHour} disabled={disabled}>
        <SelectTrigger className="h-11 w-[86px] bg-white/[0.04] border-white/10 text-white text-sm [&>span]:text-white">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent className="bg-[#141414] border-white/10 text-white max-h-[240px]">
          {HOURS.map((hour) => (
            <SelectItem key={hour} value={hour} className="text-white focus:bg-white/10 focus:text-white">
              {hour}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-white/60 font-bold">:</span>

      <Select value={m} onValueChange={setMinute} disabled={disabled}>
        <SelectTrigger className="h-11 w-[86px] bg-white/[0.04] border-white/10 text-white text-sm [&>span]:text-white">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent className="bg-[#141414] border-white/10 text-white">
          {MINUTES.map((minute) => (
            <SelectItem key={minute} value={minute} className="text-white focus:bg-white/10 focus:text-white">
              {minute}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
