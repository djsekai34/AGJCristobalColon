import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FondoJuego from "../Imagenes/Fondo.png";
import Brujula from "../Imagenes/ImagenesJuegoCofre/Brujula.png";
import Calavera from "../Imagenes/ImagenesJuegoCofre/Calavera.png";
import Estoque from "../Imagenes/ImagenesJuegoCofre/Estoque.png";
import Muslo from "../Imagenes/ImagenesJuegoCofre/Muslo.png";
import PanMoh from "../Imagenes/ImagenesJuegoCofre/Pan_mohoso.png";
import Peluche from "../Imagenes/ImagenesJuegoCofre/Peluche.png";
import Sombrero from "../Imagenes/ImagenesJuegoCofre/Sombrero.png";
import Vino from "../Imagenes/ImagenesJuegoCofre/Vino.png";
import Mapa from "../Imagenes/ImagenesJuegoCofre/Mapa.jpg";
import Reloj from "../Imagenes/ImagenesJuegoCofre/Reloj.png";
import Vela from "../Imagenes/ImagenesJuegoCofre/Vela.png";
import Astolabio from "../Imagenes/ImagenesJuegoCofre/astrolabio.png";
import Gallina from "../Imagenes/ImagenesJuegoCofre/Gallina.png";
import Cuerda from "../Imagenes/ImagenesJuegoCofre/Cuerda.png";
import Movil from "../Imagenes/ImagenesJuegoCofre/Movil.png";
import Arpa from "../Imagenes/ImagenesJuegoCofre/Arpa.png";
import Agua from "../Imagenes/ImagenesJuegoCofre/BarrilDeAgua.png";
import Leon from "../Imagenes/ImagenesJuegoCofre/Leon.png";
import CofreCerrado from "../Imagenes/ImagenesJuegoCofre/Cofre.png";
import CofreAbierto from "../Imagenes/ImagenesJuegoCofre/Cofre_cerrado.png";

const inventoryItems = [
  {
    id: "brujula",
    image: Brujula,
    label: "Brújula",
    correct: true,
    reason: "¡Esencial! Sin brújula no sabrías hacia dónde navegas.",
  },
  {
    id: "vino",
    image: Vino,
    label: "Vino",
    correct: true,
    reason: "¡Imprescindible! El vino era una fuente importante de bebida para la tripulación.",
  },
  {
    id: "muslo",
    image: Muslo,
    label: "Muslo de cerdo",
    correct: true,
    reason: "¡Correcto! El muslo de cerdo era una fuente importante de alimento para la tripulación.",
  },
  {
    id: "estoque",
    image: Estoque,
    label: "Estoque",
    correct: true,
    reason: "¡Correcto! El estoque era necesario para la defensa durante el viaje.",
  },
  {
    id: "mapa",
    image: Mapa,
    label: "Mapa náutico",
    correct: true,
    reason: "¡Imprescindible! Los mapas guiaron a Colón hacia el Nuevo Mundo.",
  },
  {
    id: "reloj",
    image: Reloj,
    label: "Reloj de arena",
    correct: true,
    reason: "¡Imprescindible! El reloj de arena ayudaba a Colón a gestionar el tiempo durante el viaje.",
  },
  {
    id: "vela",
    image: Vela,
    label: "Vela",
    correct: true,
    reason: "¡Imprescindible! Las velas eran necesarias para la iluminación durante el viaje.",
  },
  {
    id: "astrolabio",
    image: Astolabio,
    label: "Astrolabio",
    correct: true,
    reason: "¡Imprescindible! El astrolabio era una herramienta crucial para la navegación durante el viaje.",
  },
  {
    id: "gallina",
    image: Gallina,
    label: "Gallina",
    correct: true,
    reason: "¡Imprescindible! La gallina era una fuente importante de alimento para la tripulación.",
  },
  {
    id: "cuerda",
    image: Cuerda,
    label: "Cuerda",
    correct: true,
    reason: "¡Imprescindible! La cuerda era necesaria para amarrar el barco y realizar diversas tareas.",
  },
  {
    id: "agua",
    image: Agua,
    label: "Barril de agua",
    correct: true,
    reason: "¡Imprescindible! El agua era esencial para la supervivencia de la tripulación.",
  },
  {
    id: "leon",
    image: Leon,
    label: "León",
    correct: false,
    reason: "¡Error! El león no era un animal necesario para el viaje.",
  },
  {
    id: "calavera",
    image: Calavera,
    label: "Calavera",
    correct: false,
    reason: "¡Error! La calavera es algo decorativo no te da funcionalidad en el viaje.",
  },
  {
    id: "panMohoso",
    image: PanMoh,
    label: "Pan mohoso",
    correct: false,
    reason: "El pan mohoso no es comestible y podría causar enfermedades.",
  },
  {
    id: "peluche",
    image: Peluche,
    label: "Peluche",
    correct: false,
    reason: "¡No! El peluche no era necesario para el viaje, solo un objeto de entretenimiento.",
  },
  {
    id: "sombrero",
    image: Sombrero,
    label: "Sombrero",
    correct: false,
    reason: "¡Imposible! Los sombreros de gala no son necesarios para el viaje.",
  },
  {
    id: "movil",
    image: Movil,
    label: "Móvil",
    correct: false,
    reason: "Negativo, no habia moviles en el 1492.",
  },
  {
    id: "arpa",
    image: Arpa,
    label: "Arpa",
    correct: false,
    reason: "¡Error! La arpa no era necesaria para el viaje, solo un objeto de entretenimiento.",
  },
];

