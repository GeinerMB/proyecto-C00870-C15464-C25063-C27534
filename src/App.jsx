import { Link, Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";

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
          </ul>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </main>

      <footer>
        <p>Galactic Squadrons — Proyecto académico.</p>
      </footer>
    </>
  );
}