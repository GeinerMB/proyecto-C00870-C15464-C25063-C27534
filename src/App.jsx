import { Link, Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";
import Lobby from "./pages/Lobby.jsx";
import Rules from "./pages/Rules.jsx";
import Game from "./pages/Game.jsx";
import Scoreboard from "./pages/Scoreboard.jsx";
import AboutUs from "./pages/About-us.jsx";

export default function App() {
  return (
    <>
      <header>
        <p>Galactic Squadrons</p>

        <nav aria-label="Navegación principal">
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/lobby">Lobby</Link>
            </li>
            <li>
              <Link to="/rules">Reglas</Link>
            </li>
            <li>
              <Link to="/game">Juego</Link>
            </li>
            <li>
              <Link to="/scoreboard">Marcadores</Link>
            </li>
            <li>
              <Link to="/about-us">Quiénes somos</Link>
            </li>
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/game" element={<Game />} />
          <Route path="/scoreboard" element={<Scoreboard />} />
          <Route path="/about-us" element={<AboutUs />} />
        </Routes>
      </main>

      <footer>
        <p>Galactic Squadrons — Proyecto académico.</p>
      </footer>
    </>
  );
}