function ConfettiPiece({ color, x, delay }) {
  return (
    <motion.div
      style={{
        position: "absolute",
        top: 0,
        left: `${x}%`,
        width: 10,
        height: 10,
        borderRadius: Math.random() > 0.5 ? "50%" : "2px",
        background: color,
        zIndex: 100,
      }}
      initial={{ y: -20, opacity: 1, rotate: 0, scale: 1 }}
      animate={{
        y: 700,
        opacity: [1, 1, 0.8, 0],
        rotate: Math.random() * 720 - 360,
        x: (Math.random() - 0.5) * 200,
        scale: [1, 0.8, 0.6],
      }}
      transition={{ duration: 2.5 + Math.random(), delay, ease: "easeIn" }}
    />
  );
}

const CONFETTI_COLORS = [
  "#f0c040", "#e8a020", "#fff8e0", "#c87020", "#ffe080", "#a05010", "#ffd060",
];

function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
  }));
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 100 }}>
      {pieces.map((p) => <ConfettiPiece key={p.id} {...p} />)}
    </div>
  );
}

function Chest({ isOpen, isShaking, isGlowing }) {
  return (
    <motion.div
      animate={isShaking ? { x: [-6, 6, -6, 6, 0] } : {}}
      transition={{ duration: 0.4 }}
      style={{
        position: "relative",
        display: "inline-block",
        filter: isGlowing
          ? "drop-shadow(0 0 18px #f0a020) drop-shadow(0 0 35px rgba(240,160,32,0.5))"
          : "drop-shadow(0 4px 12px rgba(0,0,0,0.7))",
        width: 160,
        height: 130,
      }}
    >
      <motion.img
        src={CofreAbierto}
        alt="Cofre abierto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      <motion.img
        src={CofreCerrado}
        alt="Cofre cerrado"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}

function ItemCard({ item, onDrop, inChest, feedbackId, isCorrect }) {
  const [dragging, setDragging] = useState(false);
  const ref = useRef();

  const handleDragStart = (e) => {
    e.dataTransfer.setData("itemId", item.id);
    setDragging(true);
  };
  const handleDragEnd = () => setDragging(false);
  const isFeedbackTarget = feedbackId === item.id;

  return (
    <motion.div
      ref={ref}
      draggable={!inChest}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{
        opacity: inChest ? 0.4 : 1,
        scale: dragging ? 1.1 : 1,
        rotate: isFeedbackTarget && isCorrect === false ? [-3, 3, -3, 0] : 0,
      }}
      whileHover={!inChest ? { scale: 1.06, y: -3 } : {}}
      transition={{ duration: 0.25 }}
      style={{
        cursor: inChest ? "default" : "grab",
        userSelect: "none",
        background: inChest
          ? "rgba(20,10,0,0.45)"
          : "linear-gradient(160deg, rgba(255,240,195,0.92) 0%, rgba(240,210,140,0.92) 80%, rgba(210,175,90,0.92) 100%)",
        border: inChest
          ? "1px dashed rgba(200,160,60,0.3)"
          : isFeedbackTarget
            ? `2px solid ${isCorrect ? "#f0c040" : "#cc3010"}`
            : "1px solid rgba(200,160,60,0.6)",
        borderRadius: 6,
        padding: "8px 6px",
        textAlign: "center",
        minWidth: 80,
        position: "relative",
        boxShadow: inChest
          ? "none"
          : "2px 2px 10px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.3)",
        backdropFilter: "blur(2px)",
      }}
    >
      <div style={{ width: "100%", height: 60, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
        <img
          src={item.image}
          alt={item.label}
          style={{
            maxWidth: "100%",
            maxHeight: 60,
            objectFit: "contain",
            opacity: inChest ? 0.35 : 1,
            pointerEvents: "none",
            userSelect: "none",
          }}
          draggable={false}
        />
      </div>
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 10,
          color: inChest ? "rgba(200,160,60,0.4)" : "#3a1f05",
          lineHeight: 1.2,
          letterSpacing: "0.05em",
        }}
      >
        {item.label}
      </div>
      {inChest && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            color: "#f0c040",
            opacity: 0.6,
          }}
        >
          ✓
        </div>
      )}
    </motion.div>
  );
}

