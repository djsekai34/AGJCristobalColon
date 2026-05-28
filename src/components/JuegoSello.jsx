import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FondoJuego from "../Imagenes/Fondo.png";

import Caballo from "../Imagenes/JuegoSellar/Caballo.png";
import Cacao from "../Imagenes/JuegoSellar/Cacao.png";
import Hamburguesa from "../Imagenes/JuegoSellar/Hamburguesa.png";
import Iguana from "../Imagenes/JuegoSellar/Iguana.png";
import Maiz from "../Imagenes/JuegoSellar/Maiz.png";
import Oro from "../Imagenes/JuegoSellar/Oro.png";
import Patata from "../Imagenes/JuegoSellar/Patata.png";
import Rueda from "../Imagenes/JuegoSellar/Rueda.png";
import Tabaco from "../Imagenes/JuegoSellar/Tabaco.png";

const ALL_ITEMS = [
  { id: "Caballo", img: Caballo, label: "Caballo", correct: false },
  { id: "Cacao", img: Cacao, label: "Cacao", correct: true },
  { id: "Hamburguesa", img: Hamburguesa, label: "Hamburguesa", correct: false },
  { id: "Iguana", img: Iguana, label: "Iguana", correct: true },
  { id: "Maiz", img: Maiz, label: "Maíz", correct: true },
  { id: "Oro", img: Oro, label: "Oro", correct: true },
  { id: "Patata", img: Patata, label: "Patata", correct: true },
  { id: "Rueda", img: Rueda, label: "Rueda", correct: false },
  { id: "Tabaco", img: Tabaco, label: "Tabaco", correct: true },
];

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function buildGame() {
  const correct = shuffle(ALL_ITEMS.filter((i) => i.correct));
  const wrong = shuffle(ALL_ITEMS.filter((i) => !i.correct));
  const slotDefs = shuffle(correct.slice(0, 6));
  const stamperPool = shuffle([...correct.slice(0, 6), ...wrong.slice(0, 3)]);
  return { slotDefs, stamperPool };
}

function StampSVG({ item, size = 88 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 90 90">
      <circle
        cx="45"
        cy="45"
        r="40"
        fill="rgba(120,60,10,0.10)"
        stroke="#8b5e2a"
        strokeWidth="2"
        strokeDasharray="5 3"
      />
      <circle
        cx="45"
        cy="45"
        r="32"
        fill="rgba(180,110,30,0.08)"
        stroke="#a07030"
        strokeWidth="1"
      />
      <image
        href={item.img}
        x="25"
        y="25"
        width="40"
        height="40"
        preserveAspectRatio="xMidYMid meet"
      />
    </svg>
  );
}

