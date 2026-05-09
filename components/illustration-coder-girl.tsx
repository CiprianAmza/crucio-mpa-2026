export function CoderGirl({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 220 320"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="girl-dress" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset="1" stopColor="#6b21a8" />
        </linearGradient>
        <linearGradient id="girl-monitor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1f2937" />
          <stop offset="1" stopColor="#0b0f1a" />
        </linearGradient>
        <linearGradient id="girl-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0f0a1e" />
          <stop offset="1" stopColor="#241445" />
        </linearGradient>
      </defs>

      <ellipse cx="110" cy="306" rx="80" ry="8" fill="#000" opacity="0.45" />

      <g>
        <rect x="40" y="220" width="140" height="14" rx="3" fill="#0f1424" />
        <rect x="50" y="234" width="120" height="64" rx="2" fill="#1a2236" />
        <rect x="100" y="234" width="20" height="64" fill="#0f1424" />
      </g>

      <g>
        <rect x="60" y="190" width="100" height="14" rx="3" fill="#0f1424" />
        <rect x="100" y="204" width="20" height="32" fill="#0f1424" />
        <rect x="78" y="234" width="64" height="6" rx="2" fill="#0f1424" />
        <rect x="62" y="120" width="96" height="72" rx="4" fill="url(#girl-monitor)" />
        <rect x="66" y="124" width="88" height="64" rx="2" fill="url(#girl-screen)" />
        <rect x="70" y="130" width="14" height="2.5" fill="#a855f7" opacity="0.95" />
        <rect x="70" y="135" width="32" height="2.5" fill="#cbd5e1" opacity="0.7" />
        <rect x="70" y="140" width="22" height="2.5" fill="#cbd5e1" opacity="0.5" />
        <rect x="74" y="146" width="40" height="2.5" fill="#10b981" opacity="0.75" />
        <rect x="74" y="151" width="20" height="2.5" fill="#cbd5e1" opacity="0.5" />
        <rect x="74" y="156" width="34" height="2.5" fill="#fbbf24" opacity="0.85" />
        <rect x="70" y="162" width="28" height="2.5" fill="#a855f7" opacity="0.7" />
        <rect x="70" y="168" width="48" height="2.5" fill="#cbd5e1" opacity="0.4" />
        <rect x="70" y="174" width="18" height="2.5" fill="#cbd5e1" opacity="0.4" />
      </g>

      <g>
        <path
          d="M 78 134 Q 64 168 70 218 L 60 230 Q 80 240 110 240 Q 140 240 160 230 L 150 218 Q 156 168 142 134 L 132 122 L 88 122 Z"
          fill="url(#girl-dress)"
        />
        <path d="M 86 218 Q 110 232 134 218 L 132 240 Q 110 246 88 240 Z" fill="#4c1d95" opacity="0.7" />
        <circle cx="110" cy="148" r="3" fill="#fde68a" opacity="0.8" />
        <circle cx="110" cy="172" r="2.5" fill="#fde68a" opacity="0.7" />
        <circle cx="110" cy="196" r="2" fill="#fde68a" opacity="0.6" />
      </g>

      <g>
        <ellipse cx="110" cy="80" rx="32" ry="36" fill="#fde0c8" />
        <path d="M 78 60 Q 90 30 116 30 Q 148 30 150 70 Q 154 84 152 100 L 158 110 Q 162 122 154 132 L 146 120 Q 140 90 124 86 Q 110 86 96 92 Q 86 106 80 132 L 70 120 Q 64 108 70 96 Q 72 86 76 76 Z" fill="#3a1c5c" />
        <path d="M 138 92 Q 160 100 170 130 Q 174 168 162 200 Q 156 196 158 178 Q 156 156 148 134 Q 142 124 138 116 Z" fill="#3a1c5c" />
        <ellipse cx="100" cy="84" rx="3" ry="4" fill="#1a1620" />
        <ellipse cx="124" cy="84" rx="3" ry="4" fill="#1a1620" />
        <path d="M 96 80 Q 100 76 106 80" stroke="#3a1c5c" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M 118 80 Q 124 76 128 80" stroke="#3a1c5c" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M 102 102 Q 110 108 118 102" stroke="#a855f7" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <ellipse cx="92" cy="92" rx="4" ry="2" fill="#f4a4b6" opacity="0.7" />
        <ellipse cx="130" cy="92" rx="4" ry="2" fill="#f4a4b6" opacity="0.7" />
      </g>

      <g>
        <path d="M 78 138 Q 56 158 56 196 Q 60 200 64 198 L 84 168 Z" fill="url(#girl-dress)" />
        <ellipse cx="60" cy="200" rx="8" ry="6" fill="#fde0c8" />
      </g>

      <ellipse cx="110" cy="40" rx="22" ry="3" fill="#a855f7" opacity="0.25" />
    </svg>
  );
}
