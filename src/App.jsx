import { Link, Route, Routes } from "react-router";
import Home from "./pages/Home.jsx";

export default function App() {
  return (
    <>
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