export function SuccessIllustration({ className }: { className?: string }) {
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
      {/* Main circle */}
      <circle cx="60" cy="60" r="36" />
      {/* Checkmark */}
      <polyline points="42,60 54,73 78,46" strokeWidth="2.5" />
      {/* Star accents */}
      <line x1="12" y1="20" x2="12" y2="28" />
      <line x1="8" y1="24" x2="16" y2="24" />
      <line x1="108" y1="14" x2="108" y2="22" />
      <line x1="104" y1="18" x2="112" y2="18" />
      <line x1="18" y1="95" x2="18" y2="101" />
      <line x1="15" y1="98" x2="21" y2="98" />
      <line x1="102" y1="90" x2="102" y2="96" />
      <line x1="99" y1="93" x2="105" y2="93" />
      {/* Dots */}
      <circle cx="22" cy="38" r="2" fill="currentColor" stroke="none" />
      <circle cx="98" cy="78" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}
