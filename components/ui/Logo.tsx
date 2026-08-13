interface LogoMarkProps {
  className?: string;
  /** "badge" = carré arrondi ink en fond (à utiliser sur fond clair).
   *  "bare" = juste le tracé du M, sans fond (à utiliser sur fond déjà sombre). */
  variant?: "badge" | "bare";
}

/**
 * Logomark MatchCV : un "M" monoligne à deux tons (lime + cobalt), qui
 * évoque à la fois une coche de validation et le "match" entre deux
 * profils. Utilisé partout où figurait auparavant le simple badge "M".
 */
export function LogoMark({ className = "h-6 w-6", variant = "badge" }: LogoMarkProps) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      {variant === "badge" && <rect x="4" y="4" width="92" height="92" rx="22" fill="#12141C" />}
      <path
        d="M26 74 L26 28 L50 54"
        stroke="#C6FF3D"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M50 54 L74 28 L74 74"
        stroke="#5A70E4"
        strokeWidth="10"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
