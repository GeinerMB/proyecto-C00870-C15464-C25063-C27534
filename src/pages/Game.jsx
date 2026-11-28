import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useRef, useState } from "react";
import { createGameState, getHudSnapshot } from "../js/game/gameState.js";
import { roles } from "../js/game/roles.js";
import GameModal from "../components/GameModal.jsx";

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
function ResourceMeter({ label, value, maxValue = 100, variant, icon }) {
  const safeMaxValue = Math.max(0, maxValue);
  const safeValue = Math.max(0, Math.min(value, safeMaxValue));
  const percentage = safeMaxValue > 0 ? (safeValue / safeMaxValue) * 100 : 0;

  return (
    <div className={`game-meter game-meter-${variant}`}>
      <img src={icon} alt="" width="20" height="20" />
      <span
        className="game-meter-track"
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={safeMaxValue}
        aria-valuenow={safeValue}
        aria-valuetext={`${safeValue} de ${safeMaxValue}`}
      >
        <span className="game-meter-fill" style={{ width: `${percentage}%` }} />
      </span>
    </div>
  );
}

function PlayerCard({ slot, player }) {
  const selectedRole = player ? roles[player.role] : null;
  const ship = selectedRole?.ship ?? slot.ship;
  const roleLabel = selectedRole?.label ?? slot.role;
  const statusClass = !player
    ? "game-player-inactive"
    : player.hp > 0
      ? "game-player-active"
      : "game-player-eliminated";

  return (
    <article className={`game-player ${statusClass}`} aria-labelledby={`game-player-${slot.number}-title`}>
      <header className="game-player-header">
        <h3 id={`game-player-${slot.number}-title`}>
          {player?.name ?? `Jugador ${slot.number}`}
        </h3>
        <p className="game-player-score">
          <span className="game-visually-hidden">Puntos: </span>
          {player?.score ?? "—"}
        </p>
      </header>
      <div className="game-player-body">
        <img
          className="game-player-ship"
          src={ship}
          alt={`Nave del rol ${roleLabel}`}
          width="48"
          height="48"
        />
        <div className="game-player-resources">
          {player ? (
            <>
              <ResourceMeter
                label={`Vida de ${player.name}`}
                value={player.hp}
                maxValue={player.maxHp}
                variant="health"
                icon={healthIcon}
              />
              {Number.isFinite(player.energy) && Number.isFinite(player.maxEnergy) && (
                <ResourceMeter
                  label={`Energía de ${player.name}`}
                  value={player.energy}
                  maxValue={player.maxEnergy}
                  variant="energy"
                  icon={energyIcon}
                />
              )}
            </>
          ) : (
            <span className="game-player-status">Inactivo</span>
          )}
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
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const defeatDialogRef = useRef(null);
  const victoryDialogRef = useRef(null);
  const [gameState] = useState(() => createGameState(setup));
  const [hud, setHud] = useState(() => getHudSnapshot(gameState));
  const activePlayer = hud.players.find(({ id }) => id === gameState.localPlayerId);
  const defeatReason = hud.planet.hp === 0
    ? `El planeta ${hud.planet.name} se quedó sin puntos de vida.`
    : `La nave de ${activePlayer?.name ?? "tu jugador"} se quedó sin puntos de vida.`;

  useEffect(() => {
    return startGame(canvasRef.current, gameState, setHud);
  }, [gameState]);

  useEffect(() => {
    const dialog = defeatDialogRef.current;
    if (!dialog) return undefined;

    if (hud.phase === "defeat" && !dialog.open) {
      dialog.showModal();
    } else if (hud.phase !== "defeat" && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [hud.phase]);

  useEffect(() => {
    const dialog = victoryDialogRef.current;
    if (!dialog) return undefined;

    if (hud.phase === "victory" && !dialog.open) {
      dialog.showModal();
    } else if (hud.phase !== "victory" && dialog.open) {
      dialog.close();
    }

    return () => {
      if (dialog.open) dialog.close();
    };
  }, [hud.phase]);

  return (
    <section id="game" className="game" aria-labelledby="game-title">
      <h1 id="game-title" className="game-visually-hidden">Defiende {hud.planet.name}</h1>
      <section className="game-board" aria-labelledby="game-board-title">
        <h2 id="game-board-title" className="game-visually-hidden">Zona de juego</h2>
        <p id="game-board-description" className="game-visually-hidden">
          Nivel {hud.levelId}: protege el planeta {hud.planet.name} de las naves enemigas.
        </p>
        {(hud.bossIncoming || hud.boss) && (
          <div className="game-board-notice" role="status" aria-live="polite">
            <span aria-hidden="true">⚠</span>
            {hud.boss ? "¡Jefe en combate!" : "¡Jefe en camino!"}
          </div>
        )}
        <div
          key={hud.levelId}
          className="game-level-announcement"
          role="status"
          aria-live="polite"
        >
          <span>GALACTIC SQUADRONS</span>
          <strong>NIVEL {hud.levelId}</strong>
          <span>{hud.planet.name}</span>
        </div>
        {hud.boss && (
          <div className="game-boss-status" aria-label="Estado del jefe">
            <strong>Jefe</strong>
            <ResourceMeter
              label="Vida del jefe"
              value={hud.boss.hp}
              maxValue={hud.boss.maxHp}
              variant="boss"
              icon={healthIcon}
            />
            {hud.boss.shield && hud.boss.shield.phase !== "broken" && (
              <ResourceMeter
                label="Escudo del jefe"
                value={hud.boss.shield.hp}
                maxValue={hud.boss.shield.maxHp}
                variant="energy"
                icon={energyIcon}
              />
            )}
          </div>
        )}
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
            <span className="game-planet-name">{hud.planet.name}</span>
            <ResourceMeter
              label={`Vida del planeta ${hud.planet.name}`}
              value={hud.planet.hp}
              maxValue={hud.planet.maxHp}
              variant="health"
              icon={healthIcon}
            />
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
          {squad.map((slot, index) => {
            const player = index === 0
              ? hud.players.find(({ id }) => id === gameState.localPlayerId)
              : null;

            return (
              <li key={slot.id}>
                <PlayerCard slot={slot} player={player} />
              </li>
            );
          })}
        </ul>
      </section>
      <GameModal
        id="game-defeat-modal"
        className="game-modal--defeat"
        dialogRef={defeatDialogRef}
        onCancel={(event) => event.preventDefault()}
        title="¡Perdiste!"
        description={defeatReason}
        actions={
          <>
            <button type="button" onClick={() => navigate("/lobby")}>
              Volver al lobby
            </button>
            <button type="button" onClick={() => navigate("/")}>
              Volver al inicio
            </button>
          </>
        }
      >
        <div className="game-defeat-content">
          <span className="game-defeat-icon" aria-hidden="true">×</span>
          <p className="game-defeat-summary">La partida ha terminado</p>
          <p className="game-defeat-score">
            Puntaje final: <strong>{activePlayer?.score ?? 0}</strong>
          </p>
        </div>
      </GameModal>
      <GameModal
        id="game-victory-modal"
        className="game-modal--victory"
        dialogRef={victoryDialogRef}
        onCancel={(event) => event.preventDefault()}
        title="¡Victoria!"
        description="Derrotaste al jefe del nivel 3 y salvaste el planeta."
        actions={
          <>
            <button type="button" onClick={() => navigate("/lobby")}>
              Volver al lobby
            </button>
            <button type="button" onClick={() => navigate("/")}>
              Volver al inicio
            </button>
          </>
        }
      >
        <div className="game-victory-content">
          <span className="game-victory-icon" aria-hidden="true">✓</span>
          <p className="game-victory-summary">¡El planeta está a salvo!</p>
          <p className="game-defeat-score">
            Puntaje final: <strong>{activePlayer?.score ?? 0}</strong>
          </p>
        </div>
      </GameModal>
    </section>
  );
}
