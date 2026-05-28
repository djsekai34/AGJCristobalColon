import { motion } from "framer-motion";

// 1. Importamos las imágenes (asegúrate de que los nombres de archivo coincidan)
import libroImg from "../Imagenes/LibroAbierto.png";
import BanderaColonImg from "../Imagenes/BanderaColon.png";
import anclaImg from "../Imagenes/Ancla2.png";

const features = [
  {
    icon: libroImg,
    title: "Educativo",
    desc: "Aprende historia mientras juegas. Cada misión revela secretos del viaje de Colón.",
    delay: 0,
  },
  {
    icon: BanderaColonImg,
    title: "Inmersivo",
    desc: "Sumérgete en el océano de 1492 con una experiencia visual y narrativa única.",
    delay: 0.15,
  },
  {
    icon: anclaImg,
    title: "Hecho por Alumnos",
    desc: "Desarrollado por alumnos del Curso de Especialización en Videojuegos y VR.",
    delay: 0.3,
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

export default function ExplicacionSection() {
  return (
    <section
      id="explicacion"
      className="relative min-h-screen py-20 px-4 overflow-hidden parchment-texture"
      style={{
        background:
          "linear-gradient(160deg, #f5ecd7 0%, #e8d5a3 40%, #dcc98c 70%, #c49a2a20 100%)",
      }}
    >
      {/* Corner decorations */}
      <span className="corner-decoration tl" />
      <span className="corner-decoration tr" />
      <span className="corner-decoration bl" />
      <span className="corner-decoration br" />

      {/* Rosa de los vientos - decorative */}
      <motion.div
        className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-10 pointer-events-none"
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      >
        <svg width="200" height="200" viewBox="0 0 200 200" fill="none">
          <circle cx="100" cy="100" r="95" stroke="#8b6914" strokeWidth="2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a, i) => (
            <polygon
              key={i}
              points="100,10 106,70 94,70"
              fill={i % 2 === 0 ? "#8b6914" : "#c49a2a"}
              transform={`rotate(${a} 100 100)`}
              opacity={i % 2 === 0 ? 1 : 0.6}
            />
          ))}
          <circle cx="100" cy="100" r="12" fill="#c49a2a" opacity="0.5" />
          <circle cx="100" cy="100" r="6" fill="#8b6914" />
        </svg>
      </motion.div>

      {/* Decorative seal - right */}
      <div className="absolute right-8 bottom-22 opacity-60 pointer-events-none hidden lg:block">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle
            cx="60"
            cy="60"
            r="55"
            stroke="#8b6914"
            strokeWidth="3"
            strokeDasharray="8 4"
          />
          <circle cx="60" cy="60" r="45" stroke="#8b6914" strokeWidth="1" />
          <text
            x="60"
            y="52"
            textAnchor="middle"
            fontSize="10"
            fill="#8b6914"
            fontFamily="'Cinzel', serif"
          >
            EXPLORADORES
          </text>
          <text
            x="60"
            y="68"
            textAnchor="middle"
            fontSize="14"
            fill="#8b6914"
            fontFamily="'Cinzel', serif"
          >
            1492
          </text>
          <text
            x="60"
            y="82"
            textAnchor="middle"
            fontSize="10"
            fill="#8b6914"
            fontFamily="'Cinzel', serif"
          >
            HTML GAMES
          </text>
        </svg>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="golden-divider mb-6">
            <span className="font-heading text-parchment-dark text-xl tracking-widest">
              ✦ SOBRE EL PROYECTO ✦
            </span>
          </div>

          <h2
            className="font-heading text-wood mb-6"
            style={{ fontSize: "clamp(1.5rem, 4vw, 2.5rem)" }}
          >
            Bienvenido a bordo, explorador.
          </h2>

          <div
            className="mx-auto max-w-2xl text-wood/80 font-body leading-relaxed space-y-4"
            style={{ fontSize: "1.05rem" }}
          >
            <p>
              Este es un videojuego educativo desarrollado en HTML por alumnos
              del <strong>Curso de Especialización de Videojuegos y VR</strong>,
              para la{" "}
              <strong
                onClick={() =>
                  window.open(
                    "https://andalucia-game-jam.com",
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
                className="cursor-pointer transition-colors duration-300"
                style={{ color: "rgb(10 22 40 / 0.8)" }}
              >
                Game Jam Andalucía
              </strong>{" "}
              que se realizará el <strong>29 de Mayo de 2026</strong>.
            </p>
            <p>
              Nuestra misión: que la gente descubra cómo fue el descubrimiento
              de América y sea una aventura que nunca olvidarás. Acompañarás a
              Cristóbal Colón en su travesía por el océano Atlántico rumbo al
              Nuevo Mundo, mediante juegos y presentaciones sencillas e
              interactivas.
            </p>
            <p>Aprenderás todo de forma gráfica y divertida.</p>
          </div>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="parchment-card rounded p-6 text-center relative overflow-hidden"
              style={{
                boxShadow:
                  "4px 4px 20px rgba(139,105,20,0.25), inset 0 1px 0 rgba(255,255,255,0.5)",
              }}
            >
              <div className="absolute top-1 left-1 w-4 h-4 border-t border-l border-parchment-dark/30" />
              <div className="absolute top-1 right-1 w-4 h-4 border-t border-r border-parchment-dark/30" />
              <div className="absolute bottom-1 left-1 w-4 h-4 border-b border-l border-parchment-dark/30" />
              <div className="absolute bottom-1 right-1 w-4 h-4 border-b border-r border-parchment-dark/30" />

              {/* 2. Reemplazo del Emoji por <img> */}
              <div className="mb-4 relative z-10 flex justify-center h-12">
                <img
                  src={f.icon}
                  alt={f.title}
                  className="h-full w-auto object-contain"
                />
              </div>

              <h3
                className="font-heading text-wood mb-3 tracking-wide relative z-10"
                style={{ fontSize: "1.1rem" }}
              >
                {f.title}
              </h3>
              <p className="font-body text-wood/75 text-sm leading-relaxed relative z-10">
                {f.desc}
              </p>

              <div className="absolute bottom-0 left-4 right-4 h-px bg-parchment-dark/20" />
            </motion.div>
          ))}
        </div>

        {/* Decorative bottom quote */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="golden-divider max-w-sm mx-auto mb-4">
            <img
              src={anclaImg}
              alt="Ancla"
              className="h-5 w-auto object-contain opacity-60 mx-2"
            />
          </div>
          <p className="font-body italic text-parchment-dark/60 text-sm">
            "La aventura comienza donde termina el mapa"
          </p>
        </motion.div>
      </div>
    </section>
  );
}
