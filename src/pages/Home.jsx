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
              <button type="button" className="navigation-button" command="show-modal" commandfor="go-to-lobby">
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
      <dialog id="go-to-lobby" className="game-modal" aria-labelledby="go-lobby-title">
        <div className="game-modal__window">
          <header className="game-modal__header">
            <h2 id="go-lobby-title">
              Comenzar partida
            </h2>

            <button type="button" className="game-modal__close"command="close" commandfor="go-to-lobby">
              Cerrar
            </button>

          </header>

          <div className="game-modal__body">

            <p className="game-modal__question">
              ¿Deseas hostear una partida o unirte a una ya existente?
            </p>

            <p id="go-lobby-description">
              Selecciona una opción para continuar.
            </p>

            <footer className="game-modal__actions">
              <button type="button" onClick={() => navigate("/lobby")}>
                Hostear partida
              </button>
              <button type="button" onClick={() => navigate("/lobby")}>
                Unirse a partida
              </button>
            </footer>             
          </div>
        </div>
      </dialog>
    </>
  );
}