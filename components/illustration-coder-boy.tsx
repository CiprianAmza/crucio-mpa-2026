export function CoderBoy({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="boy-shirt" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#dddde8" />
        </linearGradient>
        <linearGradient id="boy-laptop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#1f2937" />
          <stop offset="1" stopColor="#0b0f1a" />
        </linearGradient>
        <linearGradient id="boy-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0a14" />
          <stop offset="1" stopColor="#1a1030" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="306" rx="80" ry="8" fill="#000" opacity="0.45" />

      <g>
        <rect x="40" y="220" width="140" height="14" rx="3" fill="#0f1424" />
        <rect x="50" y="234" width="120" height="64" rx="2" fill="#1a2236" />
        <rect x="100" y="234" width="20" height="64" fill="#0f1424" />
      </g>

      <g>
        <path
          d="M 60 124 Q 50 134 56 158 L 56 218 Q 56 226 64 226 L 156 226 Q 164 226 164 218 L 164 158 Q 170 134 160 124 L 144 110 L 76 110 Z"
          fill="url(#boy-shirt)"
        />
        <path d="M 110 110 L 100 130 L 110 138 L 120 130 Z" fill="#0f1424" opacity="0.35" />
      </g>

      <g>
        <ellipse cx="110" cy="80" rx="34" ry="38" fill="#fbe4c8" />
        <path d="M 76 78 Q 78 50 110 44 Q 150 44 146 80 Q 140 56 116 56 Q 92 56 88 76 Q 80 70 76 90 Z" fill="#1a1620" />
        <path d="M 86 76 Q 90 64 102 64 L 100 80 Z" fill="#1a1620" />
        <path d="M 134 76 Q 130 64 118 64 L 120 80 Z" fill="#1a1620" />
        <ellipse cx="98" cy="86" rx="3" ry="4" fill="#1a1620" />
        <ellipse cx="122" cy="86" rx="3" ry="4" fill="#1a1620" />
        <path d="M 96 100 Q 110 106 124 100" stroke="#1a1620" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="92" cy="92" rx="4" ry="2" fill="#f4b1a5" opacity="0.6" />
        <ellipse cx="128" cy="92" rx="4" ry="2" fill="#f4b1a5" opacity="0.6" />
      </g>

      <g>
        <path d="M 56 168 Q 32 184 38 218 L 56 218 Q 60 200 60 184 Z" fill="url(#boy-shirt)" />
        <path d="M 164 168 Q 188 184 182 218 L 164 218 Q 160 200 160 184 Z" fill="url(#boy-shirt)" />
        <ellipse cx="40" cy="222" rx="10" ry="8" fill="#fbe4c8" />
        <ellipse cx="180" cy="222" rx="10" ry="8" fill="#fbe4c8" />
      </g>

      <g>
        <rect x="58" y="242" width="50" height="46" rx="2" fill="url(#boy-laptop)" />
        <rect x="60" y="244" width="46" height="42" rx="1" fill="url(#boy-screen)" />
        <rect x="64" y="248" width="10" height="2" fill="#f43f5e" opacity="0.9" />
        <rect x="64" y="252" width="22" height="2" fill="#a3a3b3" opacity="0.7" />
        <rect x="64" y="256" width="16" height="2" fill="#a3a3b3" opacity="0.5" />
        <rect x="68" y="260" width="20" height="2" fill="#10b981" opacity="0.7" />
        <rect x="68" y="264" width="14" height="2" fill="#a3a3b3" opacity="0.5" />
        <rect x="64" y="268" width="24" height="2" fill="#fbbf24" opacity="0.8" />
      </g>

      <ellipse cx="110" cy="48" rx="22" ry="3" fill="#f43f5e" opacity="0.18" />
    </svg>
  );
}
