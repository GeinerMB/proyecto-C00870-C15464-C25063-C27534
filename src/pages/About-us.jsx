import { Link } from "react-router";

export default function AboutUs() {
  return (
    <section id="about-us" aria-labelledby="about-us-title">
      <header>
        <h1 id="about-us-title">Quiénes somos</h1>
        <p>Equipo de Galactic Squadrons.</p>
      </header>

      <section aria-labelledby="about-team-title">
        <h2 id="about-team-title">Integrantes del proyecto</h2>
        <ul>
          <li>Josué Badilla Paredes</li>
          <li>Werner Naranjo Navarro</li>
          <li>Alejandro Solano Barboza</li>
          <li>Geiner Montoya Barrientos</li>
        </ul>
      </section>

      <footer>
        <Link to="/">Volver al inicio</Link>
      </footer>
    </section>
  );
}
