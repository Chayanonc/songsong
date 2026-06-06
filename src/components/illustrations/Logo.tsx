import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  iconClassName?: string
  textClassName?: string
  variant?: "full" | "icon"
}

export function Logo({
  className,
  iconClassName,
  textClassName,
  variant = "full",
}: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <LogoMark className={iconClassName} />
      {variant === "full" && (
        <span
          className={cn(
            "font-semibold text-xl leading-none tracking-tight",
            textClassName,
          )}
        >
          SongSong
        </span>
      )}
    </div>
  )
}

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Note 1 head */}
      <ellipse cx="15" cy="50" rx="11" ry="7" transform="rotate(-20 15 50)" />
      {/* Note 1 stem */}
      <line x1="24" y1="47" x2="24" y2="18" />
      {/* Note 2 head */}
      <ellipse cx="40" cy="44" rx="11" ry="7" transform="rotate(-20 40 44)" />
      {/* Note 2 stem */}
      <line x1="49" y1="41" x2="49" y2="12" />
      {/* Beam */}
      <line x1="24" y1="18" x2="49" y2="12" />
      {/* Decorative dots */}
      <circle cx="57" cy="22" r="2" fill="currentColor" stroke="none" />
      <circle cx="60" cy="33" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="7" cy="28" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
