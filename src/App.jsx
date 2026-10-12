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
