export function MicrophoneIllustration({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 180"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Microphone body */}
      <rect x="42" y="10" width="36" height="70" rx="18" />
      {/* Stand arc */}
      <path d="M24 80 Q24 110 60 110 Q96 110 96 80" />
      {/* Stand pole */}
      <line x1="60" y1="110" x2="60" y2="155" />
      {/* Base */}
      <line x1="36" y1="155" x2="84" y2="155" />
      {/* Mic grille lines */}
      <line x1="42" y1="38" x2="78" y2="38" />
      <line x1="42" y1="52" x2="78" y2="52" />
      <line x1="42" y1="66" x2="78" y2="66" />
      {/* Small star accents */}
      <circle cx="20" cy="30" r="2" fill="currentColor" stroke="none" />
      <circle cx="100" cy="55" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="15" cy="65" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="108" cy="28" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}
