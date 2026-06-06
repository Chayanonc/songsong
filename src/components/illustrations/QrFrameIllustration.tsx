export function QrFrameIllustration({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {/* Top-left corner */}
      <path d="M10 40 L10 10 L40 10" />
      {/* Top-right corner */}
      <path d="M160 10 L190 10 L190 40" />
      {/* Bottom-left corner */}
      <path d="M10 160 L10 190 L40 190" />
      {/* Bottom-right corner */}
      <path d="M160 190 L190 190 L190 160" />
      {/* Small decorative dots */}
      <circle cx="55" cy="10" r="2" fill="currentColor" stroke="none" />
      <circle cx="145" cy="10" r="2" fill="currentColor" stroke="none" />
      <circle cx="10" cy="55" r="2" fill="currentColor" stroke="none" />
      <circle cx="190" cy="55" r="2" fill="currentColor" stroke="none" />
      <circle cx="10" cy="145" r="2" fill="currentColor" stroke="none" />
      <circle cx="190" cy="145" r="2" fill="currentColor" stroke="none" />
      <circle cx="55" cy="190" r="2" fill="currentColor" stroke="none" />
      <circle cx="145" cy="190" r="2" fill="currentColor" stroke="none" />
    </svg>
  )
}
