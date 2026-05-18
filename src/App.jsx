import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Inicio from "./pages/Inicio";
import Explicacion from "./pages/Explicacion";
import Juego from "./pages/Juego";
import Nosotros from "./pages/Nosotros";
import JuegoCofre from "./pages/JuegoCofre";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/inicio" element={<Inicio />} />
          <Route path="/explicacion" element={<Explicacion />} />
          <Route path="/juego" element={<Juego />} />
          <Route path="/JuegoCofre" element={<JuegoCofre />} />
          <Route path="/nosotros" element={<Nosotros />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <AnimatedRoutes />
    </BrowserRouter>
  );
}
