import { createPlayerShip } from "./entities/player.js";
import { createPlanet, planetTypes } from "./entities/planet.js";
import { levels } from "./levels.js";
import { DEFAULT_ROLE, roles } from "./roles.js";
import { shieldTypes } from "./entities/enemies.js";
import { createSpawners } from "./systems/spawnersSystem.js";
import { getAbilityPercent } from "./systems/abilitySystem.js";

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
    bossIncoming: false,
    players: new Map([[player.id, player]]),
    planet: createPlanet(level.planetType),
    enemies: [],
    projectiles: [],
    medkits: [],
    spawners: createSpawners(level.spawners),
    contacts: new Map(),
  };
}

// Devuelve una copia de los valores visibles en el panel de la partida.
export function getHudSnapshot(state) {
  const { planet } = state;
  const bossType = levels[state.levelId]?.bossType;
  const boss = state.enemies.find((enemy) => enemy.type === bossType);

  return {
    phase: state.phase,
    levelId: state.levelId,
    bossIncoming: state.bossIncoming,
    planet: {
      name: planetTypes[planet.type].name,
      hp: planet.hp,
      maxHp: planet.maxHp,
    },
    boss: boss ? {
      type: boss.type,
      hp: boss.hp,
      maxHp: boss.maxHp,
      shield: boss.shield ? {
        hp: boss.shield.hp,
        maxHp: shieldTypes[boss.shield.type].maxHp,
        phase: boss.shield.phase,
      } : null,
    } : null,
    players: Array.from(state.players.values(), (player) => ({
      id: player.id,
      name: player.name,
      role: player.role,
      hp: player.hp,
      maxHp: player.maxHp,
      score: player.score,
      abilityPercent: getAbilityPercent(player),
    })),
  };
}
