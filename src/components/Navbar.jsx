import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import logoGame from "../Imagenes/logoGame.png";

// 1. Corregimos las rutas para que apunten a la raíz "/" que es tu Home
const navItems = [
  { label: "Inicio", section: "#inicio", route: "/" },
  { label: "Explicación", section: "#explicacion", route: "/" },
  { label: "Juego", section: "#juego", route: "/" },
  { label: "Nosotros", section: "#nosotros", route: "/" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Nueva lógica de navegación híbrida (Scroll / Redirección)
  const handleNavClick = (item, e) => {
    e.preventDefault();
    setMobileOpen(false);

    if (isHome) {
      // Si ya estás en la Home, busca el elemento y hace scroll suave
      const el = document.querySelector(item.section);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // Si estás en /JuegoCofre o cualquier otra página, navega a "/"
      navigate(item.route);

      // Esperamos un instante a que cargue la página de inicio y aplicamos el scroll
      setTimeout(() => {
        const el = document.querySelector(item.section);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const isActive = (item) => {
    if (isHome) return false;
    return location.pathname === item.route;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-ocean-deep/95 backdrop-blur-md shadow-2xl shadow-black/50"
          : "bg-ocean-deep/80 backdrop-blur-sm"
      }`}
      style={{ borderBottom: "1px solid rgba(196,154,42,0.4)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src={logoGame}
              alt="Logo Andalucía Game Jam"
              className="h-10 w-auto object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
              style={{ filter: "drop-shadow(0 0 6px rgba(196,154,42,0.5))" }}
            />
            <div className="relative">
              <svg
                className="animate-spin-slow w-8 h-8"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="#c49a2a"
                  strokeWidth="1.5"
                />
                <circle cx="20" cy="20" r="3" fill="#d4a017" />
                <polygon points="20,2 22,14 18,14" fill="#d4a017" />
                <polygon points="20,38 22,26 18,26" fill="#8b6914" />
                <polygon points="2,20 14,18 14,22" fill="#8b6914" />
                <polygon points="38,20 26,18 26,22" fill="#8b6914" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <line
                    key={i}
                    x1="20"
                    y1="4"
                    x2="20"
                    y2={i % 2 === 0 ? 7 : 6}
                    stroke="#c49a2a"
                    strokeWidth="1"
                    transform={`rotate(${angle} 20 20)`}
                  />
                ))}
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-gold text-xs tracking-[0.3em]">
                1492
              </span>
              <span className="font-heading text-parchment-light text-sm tracking-widest hidden sm:block">
                DESCUBRIMIENTO
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 ml-12">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.route}
                onClick={(e) => handleNavClick(item, e)}
                className={`relative px-4 py-2 font-heading text-sm tracking-widest transition-all duration-300 group ${
                  isActive(item)
                    ? "text-gold bg-ocean-mid rounded"
                    : "text-parchment-light hover:text-gold"
                }`}
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-4/5" />
              </a>
            ))}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-parchment-light hover:text-gold transition-colors p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {mobileOpen ? (
                <motion.div
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-ocean-deep/98 border-t border-parchment-mid/20"
          >
            <div className="px-4 py-4 flex flex-col gap-2">
              {navItems.map((item, i) => (
                <motion.a
                  key={item.label}
                  href={item.route}
                  onClick={(e) => handleNavClick(item, e)}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.07 }}
                  className={`px-4 py-3 font-heading text-sm tracking-widest rounded transition-all ${
                    isActive(item)
                      ? "text-gold bg-ocean-mid"
                      : "text-parchment-light hover:text-gold hover:bg-ocean-mid/50"
                  }`}
                >
                  {item.label}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
