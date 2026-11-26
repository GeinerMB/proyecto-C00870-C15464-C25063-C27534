import { Link, useNavigate } from "react-router";
// import fighterShip from "../assets/player/fighter_ship.svg";

import GameModal from "../components/GameModal.jsx";
import PlayerCard from "../components/PlayerCard.jsx";
import "../styles/lobby.css";

export default function Lobby() {
  const navigate = useNavigate();

  const currentPlayerId = "player-1";
  const players = [
    {
      id: "player-1",
      name: "Jugador 1",
      role: "cazador",
      ready: false,
    },
    {
      id: "player-2",
      name: "Jugador 2",
      role: "cazador",
      ready: true,
    },
    {
      id: "player-3",
      name: "Jugador 3",
      role: "guardian",
      ready: false,
    },
  ];
  
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
            {players.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                isCurrentPlayer={player.id === currentPlayerId}
                onControls={() => navigate("/rules")}
                leaveModalId="leave-from-lobby"
              />
            ))}

            <li>
              <article className="player-card player-card-empty">
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
              <span class="privacy-icon" aria-hidden="true"></span>
              <span>Privada</span>
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