function StamperDevice({ item, onDragStart }) {
  return (
    <motion.div
      draggable
      onDragStart={onDragStart}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.96 }}
      style={{
        cursor: "grab",
        userSelect: "none",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.8))",
      }}
    >
      {/* Mango */}
      <div
        style={{
          width: 42,
          height: 72,
          background:
            "linear-gradient(180deg,#6b2a08 0%,#8b3a10 40%,#6b2a08 100%)",
          borderRadius: "8px 8px 0 0",
          border: "1.5px solid #3a1a04",
          position: "relative",
        }}
      >
        {[8, 22, 36].map((top) => (
          <div
            key={top}
            style={{
              position: "absolute",
              top,
              left: "50%",
              transform: "translateX(-50%)",
              width: 20,
              height: 8,
              borderRadius: 4,
              background: "#3a1a04",
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Cuello */}
      <div
        style={{
          width: 54,
          height: 16,
          background: "linear-gradient(180deg,#5a1a04,#7a2a08)",
          border: "1.5px solid #3a1a04",
          borderTop: "none",
        }}
      />

      {/* Cuerpo muelle */}
      <div
        style={{
          width: 100,
          height: 42,
          background:
            "linear-gradient(180deg,#c8822a 0%,#a05010 60%,#c8822a 100%)",
          border: "2px solid #5a3010",
          borderRadius: "2px",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 10,
            right: 10,
            top: "50%",
            transform: "translateY(-50%)",
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                height: 4,
                background: "linear-gradient(90deg,#5a3010,#e8a040,#5a3010)",
                borderRadius: 2,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      </div>

      {/* Base */}
      <div
        style={{
          width: 118,
          height: 24,
          background: "linear-gradient(180deg,#7a3a10,#5a2808)",
          border: "2px solid #3a1a04",
          borderTop: "none",
          borderRadius: "0 0 4px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: "#f0c060",
            letterSpacing: ".1em",
            fontFamily: "'Cinzel',serif",
          }}
        >
          SELLADOR
        </span>
      </div>

      {/* Cara del sello — imagen más grande */}
      <div
        style={{
          width: 118,
          height: 52,
          background: "linear-gradient(180deg,#c8a050,#a07830)",
          border: "2px solid #6a4818",
          borderTop: "none",
          borderRadius: "0 0 8px 8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "6px",
        }}
      >
        <img
          src={item?.img}
          alt={item?.label}
          style={{ width: "40px", height: "40px", objectFit: "contain" }}
        />
      </div>

      {/* Almohadilla tinta */}
      <div
        style={{
          width: 128,
          height: 14,
          background: "linear-gradient(180deg,#1a0800,#2a1008)",
          border: "2px solid #0a0400",
          borderTop: "none",
          borderRadius: "0 0 10px 10px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at 30% 50%,rgba(80,20,0,.4),transparent 60%),radial-gradient(ellipse at 70% 50%,rgba(80,20,0,.4),transparent 60%)",
          }}
        />
      </div>
    </motion.div>
  );
}

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
  "#f0c040",
  "#e8a020",
  "#fff8e0",
  "#c87020",
  "#ffe080",
  "#a05010",
  "#ffd060",
];
function Confetti() {
  const pieces = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
    x: Math.random() * 100,
    delay: Math.random() * 0.8,
  }));
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        pointerEvents: "none",
        zIndex: 100,
      }}
    >
      {pieces.map((p) => (
        <ConfettiPiece key={p.id} {...p} />
      ))}
    </div>
  );
}

