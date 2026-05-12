"use client"

import { useEffect, useState } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TimePickerProps {
  value: string // "HH:MM"
  onChange: (value: string) => void
  disabled?: boolean
}

// Allowed minute increments — keep the event-planning step's 15-min cadence.
const MINUTE_STEPS = [0, 15, 30, 45] as const
type MinuteStep = typeof MINUTE_STEPS[number]

// Clock geometry
const SIZE = 280
const CX = SIZE / 2
const CY = SIZE / 2
const R_OUTER = 116         // 1–12 ring
const R_INNER = 80          // 13–00 ring (24-hour)
const R_MINUTE = 108        // minute ring
const R_HIT = 19            // hit-target radius

function pad(n: number) {
  return String(n).padStart(2, "0")
}

/** Position on a clock face — i = 1..12, angle measured from 12 o'clock clockwise. */
function pos(i: number, r: number): { x: number; y: number } {
  const angleRad = (((i % 12) * 30) * Math.PI) / 180
  return {
    x: CX + r * Math.sin(angleRad),
    y: CY - r * Math.cos(angleRad),
  }
}

export function TimePicker({ value, onChange, disabled }: TimePickerProps) {
  const [open, setOpen] = useState(false)
  const [phase, setPhase] = useState<"hour" | "minute">("hour")

  const [hStr, mStr] = value ? value.split(":") : ["", ""]
  const hour = hStr === "" ? null : Number(hStr)
  const minute = mStr === "" ? null : Number(mStr)

  // Reset phase to "hour" whenever the popover re-opens.
  useEffect(() => {
    if (open) setPhase("hour")
  }, [open])

  const pickHour = (h: number) => {
    const newMinute: MinuteStep = (minute != null
      ? (MINUTE_STEPS.find((step) => step === minute) ?? 0)
      : 0) as MinuteStep
    onChange(`${pad(h)}:${pad(newMinute)}`)
    setPhase("minute")
  }

  const pickMinute = (m: MinuteStep) => {
    const h = hour ?? 12
    onChange(`${pad(h)}:${pad(m)}`)
    setOpen(false)
  }

  const displayValue = value && hStr && mStr ? `${hStr}:${mStr}` : null

  return (
    <Popover open={open} onOpenChange={(next) => !disabled && setOpen(next)}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            "h-11 px-3.5 inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.04] text-white text-sm",
            "hover:border-white/20 hover:bg-white/[0.06] transition-colors",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            !displayValue && "text-white/50",
          )}
        >
          <Clock className="h-4 w-4 text-[var(--color-brand)] shrink-0" />
          <span
            className="tabular-nums tracking-wider"
            style={{ fontFamily: "Söhne Breit, Archivo Black, sans-serif", fontWeight: 900 }}
          >
            {displayValue ?? "HH:MM"}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="p-0 border-white/10 bg-[#0e0e10] overflow-hidden"
        style={{ width: SIZE + 32 }}
      >
        {/* Header: phase-toggle digital display */}
        <div className="flex items-center justify-center gap-1 px-4 pt-4 pb-3 select-none">
          <button
            type="button"
            onClick={() => setPhase("hour")}
            className={cn(
              "min-w-[56px] py-1 rounded text-3xl tabular-nums leading-none transition-colors",
              phase === "hour"
                ? "text-[var(--color-brand)]"
                : "text-white/60 hover:text-white",
            )}
            style={{ fontFamily: "Söhne Breit, Archivo Black, sans-serif", fontWeight: 900 }}
          >
            {hour != null ? pad(hour) : "--"}
          </button>
          <span className="text-3xl text-white/40 leading-none -mt-1">:</span>
          <button
            type="button"
            onClick={() => setPhase("minute")}
            disabled={hour == null}
            className={cn(
              "min-w-[56px] py-1 rounded text-3xl tabular-nums leading-none transition-colors disabled:opacity-30",
              phase === "minute"
                ? "text-[var(--color-brand)]"
                : "text-white/60 hover:text-white disabled:hover:text-white/60",
            )}
            style={{ fontFamily: "Söhne Breit, Archivo Black, sans-serif", fontWeight: 900 }}
          >
            {minute != null ? pad(minute) : "--"}
          </button>
        </div>

        {/* Clock face */}
        <div className="flex justify-center pb-4">
          <svg
            width={SIZE}
            height={SIZE}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            role="application"
            aria-label={phase === "hour" ? "Stunde wählen" : "Minute wählen"}
          >
            {/* Clock-face circle */}
            <circle
              cx={CX}
              cy={CY}
              r={SIZE / 2 - 6}
              fill="rgba(255,255,255,0.02)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
            />

            {/* Connector line + selection dot (visual "clock hand") */}
            {phase === "hour" && hour != null && <HourHand hour={hour} />}
            {phase === "minute" && minute != null && <MinuteHand minute={minute} />}

            {/* HOUR phase: 1–12 outer, 13–00 inner */}
            {phase === "hour" && (
              <>
                {Array.from({ length: 12 }, (_, idx) => idx + 1).map((i) => {
                  const outerHour = i === 12 ? 12 : i
                  const innerHour = i === 12 ? 0 : i + 12
                  const o = pos(i, R_OUTER)
                  const inn = pos(i, R_INNER)
                  return (
                    <g key={i}>
                      <HourButton x={o.x} y={o.y} value={outerHour} selected={hour === outerHour} onSelect={pickHour} large />
                      <HourButton x={inn.x} y={inn.y} value={innerHour} selected={hour === innerHour} onSelect={pickHour} />
                    </g>
                  )
                })}
              </>
            )}

            {/* MINUTE phase: 4 positions at 12/3/6/9 */}
            {phase === "minute" && (
              <>
                {([0, 15, 30, 45] as MinuteStep[]).map((m) => {
                  const i = m === 0 ? 12 : m === 15 ? 3 : m === 30 ? 6 : 9
                  const p = pos(i, R_MINUTE)
                  return (
                    <MinuteButton
                      key={m}
                      x={p.x}
                      y={p.y}
                      value={m}
                      selected={minute === m}
                      onSelect={pickMinute}
                    />
                  )
                })}
                {/* Hint label */}
                <text
                  x={CX}
                  y={CY + 6}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.35)"
                  fontSize={11}
                  letterSpacing={2}
                  style={{ fontFamily: "Söhne Breit, Archivo Black, sans-serif", fontWeight: 900 }}
                >
                  MINUTEN
                </text>
              </>
            )}

            {/* Center dot */}
            <circle cx={CX} cy={CY} r={3} fill="var(--color-brand)" />
          </svg>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-4 py-2.5">
          <button
            type="button"
            onClick={() => {
              const now = new Date()
              const h = now.getHours()
              const rawM = now.getMinutes()
              const snapped = (Math.round(rawM / 15) * 15) % 60 as MinuteStep
              const carryHour = rawM >= 53 ? (h + 1) % 24 : h
              onChange(`${pad(carryHour)}:${pad(snapped)}`)
              setPhase("minute")
            }}
            className="text-[10px] font-bold uppercase tracking-[0.12em] text-white/60 hover:text-white transition-colors"
            style={{ fontFamily: "Söhne Breit, Archivo Black, sans-serif" }}
          >
            Jetzt
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            disabled={!displayValue}
            className="text-[10px] font-black uppercase tracking-[0.12em] text-[var(--color-brand)] hover:brightness-125 disabled:opacity-30 transition-all"
            style={{ fontFamily: "Söhne Breit, Archivo Black, sans-serif" }}
          >
            Fertig
          </button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

