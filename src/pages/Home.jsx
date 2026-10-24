import { useNavigate } from "react-router";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <section className="home" aria-labelledby="home-title">
        <h1 id="home-title" className="home_title">Galactic Squadrons</h1>
        
        <nav aria-label="Menú principal">
          <ul>
            <li>
              <button type="button" command="show-modal" commandfor="go-to-lobby">
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
              <button type="button" onClick={() => navigate("/settings")} disabled>
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
      <dialog id="go-to-lobby" aria-labelledby="go-lobby-title">
        <header>
          <h2 id="go-lobby-title">
            Deseas hostear una partida o unirte a una ya existente?
          </h2>
        </header>
        <p id="go-lobby-description">
          Selecciona una opción para continuar.
        </p>
        <footer>
          <button type="button" onClick={() => navigate("/lobby")}>
            Hostear partida
          </button>
          <button type="button" onClick={() => navigate("/lobby")}>
            Unirse a partida
          </button>
        </footer>
      </dialog>
    </>
  );
}