import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import IconoArma from "../Imagenes/Arma.png";
import IconoBrujula from "../Imagenes/Brujula.png";

function Particle({ style }) {
  return <div className="particle animate-float" style={style} />;
}

export default function JuegoSection() {
  const [particles, setParticles] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const p = Array.from({ length: 30 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      width: `${Math.random() * 4 + 2}px`,
      height: `${Math.random() * 4 + 2}px`,
      opacity: Math.random() * 0.5 + 0.2,
      animationDelay: `${Math.random() * 6}s`,
      animationDuration: `${Math.random() * 4 + 4}s`,
    }));
    setParticles(p);
  }, []);

  return (
    <section
      id="juego"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20"
      style={{
        background:
          "radial-gradient(ellipse at center, #0d2040 0%, #0a1628 50%, #050d1a 100%)",
      }}
    >
      {/* Particles */}
      {particles.map((p, i) => (
        <Particle key={i} style={p} />
      ))}

      {/* Bioluminescent glow spots */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, #d4a017 0%, transparent 70%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full opacity-8"
          style={{
            background: "radial-gradient(circle, #4da6d4 0%, transparent 70%)",
          }}
        />
      </div>

      {/* Ship silhouettes on sides */}
      <div className="absolute left-0 bottom-20 opacity-10 pointer-events-none hidden lg:block">
        <svg width="140" height="120" viewBox="0 0 140 120" fill="#d4a017">
          <path d="M10 70 Q70 90 130 70 L120 95 Q70 108 20 95 Z" />
          <line
            x1="70"
            y1="15"
            x2="70"
            y2="72"
            stroke="#d4a017"
            strokeWidth="3"
          />
          <path d="M70 17 L105 35 L105 65 L70 72 Z" />
          <path d="M40 28 L65 42 L65 68 L40 72 Z" />
        </svg>
      </div>
      <div
        className="absolute right-0 bottom-20 opacity-10 pointer-events-none hidden lg:block"
        style={{ transform: "scaleX(-1)" }}
      >
        <svg width="140" height="120" viewBox="0 0 140 120" fill="#d4a017">
          <path d="M10 70 Q70 90 130 70 L120 95 Q70 108 20 95 Z" />
          <line
            x1="70"
            y1="15"
            x2="70"
            y2="72"
            stroke="#d4a017"
            strokeWidth="3"
          />
          <path d="M70 17 L105 35 L105 65 L70 72 Z" />
          <path d="M40 28 L65 42 L65 68 L40 72 Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        {/* Icon */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, type: "spring" }}
        >
          <img
            src={IconoArma}
            alt="Icono decorativo"
            className="w-20 h-20 object-contain drop-shadow-lg"
          />
        </motion.div>

        <motion.h2
          className="font-display text-parchment-light mb-6"
          style={{
            fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
            letterSpacing: "0.05em",
            textShadow: "0 0 40px rgba(212,160,23,0.3)",
          }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.7 }}
        >
          ¿Listo para zarpar?
        </motion.h2>

        <motion.p
          className="font-body text-parchment-light/70 text-lg lg:text-xl mb-12 leading-relaxed"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.7 }}
        >
          El nuevo mundo te espera al otro lado del horizonte.
          <br />
          <em>¿Te atreves a cruzarlo?</em>
        </motion.p>

        {/* CTA Button */}
        <div className="flex justify-center w-full py-10 -mt-10">
          <motion.button
            onClick={() => navigate("/JuegoCofre")}
            className="relative font-display text-ocean-deep cursor-pointer overflow-hidden flex items-center justify-center gap-6"
            style={{
              background:
                "linear-gradient(135deg, #d4a017 0%, #c49a2a 50%, #8b6914 100%)",
              border: "2px solid #d4a017",
              fontSize: "clamp(0.9rem, 2vw, 1.3rem)",
              letterSpacing: "0.2em",
              padding: "1.25rem 3rem",
              borderRadius: "2px",
              // Asegúrate de tener definida la animación pulseGold en tu CSS
              animation: "pulseGold 2s ease-in-out infinite",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{
              scale: 1.05,
              boxShadow:
                "0 0 40px rgba(212,160,23,0.7), 0 0 80px rgba(212,160,23,0.3)",
            }}
            whileTap={{ scale: 0.97 }}
            aria-label="Pulsa para jugar"
          >
            {/* Efecto de brillo (Shimmer) */}
            <motion.div
              className="absolute inset-0 opacity-30"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                x: "-100%",
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 2 }}
            />

            {/* Brújula Izquierda */}
            <img
              src={IconoBrujula}
              alt="Brújula"
              className="w-8 h-8 md:w-10 md:h-10 object-contain relative z-10"
            />

            {/* Texto Central */}
            <span className="relative z-10 font-heading tracking-widest whitespace-nowrap">
              PULSA PARA JUGAR
            </span>

            {/* Brújula Derecha */}
            <img
              src={IconoBrujula}
              alt="Brújula"
              className="w-8 h-8 md:w-10 md:h-10 object-contain relative z-10"
            />
          </motion.button>
        </div>

        {/* Sub hint */}
        <motion.p
          className="font-body text-parchment-mid/40 text-xs mt-6 tracking-widest"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 0.6 }}
        >
          VIDEOJUEGO EDUCATIVO — DESARROLLADO EN HTML5 PARA EL PROYECTO DE
          ANDALUCIA GAME JAM
        </motion.p>
      </div>
    </section>
  );
}
