"use client"

import { motion } from "framer-motion"

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }))

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg
        className="w-full h-full"
        viewBox="0 0 696 316"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <title>Union Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="#FF6B1A"
            strokeWidth={path.width}
            strokeOpacity={0.08 + path.id * 0.012}
            initial={{ pathLength: 0.3, opacity: 0.5 }}
            animate={{
              pathLength: 1,
              opacity: [0.25, 0.55, 0.25],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 22 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

interface BackgroundPathsProps {
  intensity?: "full" | "muted"
}

export function BackgroundPaths({ intensity = "full" }: BackgroundPathsProps) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{ opacity: intensity === "muted" ? 0.55 : 1 }}
    >
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />
      {/* Orange radial glow, top-right */}
      <div
        className="absolute -top-[20%] -right-[10%] w-[55%] h-[85%] pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,107,26,0.28) 0%, transparent 65%)" }}
      />
    </div>
  )
}
