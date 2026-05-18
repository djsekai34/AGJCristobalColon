export default function Footer() {
  return (
    <footer
      className="relative bg-ocean-deep py-12 px-4 text-center"
      style={{ borderTop: '2px solid rgba(196,154,42,0.4)' }}
    >
      {/* Corner decorations */}
      <span className="corner-decoration tl" />
      <span className="corner-decoration tr" />

      {/* Rosa de los vientos pequeña */}
      <div className="flex justify-center mb-6">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.6">
          <circle cx="30" cy="30" r="28" stroke="#c49a2a" strokeWidth="1" />
          <polygon points="30,4 33,24 27,24" fill="#d4a017" />
          <polygon points="30,56 33,36 27,36" fill="#8b6914" />
          <polygon points="4,30 24,27 24,33" fill="#8b6914" />
          <polygon points="56,30 36,27 36,33" fill="#8b6914" />
          <polygon points="30,4 32,18 30,16 28,18" fill="#8b1a1a" opacity="0.6" />
          <circle cx="30" cy="30" r="3" fill="#d4a017" />
          <circle cx="30" cy="30" r="1.5" fill="#0a1628" />
        </svg>
      </div>

      <p className="font-heading text-parchment-light text-sm tracking-widest mb-2">
        © 2024 · Descubrimiento de América
      </p>
      <p className="font-body text-parchment-mid/70 text-xs tracking-wide mb-6">
        Curso de Especialización de Videojuegos y VR
      </p>

      {/* Golden divider */}
      <div className="golden-divider max-w-xs mx-auto mb-4">
        <span className="text-gold text-xs">✦</span>
      </div>

      <p className="font-body italic text-parchment-pale/50 text-sm">
        "No temas al mar que no conoces"
      </p>
    </footer>
  )
}
