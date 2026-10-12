import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  return (
    <section aria-labelledby="home-title">
      <h1 id="home-title">Galactic Squadrons</h1>
      
      <nav aria-label="Menú principal">
        <ul>
          <li>
            <button type="button" onClick={() => navigate("/lobby")}>
              Jugar
            </button>
          </li>
          <li>
            <button type="button" onClick={() => navigate("/rules")}>
              Instrucciones
            </button>
          </li>
          <li>
            <button type="button" onClick={() => navigate("/scoreboard")}>
              Marcadores
            </button>
          </li>
          <li>
            <button type="button" onClick={() => navigate("/settings")}>
              Configuración
            </button>
          </li>
          <li>
            <button type="button" onClick={() => navigate("/about-us")}>
              Quiénes somos
            </button>
          </li>
        </ul>
      </nav>
    </section>
  );
}