function HourButton({
  x,
  y,
  value,
  selected,
  onSelect,
  large = false,
}: {
  x: number
  y: number
  value: number
  selected: boolean
  onSelect: (h: number) => void
  large?: boolean
}) {
  const fontSize = large ? 16 : 12
  return (
    <g
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(value)}
      role="button"
      aria-label={`${pad(value)} Uhr`}
    >
      <circle
        cx={x}
        cy={y}
        r={R_HIT}
        fill={selected ? "var(--color-brand)" : "transparent"}
        className="transition-colors"
      />
      {/* Hover hit (invisible but bigger) */}
      <circle cx={x} cy={y} r={R_HIT + 2} fill="rgba(255,255,255,0.001)" />
      <text
        x={x}
        y={y + fontSize / 3}
        textAnchor="middle"
        fill={selected ? "#000" : large ? "#fff" : "rgba(255,255,255,0.55)"}
        fontSize={fontSize}
        style={{
          fontFamily: "Söhne Breit, Archivo Black, sans-serif",
          fontWeight: 900,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {pad(value)}
      </text>
    </g>
  )
}

function MinuteButton({
  x,
  y,
  value,
  selected,
  onSelect,
}: {
  x: number
  y: number
  value: MinuteStep
  selected: boolean
  onSelect: (m: MinuteStep) => void
}) {
  return (
    <g
      style={{ cursor: "pointer" }}
      onClick={() => onSelect(value)}
      role="button"
      aria-label={`${pad(value)} Minuten`}
    >
      <circle
        cx={x}
        cy={y}
        r={26}
        fill={selected ? "var(--color-brand)" : "rgba(255,255,255,0.05)"}
        stroke={selected ? "transparent" : "rgba(255,255,255,0.15)"}
        strokeWidth={1}
        className="transition-colors"
      />
      <text
        x={x}
        y={y + 7}
        textAnchor="middle"
        fill={selected ? "#000" : "#fff"}
        fontSize={20}
        style={{
          fontFamily: "Söhne Breit, Archivo Black, sans-serif",
          fontWeight: 900,
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        {pad(value)}
      </text>
    </g>
  )
}

function HourHand({ hour }: { hour: number }) {
  const isInner = hour === 0 || (hour >= 13 && hour <= 23)
  const i = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
  const p = pos(i, isInner ? R_INNER : R_OUTER)
  return (
    <line
      x1={CX}
      y1={CY}
      x2={p.x}
      y2={p.y}
      stroke="var(--color-brand)"
      strokeWidth={2}
      strokeLinecap="round"
      opacity={0.55}
    />
  )
}

function MinuteHand({ minute }: { minute: number }) {
  const i = minute === 0 ? 12 : minute === 15 ? 3 : minute === 30 ? 6 : 9
  const p = pos(i, R_MINUTE)
  return (
    <line
      x1={CX}
      y1={CY}
      x2={p.x}
      y2={p.y}
      stroke="var(--color-brand)"
      strokeWidth={2}
      strokeLinecap="round"
      opacity={0.55}
    />
  )
}
