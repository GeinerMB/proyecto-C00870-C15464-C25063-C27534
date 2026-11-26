import { Link, useLocation } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createGameState, getHudSnapshot } from "../js/game/gameState.js";
import { roles } from "../js/game/roles.js";

import { startGame } from "../js/game/gameLoop.js";

import fighterShip from "../assets/player/fighter_ship.svg";
import shieldShip from "../assets/player/shield_ship.svg";
import medicShip from "../assets/player/medic_ship.svg";
import healthIcon from "../assets/ui/icons/status_health.png";
import energyIcon from "../assets/ui/icons/status_energy.png";
import "../styles/game.css";

const squad = [
  { id: "one", number: 1, role: "Cazador", ship: fighterShip },
  { id: "two", number: 2, role: "Guardián", ship: shieldShip },
  { id: "three", number: 3, role: "Especialista", ship: medicShip },
  { id: "four", number: 4, role: "Cazador", ship: fighterShip },
];

// El icono distingue cada recurso; el nombre y el valor siguen siendo accesibles.
function ResourceMeter({ label, value, variant, icon }) {
  return (
    <div className={`game-meter game-meter-${variant}`}>
      <img src={icon} alt="" width="20" height="20" />
      <span
        className="game-meter-track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={`${value} de 100`}
      >
        <span className="game-meter-fill" style={{ width: `${value}%` }} />
      </span>
    </div>
  );
}

function PlayerCard({ player }) {
  return (
    <article className="game-player" aria-labelledby={`game-player-${player.id}-title`}>
      <header className="game-player-header">
        <h3 id={`game-player-${player.id}-title`}>Jugador {player.number}</h3>
        <p className="game-player-score"><span className="game-visually-hidden">Puntos: </span>0</p>
      </header>
      <div className="game-player-body">
        <img
          className="game-player-ship"
          src={player.ship}
          alt={`Nave del rol ${player.role}`}
          width="48"
          height="48"
        />
        <div className="game-player-resources">
          <ResourceMeter label={`Vida del jugador ${player.number}`} value={100} variant="health" icon={healthIcon} />
          <ResourceMeter label={`Energía del jugador ${player.number}`} value={100} variant="energy" icon={energyIcon} />
        </div>
      </div>
    </article>
  );
}

export default function Game() {
  const location = useLocation();

  return (
    <LocalGame
      key={location.key}
      setup={location.state?.player}
    />
  );
}

function LocalGame({ setup }) {
  const canvasRef = useRef(null);
  const [gameState] = useState(() => createGameState(setup));
  const [hud, setHud] = useState(() => getHudSnapshot(gameState));

  useEffect(() => {
    return startGame(canvasRef.current, gameState, setHud);
  }, [gameState]);

  return (
    <section id="game" className="game" aria-labelledby="game-title">
      <h1 id="game-title" className="game-visually-hidden">Defiende la Tierra</h1>
      <section className="game-board" aria-labelledby="game-board-title">
        <h2 id="game-board-title" className="game-visually-hidden">Zona de juego</h2>
        <p id="game-board-description" className="game-visually-hidden">
          Vista previa del escenario: la Tierra a la izquierda, cuatro naves
          aliadas en formación y una nave enemiga a la derecha.
        </p>
        <div className="game-board-notice">
          <span aria-hidden="true">⚠</span> ¡Jefe en camino!
        </div>
        <details className="game-menu">
          <summary><span aria-hidden="true">☰</span> Opciones</summary>
          <nav aria-label="Opciones de la partida">
            <Link to="/rules">Ver controles</Link>
            <Link to="/lobby">Volver al lobby</Link>
            <Link to="/scoreboard">Ver marcadores</Link>
          </nav>
        </details>
        
        <div className="game-planet">
          <div className="game-planet-health">
            <ResourceMeter label="Vida del planeta Tierra" value={100} variant="health" icon={healthIcon} />
          </div>
        </div>
        <canvas
          ref={canvasRef}
          id="game-board"
          width="1280" // 960 original
          height="720" // 540 original
          tabIndex={0}
          onPointerDown={(event) => event.currentTarget.focus()}
          aria-labelledby="game-board-title"
          aria-describedby="game-board-description"
        >
          <p>
            Enfoca el tablero y usa WASD o las flechas para mover tu nave
          </p>
        </canvas>
      </section>

      <section className="game-squad" aria-labelledby="game-squad-title">
        <h2 id="game-squad-title" className="game-visually-hidden">Estado del escuadrón</h2>
        <ul className="game-squad-list" aria-label="Jugadores del escuadrón">
          {squad.map((player) => <li key={player.id}><PlayerCard player={player} /></li>)}
        </ul>
      </section>
    </section>
  );
}
