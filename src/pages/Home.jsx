import { useNavigate } from "react-router";

import GameModal from "../components/GameModal.jsx";
import "../styles/home.css";

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

        <div className="home_background" aria-hidden="true">
          <span className="home_player" />
          {/* Dos enemigos independientes */}
          <span className="home_enemy_scout home_enemy_scout--one" />
          <span className="home_enemy_explosion home_enemy_explosion--one" />
          <span className="home_enemy_scout home_enemy_scout--two" />
          <span className="home_enemy_explosion home_enemy_explosion--two" />

          {/* Ataque contra el primer enemigo */}
          <span className="home_player_bullet home_player_bullet--miss-one" />
          <span className="home_player_bullet home_player_bullet--miss-two" />
          <span className="home_player_bullet home_player_bullet--hit-one" />

          {/* Ataque contra el segundo enemigo */}
          <span className="home_player_bullet home_player_bullet--miss-three" />
          <span className="home_player_bullet home_player_bullet--miss-four" />
          <span className="home_player_bullet home_player_bullet--hit-two" />
        </div>
      </section>

      <GameModal
        id="go-to-lobby"
        title="Comenzar partida"
        description="Selecciona una opción para continuar."
        actions={
          <>
            <button type="button" onClick={() => navigate("/lobby")}>
              Hostear partida
            </button>

            <button type="button" onClick={() => navigate("/lobby")}>
              Unirse a partida
            </button>

            <button type="button" command="close" commandfor="go-to-lobby">
              Cancelar
            </button>
          </>
        }
      >
        <p className="game-modal__question">
          ¿Deseas hostear una partida o unirte a una ya existente?
        </p>
      </GameModal>
    </>
  );
}