function DropZone({ onDrop, children }) {
  const [over, setOver] = useState(false);

  const handleDragOver = (e) => { e.preventDefault(); setOver(true); };
  const handleDragLeave = () => setOver(false);
  const handleDrop = (e) => {
    e.preventDefault();
    setOver(false);
    const id = e.dataTransfer.getData("itemId");
    if (id) onDrop(id);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      style={{
        padding: "20px 24px",
        borderRadius: 12,
        border: over ? "2px dashed #f0c040" : "2px dashed rgba(200,160,60,0.3)",
        background: over ? "rgba(240,192,64,0.1)" : "rgba(0,0,0,0.15)",
        transition: "all 0.2s",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
      }}
    >
      {children}
      <div
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: 11,
          color: over ? "#f0c040" : "rgba(220,180,80,0.6)",
          letterSpacing: "0.15em",
          transition: "color 0.2s",
        }}
      >
        {over ? "¡SUELTA AQUÍ!" : "↓ ARRASTRA AL COFRE ↓"}
      </div>
    </div>
  );
}

export default function JuegoDelCofre() {
  const [items] = useState(() => {
    const correct = inventoryItems.filter((i) => i.correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
    const wrong = inventoryItems.filter((i) => !i.correct)
      .sort(() => Math.random() - 0.5)
      .slice(0, 4);
    return [...correct, ...wrong].sort(() => Math.random() - 0.5);
  });

  const [inChest, setInChest] = useState(new Set());
  const [feedback, setFeedback] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [chestOpen, setChestOpen] = useState(false);
  const [chestShaking, setChestShaking] = useState(false);
  const [chestGlowing, setChestGlowing] = useState(false);
  const [score, setScore] = useState({ correct: 0, wrong: 0 });
  const [gameWon, setGameWon] = useState(false);
  const feedbackTimerRef = useRef(null);
  const sectionRef = useRef(null);

 useEffect(() => {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}, []);

  const correctItems = items.filter((i) => i.correct);
  const progress = inChest.size / correctItems.length;

  const handleDrop = (itemId) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || inChest.has(itemId)) return;
    clearTimeout(feedbackTimerRef.current);

    if (item.correct) {
      const newSet = new Set([...inChest, itemId]);
      setInChest(newSet);
      setScore((s) => ({ ...s, correct: s.correct + 1 }));
      setFeedback({ id: itemId, correct: true, reason: item.reason });
      setChestOpen(true);
      setChestGlowing(true);

      const newCorrect = [...newSet].filter((id) => items.find((i) => i.id === id)?.correct);
      if (newCorrect.length === correctItems.length) {
        setTimeout(() => {
          setGameWon(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3500);
        }, 600);
      }

      feedbackTimerRef.current = setTimeout(() => {
        setFeedback(null);
        setChestOpen(false);
        setChestGlowing(false);
      }, 2800);
    } else {
      setScore((s) => ({ ...s, wrong: s.wrong + 1 }));
      setFeedback({ id: itemId, correct: false, reason: item.reason });
      setChestShaking(true);
      setTimeout(() => setChestShaking(false), 500);
      feedbackTimerRef.current = setTimeout(() => setFeedback(null), 2800);
    }
  };

  const resetGame = () => {
    setInChest(new Set());
    setFeedback(null);
    setShowConfetti(false);
    setChestOpen(false);
    setChestShaking(false);
    setChestGlowing(false);
    setScore({ correct: 0, wrong: 0 });
    setGameWon(false);
  };

  return (
    <section
      id="juego"
      ref={sectionRef}
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${FondoJuego})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        padding: "80px 16px 60px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Lato', sans-serif",
      }}
    >
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "rgba(10,5,0,0.45)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse at center, transparent 45%, rgba(5,2,0,0.75) 100%)" }} />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 40% 35% at 28% 30%, rgba(255,160,40,0.07) 0%, transparent 70%), radial-gradient(ellipse 30% 25% at 88% 25%, rgba(255,140,20,0.06) 0%, transparent 70%)" }} />

      {[{ top: 72, left: 16 }, { top: 72, right: 16 }, { bottom: 16, left: 16 }, { bottom: 16, right: 16 }].map((pos, i) => (
        <div key={i} style={{ position: "absolute", width: 50, height: 50, borderColor: "rgba(220,170,50,0.4)", borderStyle: "solid", borderWidth: i < 2 ? i === 0 ? "2px 0 0 2px" : "2px 2px 0 0" : i === 2 ? "0 0 2px 2px" : "0 2px 2px 0", ...pos, pointerEvents: "none" }} />
      ))}

      {Array.from({ length: 10 }, (_, i) => (
        <motion.div key={i} style={{ position: "absolute", width: 2, height: 2, borderRadius: "50%", background: "#f0c040", left: `${10 + i * 8}%`, top: `${15 + (i % 5) * 15}%`, opacity: 0.2, pointerEvents: "none" }} animate={{ y: [0, -12, 0], opacity: [0.1, 0.3, 0.1] }} transition={{ duration: 5 + i * 0.6, repeat: Infinity, delay: i * 0.5 }} />
      ))}

      {showConfetti && <Confetti />}

      <div style={{ maxWidth: 900, margin: "0 auto", position: "relative", zIndex: 10 }}>
        <motion.div style={{ textAlign: "center", marginBottom: 32 }} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ height: 1, width: 60, background: "linear-gradient(to right, transparent, #d4a017)" }} />
            <span style={{ color: "#f0c040", fontSize: 14 }}>✦</span>
            <div style={{ height: 1, width: 60, background: "linear-gradient(to left, transparent, #d4a017)" }} />
          </div>
          <h2 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#f5d060", fontSize: "clamp(1.4rem, 4vw, 2.2rem)", letterSpacing: "0.08em", marginBottom: 8, textShadow: "0 2px 8px rgba(0,0,0,0.8), 0 0 20px rgba(240,180,30,0.3)" }}>
            El Cofre del Explorador
          </h2>
          <p style={{ color: "rgba(240,210,130,0.75)", fontSize: 14, fontStyle: "italic", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
            Arrastra al cofre solo lo que necesitas para cruzar el Atlántico en 1492
          </p>
        </motion.div>

        <motion.div style={{ display: "flex", justifyContent: "center", gap: 16, marginBottom: 28, flexWrap: "wrap" }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          {[
            { emoji: "✅", label: `Correctos: ${score.correct}`, bg: "rgba(30,60,10,0.65)", border: "rgba(100,180,50,0.4)", color: "#90e050" },
            { emoji: "❌", label: `Errores: ${score.wrong}`, bg: "rgba(60,10,10,0.65)", border: "rgba(180,50,30,0.4)", color: "#f06050" },
            { emoji: "📦", label: `${inChest.size} / ${correctItems.length} objetos`, bg: "rgba(20,15,5,0.65)", border: "rgba(200,155,40,0.4)", color: "#f0c040" },
          ].map((b, i) => (
            <div key={i} style={{ background: b.bg, border: `1px solid ${b.border}`, borderRadius: 20, padding: "6px 18px", display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(4px)", boxShadow: "0 2px 8px rgba(0,0,0,0.4)" }}>
              <span style={{ fontSize: 15 }}>{b.emoji}</span>
              <span style={{ fontFamily: "'Cinzel', serif", color: b.color, fontSize: 13, textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}>{b.label}</span>
            </div>
          ))}
        </motion.div>

        <div style={{ maxWidth: 400, margin: "0 auto 32px", background: "rgba(0,0,0,0.4)", borderRadius: 20, height: 6, overflow: "hidden", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.5)" }}>
          <motion.div style={{ height: "100%", borderRadius: 20, background: "linear-gradient(90deg, #a06010, #f0c040)" }} animate={{ width: `${progress * 100}%` }} transition={{ duration: 0.5 }} />
        </div>

        <div style={{ display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
          <div style={{ flex: "1 1 340px" }}>
            <div style={{ fontFamily: "'Cinzel', serif", color: "rgba(220,180,80,0.6)", fontSize: 11, letterSpacing: "0.2em", marginBottom: 12, textAlign: "center", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              OBJETOS DISPONIBLES
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(90px, 1fr))", gap: 10 }}>
              {items.map((item) => (
                <ItemCard key={item.id} item={item} inChest={inChest.has(item.id)} onDrop={handleDrop} feedbackId={feedback?.id} isCorrect={feedback?.correct} />
              ))}
            </div>
          </div>

          <div style={{ flex: "0 0 220px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
            <div style={{ fontFamily: "'Cinzel', serif", color: "rgba(220,180,80,0.6)", fontSize: 11, letterSpacing: "0.2em", textAlign: "center", textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}>
              COFRE DE VIAJE
            </div>

            <DropZone onDrop={handleDrop}>
              <Chest isOpen={chestOpen} isShaking={chestShaking} isGlowing={chestGlowing} />
            </DropZone>

            <AnimatePresence>
              {feedback && (
                <motion.div
                  key={feedback.id + feedback.correct}
                  initial={{ opacity: 0, scale: 0.85, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: -5 }}
                  transition={{ duration: 0.3 }}
                  style={{ background: feedback.correct ? "rgba(20,35,10,0.92)" : "rgba(40,10,5,0.92)", border: `1px solid ${feedback.correct ? "rgba(120,200,50,0.5)" : "rgba(200,60,30,0.5)"}`, borderRadius: 8, padding: "12px 14px", maxWidth: 220, textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
                >
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{feedback.correct ? "✅" : "❌"}</div>
                  <div style={{ fontFamily: "'Cinzel', serif", color: feedback.correct ? "#90e050" : "#f06050", fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", marginBottom: 6 }}>
                    {feedback.correct ? "¡CORRECTO!" : "¡INCORRECTO!"}
                  </div>
                  <div style={{ color: "rgba(240,210,150,0.9)", fontSize: 12, lineHeight: 1.5 }}>{feedback.reason}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <AnimatePresence>
          {gameWon && (
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, type: "spring" }}
              style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, background: "rgba(5,2,0,0.88)", backdropFilter: "blur(6px)" }}
            >
              {showConfetti && <Confetti />}
              <motion.div
                style={{ background: "linear-gradient(160deg, #1a0e03 0%, #2e1a06 100%)", border: "2px solid #c49a2a", borderRadius: 16, padding: "40px 48px", textAlign: "center", maxWidth: 440, width: "90%", position: "relative", boxShadow: "0 0 60px rgba(200,150,20,0.25), 0 20px 60px rgba(0,0,0,0.8)" }}
                initial={{ y: 40 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1, type: "spring" }}
              >
                {[{ top: 10, left: 10, borderTop: "2px solid #c49a2a", borderLeft: "2px solid #c49a2a" }, { top: 10, right: 10, borderTop: "2px solid #c49a2a", borderRight: "2px solid #c49a2a" }, { bottom: 10, left: 10, borderBottom: "2px solid #c49a2a", borderLeft: "2px solid #c49a2a" }, { bottom: 10, right: 10, borderBottom: "2px solid #c49a2a", borderRight: "2px solid #c49a2a" }].map((s, i) => (
                  <div key={i} style={{ position: "absolute", width: 30, height: 30, ...s }} />
                ))}
                <div style={{ fontSize: 52, marginBottom: 12 }}>🏆</div>
                <h3 style={{ fontFamily: "'Cinzel Decorative', serif", color: "#f5d060", fontSize: "1.5rem", letterSpacing: "0.08em", marginBottom: 10, textShadow: "0 0 20px rgba(240,180,30,0.4)" }}>
                  ¡Zarpas hacia el Nuevo Mundo!
                </h3>
                <p style={{ color: "rgba(240,210,150,0.75)", fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>
                  Has preparado el cofre a la perfección.<br />Colón estaría orgulloso de ti, explorador.
                </p>
                <div style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 28, flexWrap: "wrap" }}>
                  {[
                    { val: score.correct, label: "ACIERTOS", color: "#90e050" },
                    { val: score.wrong, label: "ERRORES", color: "#f06050" },
                    { val: `${Math.round((score.correct / (score.correct + score.wrong)) * 100)}%`, label: "PRECISIÓN", color: "#f0c040" },
                  ].map((s, i) => (
                    <>
                      {i > 0 && <div key={`sep-${i}`} style={{ width: 1, background: "rgba(200,150,30,0.25)" }} />}
                      <div key={s.label} style={{ textAlign: "center" }}>
                        <div style={{ fontFamily: "'Cinzel Decorative'", color: s.color, fontSize: "2rem", textShadow: "0 0 10px rgba(0,0,0,0.5)" }}>{s.val}</div>
                        <div style={{ color: "rgba(200,160,50,0.6)", fontSize: 11, letterSpacing: "0.1em" }}>{s.label}</div>
                      </div>
                    </>
                  ))}
                </div>
                <motion.button onClick={resetGame} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }} style={{ fontFamily: "'Cinzel Decorative', serif", background: "linear-gradient(135deg, #d4a017, #8b6914)", color: "#fff8e0", border: "none", borderRadius: 4, padding: "12px 32px", fontSize: 13, letterSpacing: "0.15em", cursor: "pointer", boxShadow: "0 4px 15px rgba(0,0,0,0.5)" }}>
                  ⚓ Jugar de Nuevo
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!gameWon && (
          <motion.div style={{ textAlign: "center", marginTop: 36 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
            <button
              onClick={resetGame}
              style={{ fontFamily: "'Cinzel', serif", background: "rgba(0,0,0,0.3)", color: "rgba(220,180,80,0.5)", border: "1px solid rgba(200,155,40,0.25)", borderRadius: 4, padding: "8px 20px", fontSize: 11, letterSpacing: "0.15em", cursor: "pointer", transition: "all 0.2s", backdropFilter: "blur(4px)" }}
              onMouseEnter={(e) => { e.target.style.color = "#f0c040"; e.target.style.borderColor = "rgba(200,155,40,0.6)"; e.target.style.background = "rgba(0,0,0,0.5)"; }}
              onMouseLeave={(e) => { e.target.style.color = "rgba(220,180,80,0.5)"; e.target.style.borderColor = "rgba(200,155,40,0.25)"; e.target.style.background = "rgba(0,0,0,0.3)"; }}
            >
              ↺ REINICIAR
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}