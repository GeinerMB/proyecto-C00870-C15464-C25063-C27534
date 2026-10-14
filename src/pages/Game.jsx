import { Link } from "react-router";
import fighterShip from "../../assets/player/fighter_ship.svg";
import shieldShip from "../../assets/player/shield_ship.svg";
import medicShip from "../../assets/player/medic_ship.svg";

export default function Game() {
  return (
    <section id="game" aria-labelledby="game-title">
      <header>
        <h1 id="game-title">Defiende la Tierra</h1>
        <p>Protege el planeta junto con tu escuadrón.</p>
      </header>

      <section aria-labelledby="game-mission-title">
        <h2 id="game-mission-title">Estado de la misión</h2>
        <dl>
          <dt>Planeta</dt>
          <dd>Tierra</dd>

          <dt>Nivel</dt>
          <dd>1 de 5</dd>

          <dt>Vida del planeta</dt>
          <dd>100 de 100</dd>
        </dl>
      </section>

      <section aria-labelledby="game-board-title">
        <h2 id="game-board-title">Zona de juego</h2>
        <p id="game-board-description">
          Escenario de movimiento libre para defender la Tierra de las naves
          enemigas.
        </p>
        <p>¡Jefe en camino!</p>

        <canvas
          id="game-board"
          width="960"
          height="540"
          aria-labelledby="game-board-title"
          aria-describedby="game-board-description"
        >
          <p>
            Tu navegador no admite canvas. El escenario de Galactic Squadrons
            necesita un navegador compatible para mostrar la partida.
          </p>
        </canvas>
      </section>

      <section aria-labelledby="game-squad-title">
        <h2 id="game-squad-title">Estado del escuadrón</h2>

        <ul aria-label="Jugadores del escuadrón">
          <li>
            <article aria-labelledby="game-player-one-title">
              <h3 id="game-player-one-title">Jugador 1</h3>
              <figure>
                <img
                  src={fighterShip}
                  alt="Nave del rol Cazador"
                  width="48"
                  height="48"
                />
              </figure>
              <dl>
                <dt>Rol</dt>
                <dd>Cazador</dd>

                <dt>Puntos</dt>
                <dd>0</dd>

                <dt>Vida</dt>
                <dd>100 de 100</dd>

                <dt>Energía de habilidad</dt>
                <dd>100 de 100</dd>
              </dl>
            </article>
          </li>
          <li>
            <article aria-labelledby="game-player-two-title">
              <h3 id="game-player-two-title">Jugador 2</h3>
              <figure>
                <img
                  src={shieldShip}
                  alt="Nave del rol Guardián"
                  width="48"
                  height="48"
                />
              </figure>
              <dl>
                <dt>Rol</dt>
                <dd>Guardián</dd>

                <dt>Puntos</dt>
                <dd>0</dd>

                <dt>Vida</dt>
                <dd>100 de 100</dd>

                <dt>Energía de habilidad</dt>
                <dd>100 de 100</dd>
              </dl>
            </article>
          </li>
          <li>
            <article aria-labelledby="game-player-three-title">
              <h3 id="game-player-three-title">Jugador 3</h3>
              <figure>
                <img
                  src={medicShip}
                  alt="Nave del rol Especialista"
                  width="48"
                  height="48"
                />
              </figure>
              <dl>
                <dt>Rol</dt>
                <dd>Especialista</dd>

                <dt>Puntos</dt>
                <dd>0</dd>

                <dt>Vida</dt>
                <dd>100 de 100</dd>

                <dt>Energía de habilidad</dt>
                <dd>100 de 100</dd>
              </dl>
            </article>
          </li>
          <li>
            <article aria-labelledby="game-player-four-title">
              <h3 id="game-player-four-title">Jugador 4</h3>
              <figure>
                <img
                  src={fighterShip}
                  alt="Nave del rol Cazador"
                  width="48"
                  height="48"
                />
              </figure>
              <dl>
                <dt>Rol</dt>
                <dd>Cazador</dd>

                <dt>Puntos</dt>
                <dd>0</dd>

                <dt>Vida</dt>
                <dd>100 de 100</dd>

                <dt>Energía de habilidad</dt>
                <dd>100 de 100</dd>
              </dl>
            </article>
          </li>
        </ul>
      </section>

      <footer>
        <button type="button" disabled>
          Pausar partida
        </button>
        <nav aria-label="Opciones de la partida">
          <ul>
            <li>
              <Link to="/rules">Ver controles</Link>
            </li>
            <li>
              <Link to="/lobby">Volver al lobby</Link>
            </li>
            <li>
              <Link to="/scoreboard">Ver marcadores</Link>
            </li>
          </ul>
        </nav>
      </footer>
    </section>
  );
}
