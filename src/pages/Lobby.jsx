import { Link, useNavigate } from "react-router";
import fighterShip from "../../assets/player/fighter_ship.svg";
import planetImage from "../../assets/planets/planet_earth.png";

import GameModal from "../components/GameModal.jsx";
import "../styles/lobby.css";

export default function Lobby() {
  const navigate = useNavigate();
  
  return (
    <>
      <div className="lobby">
        <section id="lobby-room" className="lobby-room" aria-labelledby="lobby-room-title">
          <header className="lobby-room_header">
            <h1 id="lobby-room-title" className="lobby-room_title">
              Prepara tu escuadrón
            </h1>
            <p id="lobby-room_occupancy" className="lobby-room_occupancy">
              3 de 4 espacios ocupados
            </p>
          </header>

          <ul id="players-list" className="players-list" aria-label="squad-players">
            <li>
              <article aria-labelledby="player-one-title" className="player-card player-card-host">
                <h2 id="player-one-title" className="player-card_name">
                  Jugador 1
                </h2>
      
                <figure className="player-ship-preview">
                  <img
                    className="player-card-ship"
                    src={fighterShip}
                    alt="Nave del rol Cazador"
                    width="96"
                    height="96"
                  />
                </figure>

                <div className="player-card-role">
                  {/* <h3>Rol</h3> */}
                  <label
                    className="player-card-role-label"
                    htmlFor="player-one-role"
                  >
                    Rol
                  </label>
                  <select
                    id="player-one-role"
                    name="player-one-role"
                    className="player-card-role-select"
                  >
                    <option value="cazador">Cazador</option>
                    <option value="guardian">Guardián</option>
                    <option value="especialista">Especialista</option>
                  </select>
                </div>
                
                <div className="player-card-actions">
                  <button
                    type="button"
                    className="player-card-button"
                    onClick={() => navigate("/rules")}
                  >
                    Controles
                  </button>

                  <button
                    type="button"
                    className="player-card-button player-card-button-ready"
                  >
                    Listo
                  </button>

                  <button
                    type="button"
                    className="player-card-button player-card-button-abandon"
                    command="show-modal"
                    commandfor="leave-from-lobby"
                  >
                    Abandonar
                  </button>
                </div>

              </article>
            </li>
            <li>
              <article aria-labelledby="player-two-title" className="player-card">
                <h2 id="player-two-title" className="player-card_name">
                  Jugador 2
                </h2>

                <figure className="player-ship-preview">
                  <img
                    className="player-card-ship"
                    src={fighterShip}
                    alt="Nave del rol Cazador"
                    width="96"
                    height="96"
                  />
                </figure>

                <div className="player-card-role">
                  <label
                    className="player-card-role-label"
                    htmlFor="player-two-role"
                  >
                    Rol
                  </label>
                  <select
                    id="player-two-role"
                    name="player-two-role"
                    className="player-card-role-select"
                  >
                    <option value="cazador">Cazador</option>
                    <option value="guardian">Guardián</option>
                    <option value="especialista">Especialista</option>
                  </select>
                </div>

                <div className="player-card-status">
                  <p>Listo</p>

                  <button 
                    type="button"
                    className="player-card-button player-card-button-expel"
                    aria-label="expel-player-two">
                    Expulsar
                  </button>                  
                </div>
              </article>
            </li>
            <li>
              <article aria-labelledby="player-three-title" className="player-card">
                <h2 id="player-three-title" className="player-card_name">
                  Jugador 3
                </h2>
                <figure className="player-ship-preview">
                  <img
                    className="player-card-ship"
                    src={fighterShip}
                    alt="Nave del rol Cazador"
                    width="96"
                    height="96"
                  />
                </figure>

                <div className="player-card-role">
                  <label
                    className="player-card-role-label"
                    htmlFor="player-three-role"
                  >
                    Rol
                  </label>

                  <select
                    id="player-three-role"
                    name="player-three-role"
                    className="player-card-role-select"
                  >
                    <option value="cazador">Cazador</option>
                    <option value="guardian">Guardián</option>
                    <option value="especialista">Especialista</option>
                  </select>
                </div>

                <div className="player-card-status">
                  <p>En preparación...</p>

                  <button 
                    type="button" 
                    className="player-card-button player-card-button-expel"
                    aria-label="expel-player-three">
                    Expulsar
                  </button>                
                </div>
              </article>
            </li>
            <li>
              <article aria-labelledby="player-four-title" className="player-card player-card-empty">

                <p>Espacio libre</p>
                <button 
                  type="button"
                  className="player-card-button player-card-button-invite"
                >
                  Invitar
                </button>
              </article>
            </li>              
          </ul>

          <footer className="lobby-room_footer">
            <dl className="lobby-room_details">
              <div className="lobby-room_detail">
                <dt>Sala:</dt>
                <dd>GS-001</dd>
              </div>

              <div className="lobby-room_detail">
                <dt>Código:</dt>
                <dd>ABC-123</dd>
              </div>
            </dl>
          </footer>       
        </section>

        <section id="lobby-mission" className="lobby-mission" aria-labelledby="lobby-mission-title">
          <header className="lobby-mission_header">
            <h2 id="lobby-mission-title" className="lobby-mission_title">
              Misión
            </h2>
          </header>

          <figure className="lobby-mission-preview">
            <span
              className="lobby-mission-planet"
              role="img"
              aria-label="Planeta de la misión"
            />
          </figure>

          <dl className="lobby-mission-details">
            <dt>Planeta:</dt>
            <dd>Tierra</dd>

            <dt>Dificultad:</dt>
            <dd>Normal</dd>
          </dl>

          <div className="lobby-mission-actions">
            <button type="button" className="lobby-mission-button lobby-mission-privacy">
              Privada
            </button>  

            <button
              type="button"
              className="lobby-mission-button lobby-mission-play"
              onClick={() => navigate("/game")}
            >
              Jugar
            </button>  
          </div>        
        </section>
      </div>
      

      <GameModal
        id="leave-from-lobby"
        title="¿Abandonar la partida?"
        description="¿Seguro que deseas abandonar la partida y volver al inicio?"
        actions={
          <>
            <button type="button" onClick={() => navigate("/")}>
              Abandonar
            </button>

            <button type="button" command="close" commandfor="leave-from-lobby">
              Cancelar
            </button>
          </>
        }
      />
    </>
  );
}
