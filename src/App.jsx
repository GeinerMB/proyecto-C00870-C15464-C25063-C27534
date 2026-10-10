import { Link, Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";
import Lobby from "./pages/Lobby.jsx";
import Rules from "./pages/Rules.jsx";

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
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/rules" element={<Rules />} />
        </Routes>
      </main>

      <footer>
        <p>Galactic Squadrons — Proyecto académico.</p>
      </footer>
    </>
  );
}