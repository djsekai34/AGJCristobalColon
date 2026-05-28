import { useEffect, useRef, useState, useCallback } from "react";
import FondoJuego from "../Imagenes//FlappyBarco/Fondo.png";
import BarcoImg from "../Imagenes//FlappyBarco/Barco.png";
import PiedraImg1 from "../Imagenes/FlappyBarco/piedra1.png";
import PiedraImg2 from "../Imagenes/FlappyBarco/piedra2.png";
import PiedraImg3 from "../Imagenes/FlappyBarco/piedra3.png";
import PiedraImg4 from "../Imagenes/FlappyBarco/piedra4.png";

const CANVAS_W = 900;
const CANVAS_H = 500;
const GRAVITY = 0.18;
const JUMP_FORCE = -6.5;
const SHIP_W = 90;
const SHIP_H = 60;
const ROCK_W = 72;
const GAP = 190;
const ROCK_SPEED_INIT = 2.8;
const ROCK_INTERVAL = 1600;
const MAX_LIVES = 3;
const INVINCIBLE_MS = 1800;
const WIN_SCORE = 70;

function randBetween(a, b) {
  return Math.random() * (b - a) + a;
}

function collides(ax, ay, aw, ah, bx, by, bw, bh, margin = 18) {
  return (
    ax + margin < bx + bw - margin &&
    ax + aw - margin > bx + margin &&
    ay + margin < by + bh - margin &&
    ay + ah - margin > by + margin
  );
}

// Dibuja una miniatura del barco para representar las vidas en el HUD
function drawShipLife(ctx, x, y, width, height, full) {
  ctx.save();
  if (full) {
    ctx.drawImage(this, x, y, width, height);
  } else {
    // Si ha perdido la vida, pintamos la silueta del barco con opacidad reducida
    ctx.globalAlpha = 0.25;
    ctx.drawImage(this, x, y, width, height);
  }
  ctx.restore();
}