export default function JuegoSellos() {
  const [gameData] = useState(buildGame);
  const { slotDefs } = gameData;
  const [stamperPool, setStamperPool] = useState(gameData.stamperPool);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [filledSlots, setFilledSlots] = useState({});
  const [wrongFlash, setWrongFlash] = useState(null);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [gameWon, setGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameKey, setGameKey] = useState(0);
  const msgTimer = useRef(null);

  const showMsg = useCallback((text, type) => {
    clearTimeout(msgTimer.current);
    setMsg({ text, type });
    msgTimer.current = setTimeout(() => setMsg({ text: "", type: "" }), 2000);
  }, []);

  const handleDrop = useCallback(
    (slotIndex, e) => {
      e.preventDefault();
      if (filledSlots[slotIndex] !== undefined || stamperPool.length === 0)
        return;

      const stamp = stamperPool[currentIdx];
      const slot = slotDefs[slotIndex];

      if (!stamp.correct) {
        setWrongFlash(slotIndex);
        setTimeout(() => setWrongFlash(null), 450);
        showMsg(`❌ ${stamp.label} no es necesario para nuestro viaje`, "err");
        return;
      }

      const alreadyPlaced = Object.values(filledSlots).some(
        (s) => s.id === stamp.id,
      );
      if (alreadyPlaced) {
        setWrongFlash(slotIndex);
        setTimeout(() => setWrongFlash(null), 450);
        showMsg(`❌ ${stamp.label} ya está sellado`, "err");
        return;
      }

      const newFilled = { ...filledSlots, [slotIndex]: stamp };
      setFilledSlots(newFilled);
      showMsg(`✓ ${stamp.label} sellado`, "ok");

      const nextPool = [...stamperPool];
      nextPool.splice(currentIdx, 1);
      setStamperPool(nextPool);
      setCurrentIdx((prev) =>
        nextPool.length === 0 ? 0 : prev >= nextPool.length ? 0 : prev,
      );

      if (Object.keys(newFilled).length === 6) {
        setTimeout(() => {
          setGameWon(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 3500);
        }, 500);
      }
    },
    [filledSlots, stamperPool, currentIdx, slotDefs, showMsg],
  );

  const restart = () => {
    const fresh = buildGame();
    setStamperPool(fresh.stamperPool);
    setCurrentIdx(0);
    setFilledSlots({});
    setMsg({ text: "", type: "" });
    setGameWon(false);
    setShowConfetti(false);
    setGameKey((k) => k + 1);
  };

  const prev = () =>
    stamperPool.length > 0 &&
    setCurrentIdx((i) => (i - 1 + stamperPool.length) % stamperPool.length);
  const next = () =>
    stamperPool.length > 0 &&
    setCurrentIdx((i) => (i + 1) % stamperPool.length);

  const currentStamp = stamperPool[currentIdx] ?? null;
  const filledCount = Object.keys(filledSlots).length;

  return (
    <section
      id="juego-sellos"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${FondoJuego})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 28,
        padding: "5px 16px 60px",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Lato', sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background: "rgba(8,3,0,0.52)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(4,1,0,0.78) 100%)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 40% 35% at 25% 28%, rgba(255,155,35,0.08) 0%, transparent 70%), radial-gradient(ellipse 30% 25% at 85% 22%, rgba(255,130,15,0.07) 0%, transparent 70%)",
        }}
      />

      {[
        { top: 72, left: 16 },
        { top: 72, right: 16 },
        { bottom: 16, left: 16 },
        { bottom: 16, right: 16 },
      ].map((pos, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 50,
            height: 50,
            borderColor: "rgba(220,170,50,0.35)",
            borderStyle: "solid",
            borderWidth:
              i < 2
                ? i === 0
                  ? "2px 0 0 2px"
                  : "2px 2px 0 0"
                : i === 2
                  ? "0 0 2px 2px"
                  : "0 2px 2px 0",
            ...pos,
            pointerEvents: "none",
          }}
        />
      ))}

      {Array.from({ length: 10 }, (_, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "#f0c040",
            left: `${10 + i * 8}%`,
            top: `${15 + (i % 5) * 15}%`,
            opacity: 0.2,
            pointerEvents: "none",
          }}
          animate={{ y: [0, -12, 0], opacity: [0.1, 0.3, 0.1] }}
          transition={{
            duration: 5 + i * 0.6,
            repeat: Infinity,
            delay: i * 0.5,
          }}
        />
      ))}

      {showConfetti && <Confetti />}

      <motion.div
        style={{ textAlign: "center", position: "relative", zIndex: 10 }}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              height: 1,
              width: 60,
              background: "linear-gradient(to right, transparent, #d4a017)",
            }}
          />
          <span style={{ color: "#f0c040", fontSize: 14 }}>✦</span>
          <div
            style={{
              height: 1,
              width: 60,
              background: "linear-gradient(to left, transparent, #d4a017)",
            }}
          />
        </div>
        <h2
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            color: "#f5d060",
            fontSize: "clamp(1.3rem, 3vw, 2rem)",
            letterSpacing: ".1em",
            textShadow:
              "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(240,180,30,0.35)",
            marginBottom: 6,
          }}
        >
          El Libro de Sellos
        </h2>
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            color: "rgba(240,210,130,0.6)",
            fontSize: 12,
            letterSpacing: ".1em",
            textShadow: "0 1px 4px rgba(0,0,0,0.9)",
          }}
        >
          Arrastra el sellador correcto a cualquier hueco — ¡cuidado con los
          impostores!
        </p>
      </motion.div>

      <motion.div
        key={gameKey}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        style={{
          display: "flex",
          width: "min(860px, 96vw)",
          minHeight: 400,
          borderRadius: 12,
          overflow: "hidden",
          boxShadow:
            "0 20px 80px rgba(0,0,0,0.9), 0 0 0 2px #6a4818, 0 0 40px rgba(200,140,20,0.15)",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: 0,
            bottom: 0,
            width: 28,
            transform: "translateX(-50%)",
            background:
              "linear-gradient(90deg,rgba(0,0,0,0.6),rgba(40,20,5,0.2) 35%,rgba(40,20,5,0.2) 65%,rgba(0,0,0,0.6))",
            zIndex: 10,
            pointerEvents: "none",
          }}
        />

        {/* PÁGINA IZQUIERDA */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #f0e2be 0%, #e2cc90 100%)",
            padding: "28px 20px 28px 28px",
            position: "relative",
          }}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 36,
                right: 12,
                top: 44 + i * 34,
                height: 1,
                background: "rgba(139,94,42,0.18)",
                pointerEvents: "none",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              width: 80,
              height: 80,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139,94,42,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 9,
              letterSpacing: ".2em",
              color: "#6a3e12",
              textAlign: "center",
              marginBottom: 14,
              opacity: 0.8,
              textTransform: "uppercase",
            }}
          >
            ✦ Sellos del Explorador ✦
          </p>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: 12,
            }}
          >
            {slotDefs.map((slot, i) => {
              const isFilled = filledSlots[i] !== undefined;
              const isWrong = wrongFlash === i;
              return (
                <motion.div
                  key={i}
                  animate={isWrong ? { x: [-5, 5, -5, 5, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(i, e)}
                  style={{
                    height: 108,
                    borderRadius: 6,
                    border: isFilled
                      ? "1.5px solid #8b5e2a"
                      : isWrong
                        ? "2px solid #c03010"
                        : "2px dashed rgba(139,94,42,0.5)",
                    background: isWrong
                      ? "rgba(200,60,30,0.12)"
                      : isFilled
                        ? "rgba(240,220,170,0.7)"
                        : "rgba(255,248,220,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "background .2s, border-color .2s",
                    cursor: isFilled ? "default" : "copy",
                    boxShadow: isFilled
                      ? "inset 0 1px 4px rgba(0,0,0,0.1)"
                      : "none",
                  }}
                >
                  {isFilled ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -20 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ type: "spring", stiffness: 260 }}
                    >
                      <StampSVG item={filledSlots[i]} size={90} />
                    </motion.div>
                  ) : (
                    <span
                      style={{
                        fontFamily: "'Cinzel', serif",
                        fontSize: 11,
                        color: "rgba(139,94,42,0.45)",
                      }}
                    >
                      {i + 1}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* PÁGINA DERECHA */}
        <div
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #e2cc90 0%, #f0e2be 100%)",
            padding: "28px 28px 42px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            position: "relative",
          }}
        >
          {Array.from({ length: 9 }, (_, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                left: 12,
                right: 36,
                top: 44 + i * 34,
                height: 1,
                background: "rgba(139,94,42,0.18)",
                pointerEvents: "none",
              }}
            />
          ))}
          <div
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              width: 60,
              height: 60,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(139,94,42,0.07) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 11,
              letterSpacing: ".2em",
              color: "#6a3e12",
              opacity: 0.8,
              textTransform: "uppercase",
            }}
          >
            ✦ Sellador ✦
          </p>

          {/* ── CONTADOR NUMÉRICO (Un pelín más grande y con espacio) ── */}
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: 12,
              color: "rgba(139,94,42,0.7)", // Subido un poco la opacidad para que se lea mejor al ser más grande
              letterSpacing: ".1em",
              marginTop: "-2px",
              marginBottom: "8px", // Ajustado un poquito para equilibrar el tamaño
              pointerEvents: "none",
            }}
          >
            {stamperPool.length > 0
              ? `${currentIdx + 1} / ${stamperPool.length}`
              : "—"}
          </p>

          {currentStamp ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 20,
                zIndex: 2,
              }}
            >
              <motion.button
                onClick={prev}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "2px solid #8b5e2a",
                  background: "linear-gradient(135deg, #f0d898, #d4b870)",
                  color: "#4a2c0a",
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
                aria-label="anterior"
              >
                ←
              </motion.button>

              <StamperDevice
                item={currentStamp}
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", "stamp")
                }
              />

              <motion.button
                onClick={next}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: "2px solid #8b5e2a",
                  background: "linear-gradient(135deg, #f0d898, #d4b870)",
                  color: "#4a2c0a",
                  fontSize: 16,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                }}
                aria-label="siguiente"
              >
                →
              </motion.button>
            </div>
          ) : (
            <p
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                color: "#8b5e2a",
                opacity: 0.5,
              }}
            >
              Sin sellos restantes
            </p>
          )}

          {/* ── MENSAJE DE ÉXITO / ERROR ── */}
          {/* Ajustado el marginTop para compensar el hueco que dejó el contador anterior */}
          <div style={{ height: 16, zIndex: 2, marginTop: 18 }}>
            <AnimatePresence mode="wait">
              {msg.text && (
                <motion.p
                  key={msg.text}
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -3 }}
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: 12,
                    letterSpacing: ".05em",
                    color: msg.type === "ok" ? "#2a6a10" : "#c03010",
                    textAlign: "center",
                    textShadow: "0 1px 2px rgba(255,255,255,0.5)",
                  }}
                >
                  {msg.text}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* ── PROGRESO DE PUNTOS ── */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              zIndex: 2,
              marginTop: 4,
            }}
          >
            {Array.from({ length: 6 }, (_, i) => (
              <motion.div
                key={i}
                animate={i < filledCount ? { scale: [1, 1.4, 1] } : {}}
                transition={{ duration: 0.3 }}
                style={{
                  width: 10,
                  height: 11,
                  borderRadius: "50%",
                  border: "1.5px solid #8b5e2a",
                  background:
                    i < filledCount
                      ? "linear-gradient(135deg, #d4a017, #8b6914)"
                      : "rgba(139,94,42,0.15)",
                  boxShadow:
                    i < filledCount ? "0 0 6px rgba(212,160,23,0.5)" : "none",
                }}
              />
            ))}
            <span
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: 11,
                color: "rgba(74,44,10,0.6)",
                marginLeft: 4,
              }}
            >
              {filledCount}/6
            </span>
          </div>
        </div>
      </motion.div>
      {/* WIN SCREEN */}
      <AnimatePresence>
        {gameWon && (
          <motion.div
            style={{
              position: "fixed",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 200,
              background: "rgba(5,2,0,0.9)",
              backdropFilter: "blur(6px)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {showConfetti && <Confetti />}
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
              style={{
                background: "linear-gradient(160deg, #1a0e03 0%, #2e1a06 100%)",
                border: "2px solid #c49a2a",
                borderRadius: 16,
                padding: "40px 48px",
                textAlign: "center",
                maxWidth: 400,
                width: "90%",
                position: "relative",
                boxShadow:
                  "0 0 60px rgba(200,150,20,0.25), 0 20px 60px rgba(0,0,0,0.8)",
              }}
            >
              {[
                {
                  top: 10,
                  left: 10,
                  borderTop: "2px solid #c49a2a",
                  borderLeft: "2px solid #c49a2a",
                },
                {
                  top: 10,
                  right: 10,
                  borderTop: "2px solid #c49a2a",
                  borderRight: "2px solid #c49a2a",
                },
                {
                  bottom: 10,
                  left: 10,
                  borderBottom: "2px solid #c49a2a",
                  borderLeft: "2px solid #c49a2a",
                },
                {
                  bottom: 10,
                  right: 10,
                  borderBottom: "2px solid #c49a2a",
                  borderRight: "2px solid #c49a2a",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{ position: "absolute", width: 28, height: 28, ...s }}
                />
              ))}

              <div style={{ fontSize: 52, marginBottom: 12 }}>🏆</div>
              <h3
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "#f5d060",
                  fontSize: "1.4rem",
                  letterSpacing: ".08em",
                  marginBottom: 8,
                  textShadow: "0 0 20px rgba(240,180,30,0.4)",
                }}
              >
                ¡Libro completado!
              </h3>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "rgba(240,210,150,0.75)",
                  fontSize: 13,
                  lineHeight: 1.7,
                  marginBottom: 28,
                }}
              >
                Has sellado los 6 pasaportes correctamente.
                <br />
                Colón estaría orgulloso.
              </p>
              <motion.button
                onClick={restart}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  background: "linear-gradient(135deg, #d4a017, #8b6914)",
                  color: "#fff8e0",
                  border: "none",
                  borderRadius: 4,
                  padding: "12px 32px",
                  fontSize: 12,
                  letterSpacing: ".15em",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                }}
              >
                ↺ Jugar de nuevo
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
