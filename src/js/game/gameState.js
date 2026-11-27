import { createPlayerShip } from "./entities/player.js";
import { createPlanet, planetTypes } from "./entities/planet.js";
import { createSpawners } from "./systems/spawnersSystem.js";
import { levels } from "./levels.js";
import { DEFAULT_ROLE, roles } from "./roles.js";

// Crea una partida local. Los datos del lobby son opcionales para permitir
// que el usuario entre directamente a la página de juego.
export function createGameState(setup = {}) {
  const levelId = 1;
  const level = levels[levelId];
  const player = createPlayerShip(setup.id ?? "player-1");

  player.name = setup.name ?? "Jugador 1";
  player.role = Object.hasOwn(roles, setup.role) ? setup.role : DEFAULT_ROLE;

  return {
    levelId,
    phase: "playing",
    localPlayerId: player.id,
    waveCleared: false,
    players: new Map([[player.id, player]]),
    planet: createPlanet(level.planetType),
    enemies: [],
    projectiles: [],
    spawners: createSpawners(level.spawners),
    contacts: new Map(),
  };
}

// Devuelve una copia de los valores visibles en el panel de la partida.
export function getHudSnapshot(state) {
  const { planet } = state;

  return {
    phase: state.phase,
    planet: {
      name: planetTypes[planet.type].name,
      hp: planet.hp,
      maxHp: planet.maxHp,
    },
    players: Array.from(state.players.values(), (player) => ({
      id: player.id,
      name: player.name,
      role: player.role,
      hp: player.hp,
      maxHp: player.maxHp,
      score: player.score,
    })),
  };
}