export default function FlappyBarco() {
  const canvasRef = useRef(null);
  const stateRef = useRef(null);
  const rafRef = useRef(null);
  const lastRockRef = useRef(0);
  const imgsRef = useRef({});
  const [phase, setPhase] = useState("idle");
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [bestScore, setBest] = useState(0);
  const [imgsReady, setImgsReady] = useState(false);

  // ── Carga de imágenes ──────────────────────────────────────────────────────
  useEffect(() => {
    const toLoad = {
      fondo: FondoJuego,
      barco: BarcoImg,
      piedra1: PiedraImg1,
      piedra2: PiedraImg2,
      piedra3: PiedraImg3,
      piedra4: PiedraImg4,
    };
    let loaded = 0;
    const total = Object.keys(toLoad).length;
    Object.entries(toLoad).forEach(([key, src]) => {
      const img = new Image();
      img.onload = () => {
        imgsRef.current[key] = img;
        loaded++;
        if (loaded === total) setImgsReady(true);
      };
      img.onerror = () => {
        loaded++;
        if (loaded === total) setImgsReady(true);
      };
      img.src = src;
    });
  }, []);

  // ── Estado inicial ─────────────────────────────────────────────────────────
  const initState = useCallback(
    () => ({
      ship: { x: 140, y: CANVAS_H / 2 - SHIP_H / 2, vy: 0 },
      rocks: [],
      score: 0,
      lives: MAX_LIVES,
      invincible: 0,
      rockSpeed: ROCK_SPEED_INIT,
      passed: new Set(),
    }),
    [],
  );

  // ── Bucle principal ────────────────────────────────────────────────────────
  const gameLoop = useCallback((timestamp) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const S = stateRef.current;
    if (!S) return;

    // Física
    S.ship.vy += GRAVITY;
    S.ship.y += S.ship.vy;

    if (S.ship.y < 0) {
      S.ship.y = 0;
      S.ship.vy = 0;
    }
    if (S.ship.y + SHIP_H > CANVAS_H) {
      S.ship.y = CANVAS_H - SHIP_H;
      S.ship.vy = 0;
    }

    // Generar rocas
    if (timestamp - lastRockRef.current > ROCK_INTERVAL) {
      lastRockRef.current = timestamp;
      const topH = randBetween(60, CANVAS_H - GAP - 60);
      S.rocks.push({
        id: timestamp,
        x: CANVAS_W + 10,
        topH,
        botY: topH + GAP,
        botH: CANVAS_H - topH - GAP,
        scored: false,
        piedraKey: `piedra${Math.ceil(Math.random() * 4)}`,
      });
    }

    // Mover rocas + colisiones
    S.rocks = S.rocks.filter((r) => r.x + ROCK_W > -10);
    for (const r of S.rocks) {
      r.x -= S.rockSpeed;

      if (!r.scored && r.x + ROCK_W < S.ship.x) {
        r.scored = true;
        S.score++;
        if (S.score % 5 === 0) S.rockSpeed = Math.min(S.rockSpeed + 0.3, 8);
        setScore(S.score);
      }

      if (collides(S.ship.x, S.ship.y, SHIP_W, SHIP_H, r.x, 0, ROCK_W, r.topH))
        handleHit(S, timestamp);
      if (
        collides(
          S.ship.x,
          S.ship.y,
          SHIP_W,
          SHIP_H,
          r.x,
          r.botY,
          ROCK_W,
          r.botH,
        )
      )
        handleHit(S, timestamp);
    }

    drawFrame(ctx, S, timestamp);

    if (S.score >= WIN_SCORE) {
      cancelAnimationFrame(rafRef.current);
      setBest((b) => Math.max(b, S.score));
      setPhase("won");
      return;
    }

    if (S.lives > 0) {
      rafRef.current = requestAnimationFrame(gameLoop);
    } else {
      setPhase("dead");
      setBest((b) => Math.max(b, S.score));
    }
  }, []); // eslint-disable-line

  function handleHit(S, timestamp) {
    if (timestamp - S.invincible < INVINCIBLE_MS) return;
    S.invincible = timestamp;
    S.lives = Math.max(0, S.lives - 1);
    setLives(S.lives);
    S.ship.vy = JUMP_FORCE * 0.6;
  }

  // ── Dibujo ─────────────────────────────────────────────────────────────────
  function drawFrame(ctx, S, timestamp) {
    const imgs = imgsRef.current;

    // Fondo
    if (imgs.fondo) {
      ctx.drawImage(imgs.fondo, 0, 0, CANVAS_W, CANVAS_H);
    } else {
      ctx.fillStyle = "#0a1628";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
    ctx.fillStyle = "rgba(5,2,0,0.38)";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Rocas
    for (const r of S.rocks) {
      const piedraImg = imgs[r.piedraKey];
      if (piedraImg) {
        // Roca superior (volteada)
        ctx.save();
        ctx.translate(r.x + ROCK_W / 2, r.topH / 2);
        ctx.scale(1, -1);
        ctx.drawImage(piedraImg, -ROCK_W / 2, -r.topH / 2, ROCK_W, r.topH);
        ctx.restore();
        // Roca inferior
        ctx.drawImage(piedraImg, r.x, r.botY, ROCK_W, r.botH);
      } else {
        drawRockFallback(ctx, r.x, 0, ROCK_W, r.topH, true);
        drawRockFallback(ctx, r.x, r.botY, ROCK_W, r.botH, false);
      }

      // Brillo en el hueco
      const grd = ctx.createLinearGradient(r.x, r.topH, r.x, r.botY);
      grd.addColorStop(0, "rgba(212,160,23,0.06)");
      grd.addColorStop(0.5, "rgba(212,160,23,0.00)");
      grd.addColorStop(1, "rgba(212,160,23,0.06)");
      ctx.fillStyle = grd;
      ctx.fillRect(r.x, r.topH, ROCK_W, GAP);
    }

    // Barco
    const blink = S.invincible > 0 && timestamp - S.invincible < INVINCIBLE_MS;
    const visible =
      !blink || Math.floor((timestamp - S.invincible) / 120) % 2 === 0;
    if (visible) {
      ctx.save();
      const tilt = Math.max(-0.45, Math.min(0.45, S.ship.vy * 0.04));
      ctx.translate(S.ship.x + SHIP_W / 2, S.ship.y + SHIP_H / 2);
      ctx.rotate(tilt);
      if (imgs.barco) {
        ctx.drawImage(imgs.barco, -SHIP_W / 2, -SHIP_H / 2, SHIP_W, SHIP_H);
      } else {
        drawShipFallback(ctx);
      }
      ctx.restore();
    }

    drawHUD(ctx, S, timestamp);
  }

  function drawRockFallback(ctx, x, y, w, h, isTop) {
    const grd = ctx.createLinearGradient(x, y, x + w, y + h);
    grd.addColorStop(0, "#3a2a18");
    grd.addColorStop(0.5, "#5a4028");
    grd.addColorStop(1, "#2a1a0a");
    ctx.fillStyle = grd;
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(196,154,42,0.5)";
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, w, h);
    ctx.beginPath();
    if (isTop) {
      ctx.moveTo(x, y + h);
      ctx.lineTo(x + w / 2, y + h - 20);
      ctx.lineTo(x + w, y + h);
    } else {
      ctx.moveTo(x, y);
      ctx.lineTo(x + w / 2, y + 20);
      ctx.lineTo(x + w, y);
    }
    ctx.fillStyle = "#4a3020";
    ctx.fill();
  }

  function drawShipFallback(ctx) {
    ctx.fillStyle = "#4a2c0a";
    ctx.beginPath();
    ctx.ellipse(0, 8, 38, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#3a1f08";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, 8);
    ctx.lineTo(0, -28);
    ctx.stroke();
    ctx.fillStyle = "#f5ecd7";
    ctx.beginPath();
    ctx.moveTo(0, -26);
    ctx.lineTo(24, -10);
    ctx.lineTo(0, 2);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#8b1a1a";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(6, -22);
    ctx.lineTo(6, -4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -14);
    ctx.lineTo(18, -14);
    ctx.stroke();
  }

  function drawHUD(ctx, S, timestamp) {
    const imgs = imgsRef.current;

    // Puntuación
    ctx.save();
    ctx.font = "bold 28px 'Cinzel Decorative', serif";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillText(S.score, CANVAS_W / 2 + 2, 52);
    ctx.fillStyle = "#f5d060";
    ctx.shadowColor = "rgba(212,160,23,0.6)";
    ctx.shadowBlur = 10;
    ctx.fillText(S.score, CANVAS_W / 2, 50);
    ctx.restore();

    // Barcos de Vida en el Canvas
    const lifeW = 42;
    const lifeH = 28;
    for (let i = 0; i < MAX_LIVES; i++) {
      ctx.save();
      if (i >= S.lives) {
        ctx.globalAlpha = 0.25;
      }
      if (imgs.barco) {
        ctx.drawImage(imgs.barco, 16 + i * (lifeW + 8), 16, lifeW, lifeH);
      } else {
        ctx.translate(16 + i * (lifeW + 8) + lifeW / 2, 16 + lifeH / 2);
        ctx.scale(0.4, 0.4);
        drawShipFallback(ctx);
      }
      ctx.restore();
    }

    // Velocidad
    ctx.save();
    ctx.font = "11px 'Cinzel', serif";
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(240,210,130,0.4)";
    ctx.fillText(
      `VEL × ${S.rockSpeed.toFixed(1)}`,
      CANVAS_W - 16,
      CANVAS_H - 12,
    );
    ctx.restore();

    // Flash rojo al recibir daño
    const hitAge = timestamp - S.invincible;
    if (hitAge < 300 && S.invincible > 0) {
      ctx.save();
      ctx.fillStyle = `rgba(200,20,20,${0.25 * (1 - hitAge / 300)})`;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
      ctx.restore();
    }
  }

  function drawOverlay(ctx) {
    const imgs = imgsRef.current;
    if (imgs.fondo) {
      ctx.drawImage(imgs.fondo, 0, 0, CANVAS_W, CANVAS_H);
    } else {
      ctx.fillStyle = "#0a1628";
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
    ctx.fillStyle = "rgba(5,2,0,0.62)";
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    if (imgs.barco) {
      ctx.drawImage(
        imgs.barco,
        CANVAS_W / 2 - SHIP_W / 2,
        CANVAS_H / 2 - SHIP_H / 2 - 30,
        SHIP_W,
        SHIP_H,
      );
    } else {
      ctx.save();
      ctx.translate(CANVAS_W / 2, CANVAS_H / 2 - 30);
      drawShipFallback(ctx);
      ctx.restore();
    }

    const lifeW = 42;
    const lifeH = 28;
    for (let i = 0; i < MAX_LIVES; i++) {
      if (imgs.barco) {
        ctx.drawImage(imgs.barco, 16 + i * (lifeW + 8), 16, lifeW, lifeH);
      }
    }
  }

  useEffect(() => {
    if (!imgsReady) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (phase === "idle" || phase === "dead") drawOverlay(ctx);
  }, [phase, imgsReady]); // eslint-disable-line

  // ── Iniciar / Saltar ───────────────────────────────────────────────────────
  const startGame = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    stateRef.current = initState();
    lastRockRef.current = 0;
    setScore(0);
    setLives(MAX_LIVES);
    setPhase("playing");
    setTimeout(() => {
      lastRockRef.current = performance.now() - ROCK_INTERVAL + 2000;
    }, 0);
    rafRef.current = requestAnimationFrame(gameLoop);
  }, [initState, gameLoop]);

  const jump = useCallback(() => {
    if (phase === "idle" || phase === "dead") {
      startGame();
      return;
    }
    if (stateRef.current) stateRef.current.ship.vy = JUMP_FORCE;
  }, [phase, startGame]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === "Space" || e.key === " ") {
        e.preventDefault();
        jump();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [jump]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <section
      id="flappy"
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
        padding: "90px 16px 50px",
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
          background: "rgba(5,2,0,0.45)",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse at center, transparent 40%, rgba(4,1,0,0.75) 100%)",
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

      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 2,
            height: 2,
            borderRadius: "50%",
            background: "#f0c040",
            left: `${8 + i * 11}%`,
            top: `${12 + (i % 4) * 20}%`,
            opacity: 0.2,
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Título */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 20,
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 8,
          }}
        >
          <div
            style={{
              height: 1,
              width: 50,
              background: "linear-gradient(to right, transparent, #d4a017)",
            }}
          />
          <span style={{ color: "#f0c040", fontSize: 13 }}>✦</span>
          <div
            style={{
              height: 1,
              width: 50,
              background: "linear-gradient(to left, transparent, #d4a017)",
            }}
          />
        </div>
        <h2
          style={{
            fontFamily: "'Cinzel Decorative', serif",
            color: "#f5d060",
            fontSize: "clamp(1.1rem, 2.5vw, 1.8rem)",
            letterSpacing: ".1em",
            textShadow:
              "0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(240,180,30,0.3)",
            marginBottom: 4,
          }}
        >
          El paso de los arrecifes
        </h2>
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            color: "rgba(240,210,130,0.55)",
            fontSize: 11,
            letterSpacing: ".15em",
            textShadow: "0 1px 4px rgba(0,0,0,0.9)",
          }}
        >
          ESPACIO / TAP para volar · 3 barcos · esquiva las rocas hasta llegar
          al Nuevo Mundo
        </p>
      </div>

      {bestScore > 0 && (
        <div
          style={{
            position: "relative",
            zIndex: 10,
            marginBottom: 10,
            fontFamily: "'Cinzel', serif",
            color: "rgba(240,200,80,0.6)",
            fontSize: 11,
            letterSpacing: ".15em",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
          }}
        >
          ⚓ RÉCORD: {bestScore}
        </div>
      )}

      {/* Canvas */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <canvas
          ref={canvasRef}
          width={CANVAS_W}
          height={CANVAS_H}
          onClick={jump}
          style={{
            display: "block",
            borderRadius: 8,
            border: "2px solid rgba(196,154,42,0.5)",
            boxShadow:
              "0 0 0 1px rgba(196,154,42,0.2), 0 20px 60px rgba(0,0,0,0.8)",
            cursor: "pointer",
            maxWidth: "100%",
            touchAction: "none",
          }}
        />

        {/* Overlay inicio */}
        {phase === "idle" && imgsReady && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                background: "rgba(10,5,0,0.82)",
                border: "2px solid #c49a2a",
                borderRadius: 12,
                padding: "28px 40px",
                textAlign: "center",
                backdropFilter: "blur(4px)",
                boxShadow: "0 0 40px rgba(196,154,42,0.2)",
                position: "relative",
              }}
            >
              {[
                {
                  top: 8,
                  left: 8,
                  borderTop: "1.5px solid #c49a2a",
                  borderLeft: "1.5px solid #c49a2a",
                },
                {
                  top: 8,
                  right: 8,
                  borderTop: "1.5px solid #c49a2a",
                  borderRight: "1.5px solid #c49a2a",
                },
                {
                  bottom: 8,
                  left: 8,
                  borderBottom: "1.5px solid #c49a2a",
                  borderLeft: "1.5px solid #c49a2a",
                },
                {
                  bottom: 8,
                  right: 8,
                  borderBottom: "1.5px solid #c49a2a",
                  borderRight: "1.5px solid #c49a2a",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{ position: "absolute", width: 20, height: 20, ...s }}
                />
              ))}

              <div style={{ fontSize: 42, marginBottom: 10 }}>⛵</div>
              <h3
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "#f5d060",
                  fontSize: "clamp(1rem, 2vw, 1.4rem)",
                  letterSpacing: ".08em",
                  marginBottom: 8,
                  textShadow: "0 0 15px rgba(240,180,30,0.4)",
                }}
              >
                ¡Zarpa, explorador!
              </h3>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "rgba(240,210,150,0.7)",
                  fontSize: 12,
                  marginBottom: 18,
                  lineHeight: 1.6,
                }}
              >
                Esquiva las rocas y llega al Nuevo Mundo.
                <br />
                Tienes un total de {MAX_LIVES} navíos para intentarlo.
              </p>
              <button
                onClick={startGame}
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  background: "linear-gradient(135deg, #d4a017, #8b6914)",
                  color: "#fff8e0",
                  border: "none",
                  borderRadius: 4,
                  padding: "11px 30px",
                  fontSize: 13,
                  letterSpacing: ".15em",
                  cursor: "pointer",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.5), 0 0 20px rgba(212,160,23,0.3)",
                }}
              >
                ⚓ ¡NAVEGAR!
              </button>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "rgba(200,160,60,0.4)",
                  fontSize: 10,
                  marginTop: 10,
                  letterSpacing: ".1em",
                }}
              >
                o pulsa ESPACIO
              </p>
            </div>
          </div>
        )}

        {/* Overlay muerte */}
        {phase === "dead" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background: "rgba(5,1,0,0.75)",
              backdropFilter: "blur(3px)",
            }}
          >
            <div
              style={{
                background: "rgba(12,6,0,0.9)",
                border: "2px solid #c49a2a",
                borderRadius: 12,
                padding: "28px 40px",
                textAlign: "center",
                boxShadow: "0 0 50px rgba(196,154,42,0.2)",
                position: "relative",
              }}
            >
              {[
                {
                  top: 8,
                  left: 8,
                  borderTop: "1.5px solid #c49a2a",
                  borderLeft: "1.5px solid #c49a2a",
                },
                {
                  top: 8,
                  right: 8,
                  borderTop: "1.5px solid #c49a2a",
                  borderRight: "1.5px solid #c49a2a",
                },
                {
                  bottom: 8,
                  left: 8,
                  borderBottom: "1.5px solid #c49a2a",
                  borderLeft: "1.5px solid #c49a2a",
                },
                {
                  bottom: 8,
                  right: 8,
                  borderBottom: "1.5px solid #c49a2a",
                  borderRight: "1.5px solid #c49a2a",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{ position: "absolute", width: 20, height: 20, ...s }}
                />
              ))}

              <div style={{ fontSize: 40, marginBottom: 8 }}>💀</div>
              <h3
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "#e03030",
                  fontSize: "clamp(1rem, 2vw, 1.35rem)",
                  letterSpacing: ".08em",
                  marginBottom: 6,
                  textShadow: "0 0 15px rgba(220,40,40,0.4)",
                }}
              >
                ¡Naufragio!
              </h3>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "rgba(240,210,150,0.7)",
                  fontSize: 12,
                  marginBottom: 4,
                }}
              >
                Has llegado a
              </p>
              <div
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "#f5d060",
                  fontSize: "2.8rem",
                  textShadow: "0 0 20px rgba(240,180,30,0.5)",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {score}
              </div>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "rgba(200,160,60,0.5)",
                  fontSize: 10,
                  letterSpacing: ".1em",
                  marginBottom: 16,
                }}
              >
                {bestScore > 0 && score >= bestScore
                  ? "🏆 ¡NUEVO RÉCORD!"
                  : bestScore > 0
                    ? `RÉCORD: ${bestScore}`
                    : "PUNTOS"}
              </p>
              <button
                onClick={startGame}
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  background: "linear-gradient(135deg, #d4a017, #8b6914)",
                  color: "#fff8e0",
                  border: "none",
                  borderRadius: 4,
                  padding: "11px 28px",
                  fontSize: 12,
                  letterSpacing: ".15em",
                  cursor: "pointer",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.5)",
                }}
              >
                ↺ REINTENTAR
              </button>
            </div>
          </div>
        )}

        {/* ── Overlay victoria ── */}
        {phase === "won" && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              background: "rgba(2,8,2,0.82)",
              backdropFilter: "blur(3px)",
            }}
          >
            {/* Confetti CSS puro */}
            {Array.from({ length: 28 }, (_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  width: i % 3 === 0 ? 10 : 7,
                  height: i % 3 === 0 ? 10 : 7,
                  borderRadius: i % 2 === 0 ? "50%" : "2px",
                  background: [
                    "#f0c040",
                    "#d4a017",
                    "#fff8e0",
                    "#c87020",
                    "#ffe080",
                    "#8b6914",
                    "#ffd060",
                  ][i % 7],
                  left: `${3 + i * 3.4}%`,
                  top: "-12px",
                  opacity: 0.9,
                  animation: `confettiFall ${1.8 + (i % 5) * 0.35}s ease-in ${(i % 7) * 0.18}s forwards`,
                }}
              />
            ))}
            <style>{`
              @keyframes confettiFall {
                0%   { transform: translateY(0)    rotate(0deg);   opacity: 1; }
                100% { transform: translateY(560px) rotate(${Math.random() > 0.5 ? "" : "-"}540deg); opacity: 0; }
              }
            `}</style>

            <div
              style={{
                background: "linear-gradient(160deg, #0a1a04 0%, #162a08 100%)",
                border: "2px solid #c49a2a",
                borderRadius: 14,
                padding: "32px 44px",
                textAlign: "center",
                boxShadow:
                  "0 0 60px rgba(120,200,40,0.2), 0 0 100px rgba(212,160,23,0.15)",
                position: "relative",
                maxWidth: 400,
                width: "90%",
              }}
            >
              {[
                {
                  top: 8,
                  left: 8,
                  borderTop: "1.5px solid #c49a2a",
                  borderLeft: "1.5px solid #c49a2a",
                },
                {
                  top: 8,
                  right: 8,
                  borderTop: "1.5px solid #c49a2a",
                  borderRight: "1.5px solid #c49a2a",
                },
                {
                  bottom: 8,
                  left: 8,
                  borderBottom: "1.5px solid #c49a2a",
                  borderLeft: "1.5px solid #c49a2a",
                },
                {
                  bottom: 8,
                  right: 8,
                  borderBottom: "1.5px solid #c49a2a",
                  borderRight: "1.5px solid #c49a2a",
                },
              ].map((s, i) => (
                <div
                  key={i}
                  style={{ position: "absolute", width: 20, height: 20, ...s }}
                />
              ))}

              <div style={{ fontSize: 52, marginBottom: 10 }}>🏆</div>
              <h3
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  color: "#f5d060",
                  fontSize: "clamp(1rem, 2vw, 1.45rem)",
                  letterSpacing: ".08em",
                  marginBottom: 8,
                  textShadow: "0 0 25px rgba(240,180,30,0.6)",
                }}
              >
                ¡Tierra a la vista!
              </h3>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "rgba(240,210,150,0.75)",
                  fontSize: 13,
                  lineHeight: 1.7,
                  marginBottom: 6,
                }}
              >
                Has cruzado el Atlántico y llegado
                <br />
                al <strong style={{ color: "#f0c040" }}>Nuevo Mundo</strong>.
              </p>
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  color: "rgba(200,160,60,0.55)",
                  fontSize: 11,
                  marginBottom: 20,
                  fontStyle: "italic",
                }}
              >
                "Colón estaría orgulloso, explorador."
              </p>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 28,
                  marginBottom: 24,
                }}
              >
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'Cinzel Decorative'",
                      color: "#f5d060",
                      fontSize: "2rem",
                      textShadow: "0 0 12px rgba(240,180,30,0.5)",
                    }}
                  >
                    {score}
                  </div>
                  <div
                    style={{
                      color: "rgba(200,160,50,0.55)",
                      fontSize: 10,
                      letterSpacing: ".1em",
                      fontFamily: "'Cinzel',serif",
                    }}
                  >
                    PUNTOS
                  </div>
                </div>
                <div
                  style={{ width: 1, background: "rgba(196,154,42,0.25)" }}
                />
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontFamily: "'Cinzel Decorative'",
                      color: "#90e050",
                      fontSize: "2rem",
                    }}
                  >
                    {WIN_SCORE}
                  </div>
                  <div
                    style={{
                      color: "rgba(200,160,50,0.55)",
                      fontSize: 10,
                      letterSpacing: ".1em",
                      fontFamily: "'Cinzel',serif",
                    }}
                  >
                    OBJETIVO
                  </div>
                </div>
              </div>
              <button
                onClick={startGame}
                style={{
                  fontFamily: "'Cinzel Decorative', serif",
                  background: "linear-gradient(135deg, #d4a017, #8b6914)",
                  color: "#fff8e0",
                  border: "none",
                  borderRadius: 4,
                  padding: "11px 28px",
                  fontSize: 12,
                  letterSpacing: ".15em",
                  cursor: "pointer",
                  boxShadow:
                    "0 4px 15px rgba(0,0,0,0.5), 0 0 20px rgba(212,160,23,0.25)",
                }}
              >
                ↺ JUGAR DE NUEVO
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tips */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          gap: 24,
          marginTop: 16,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {[
          { icon: "⌨️", text: "ESPACIO para subir" },
          { icon: "🖱️", text: "Click / Tap también" },
          { icon: "🪨", text: "Esquiva las rocas" },
          { icon: "⛵", text: `${MAX_LIVES} barcos por partida` },
        ].map((tip) => (
          <div
            key={tip.text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "'Cinzel', serif",
              color: "rgba(220,180,80,0.45)",
              fontSize: 10,
              letterSpacing: ".1em",
              textShadow: "0 1px 3px rgba(0,0,0,0.8)",
            }}
          >
            <span>{tip.icon}</span>
            <span>{tip.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
