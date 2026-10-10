import { Link, useNavigate } from "react-router";
import fighterShip from "../../assets/player/fighter_ship.svg";

export default function Lobby() {
  const navigate = useNavigate();
  
  return (
    <>
      <section id="lobby-room" aria-labelledby="lobby-room">
        <header>
          <h1 id="lobby-room-title">Prepara tu escuadrón</h1>
          <p>3 de 4 espacios ocupados</p>
        </header>

        <ul id="players-list" aria-label="squad-players">
          <li>
            <article aria-labelledby="player-one-title">
              <h2 id="player-one-title">Jugador 1</h2>
    
              <figure>
                <img
                  src={fighterShip}
                  alt="Nave del rol Cazador"
                  width="96"
                  height="96"
                />
              </figure>

              <h3>Rol</h3>
              <select
                id="player-one-role"
                name="player-one-role"
              >
                <option value="cazador">Cazador</option>
                <option value="guardian">Guardián</option>
                <option value="especialista">Especialista</option>
              </select>

              <button type="button" onClick={() => navigate("/rules")} >
                Controles
              </button>

              <button type="button">
                Listo
              </button>

              <button type="button" onClick={() => navigate("/")}>
                Abandonar
              </button>              

            </article>
          </li>
          <li>
            <article aria-labelledby="player-two-title">
              <h2 id="player-two-title">Jugador 2</h2>

              <figure>
                <img
                  src={fighterShip}
                  alt="Nave del rol Cazador"
                  width="96"
                  height="96"
                />
              </figure>

              <h3>Rol</h3>
              <select
                id="player-two-role"
                name="player-two-role"
              >
                <option value="cazador">Cazador</option>
                <option value="guardian">Guardián</option>
                <option value="especialista">Especialista</option>
              </select>

              <p>Listo</p>

              <button type="button" aria-label="expel-player-two">
                Expulsar
              </button>                  
            </article>
          </li>
          <li>
            <article aria-labelledby="player-three-title">
              <h2 id="player-three-title">Jugador 3</h2>
              <figure>
                <img
                  src={fighterShip}
                  alt="Nave del rol Cazador"
                  width="96"
                  height="96"
                />
              </figure>

              <h3>Rol</h3>

              <select
                id="player-three-role"
                name="player-three-role"
              >
                <option value="cazador">Cazador</option>
                <option value="guardian">Guardián</option>
                <option value="especialista">Especialista</option>
              </select>

              <p>En preparación...</p>

              <button type="button" aria-label="expel-player-three">
                Expulsar
              </button>                
            </article>
          </li>
          <li>
            <article aria-labelledby="player-four-title">
              <h2 id="player-four-title">Jugador 4</h2>

              <p>Espacio libre</p>
              <button type="button">
                Invitar
              </button>
            </article>
          </li>              
        </ul>

        <footer>
          <dl>
            <dt>Sala</dt>
            <dd>GS-001</dd>

            <dt>Código</dt>
            <dd>ABC-123</dd>
          </dl>
        </footer>        
      </section>

      <section id="lobby-mission" aria-labelledby="lobby-mission-title">
        <header>
          <h2 id="lobby-mission-title">Misión</h2>
        </header>


      </section>
    </>
  );
}