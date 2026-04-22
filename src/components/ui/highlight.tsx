import * as React from "react"
import { cn } from "@/lib/utils"

type HighlightProps = {
  children: React.ReactNode
  variant?: "solid" | "gradient"
  underline?: boolean
  pulse?: boolean
  className?: string
}

export function Highlight({
  children,
  variant = "gradient",
  underline = false,
  pulse = false,
  className,
}: HighlightProps) {
  const style = cn(
    variant === "gradient" ? "emphasis-gradient" : "emphasis",
    underline ? "emphasis-underline" : "",
    pulse ? "animate-pulse" : "",
    "inline-block align-baseline select-none",
    className
  )
  return <span className={style}>{children}</span>
}
