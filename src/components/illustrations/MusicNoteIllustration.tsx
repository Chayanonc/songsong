export function MusicNoteIllustration({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Note stem */}
      <line x1="55" y1="25" x2="55" y2="80" />
      {/* Note head */}
      <ellipse cx="46" cy="82" rx="12" ry="8" transform="rotate(-15 46 82)" />
      {/* Flag */}
      <path d="M55 25 Q85 35 75 55" />
      {/* Second note */}
      <line x1="80" y1="15" x2="80" y2="70" />
      <ellipse cx="71" cy="72" rx="12" ry="8" transform="rotate(-15 71 72)" />
      {/* Connector beam */}
      <line x1="55" y1="25" x2="80" y2="15" />
      {/* Floating dashes */}
      <line x1="92" y1="30" x2="100" y2="30" />
      <line x1="95" y1="40" x2="105" y2="40" />
      <line x1="90" y1="50" x2="98" y2="50" />
      {/* Dots */}
      <circle cx="22" cy="45" r="2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="60" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="26" cy="72" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}
