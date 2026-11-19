import { Link } from "react-router"; 
import { useEffect, useRef } from "react";

import { createPlayerShip, moveShip } from "../game/movement.js";

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
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    if (!context) return;

    const playerShip = createPlayerShip();
    const sprite = new Image();
    sprite.src = fighterShip;

    const pressedKeys = new Set();
    const movementKeys = [
      "KeyW", "KeyA", "KeyS", "KeyD",
      "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight",
    ];

    function handleKeyDown(event) {
      if (!movementKeys.includes(event.code)) return;

      event.preventDefault();
      pressedKeys.add(event.code);
    }

    function handleKeyUp(event) {
      pressedKeys.delete(event.code);
    }

    function clearKeys() {
      pressedKeys.clear();
    }

    let prevTime = null;
    let frameId;

    function frame(time) {
      const deltaTime = prevTime === null ? 0 : Math.min((time - prevTime) / 1000, 0.5);
      prevTime = time;

      moveShip(playerShip, {
        arriba: pressedKeys.has("KeyW") || pressedKeys.has("ArrowUp"),
        abajo: pressedKeys.has("KeyS") || pressedKeys.has("ArrowDown"),
        izquierda: pressedKeys.has("KeyA") || pressedKeys.has("ArrowLeft"),
        derecha: pressedKeys.has("KeyD") || pressedKeys.has("ArrowRight"),
      }, deltaTime);
      
      context.clearRect(0, 0, canvas.width, canvas.height);

      if (sprite.complete && sprite.naturalWidth > 0) {
        context.save();
        context.translate(playerShip.x + playerShip.width / 2, playerShip.y + playerShip.height / 2);
        context.rotate(Math.PI / 2);
        context.drawImage(sprite, -playerShip.width / 2, -playerShip.height / 2, playerShip.width, playerShip.height);
        context.restore();
      }

      frameId = requestAnimationFrame(frame);
    }

    canvas.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("keyup", handleKeyUp);
    canvas.addEventListener("blur", clearKeys);
    window.addEventListener("blur", clearKeys);

    frameId = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("keyup", handleKeyUp);
      canvas.removeEventListener("blur", clearKeys);
      window.removeEventListener("blur", clearKeys);
    };
  }, []);

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

        {/* Composición decorativa; el canvas queda disponible para la lógica de juego. */}
        {/* <div className="game-scene" aria-hidden="true">
          {squad.map((player) => (
            <span key={player.id} className={`game-scene-ally game-scene-ally-${player.number}`}>
              <img src={player.ship} alt="" width="48" height="48" />
              <span>P{player.number}</span>
            </span>
          ))}
          <span className="game-scene-boss" />
          <span className="game-scene-asteroid game-scene-asteroid-one" />
          <span className="game-scene-asteroid game-scene-asteroid-two" />
          <span className="game-scene-medkit" />
        </div> */}
        
        <div className="game-planet">
          <span className="game-scene-earth" aria-hidden="true" />
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
