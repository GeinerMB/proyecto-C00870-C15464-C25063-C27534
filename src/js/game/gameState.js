import { createPlayerShip } from "./entities/player.js";
import { createPlanet, planetTypes } from "./entities/planet.js";
import { levels } from "./levels.js";
import { DEFAULT_ROLE, roles } from "./roles.js";
import { shieldTypes } from "./entities/enemies.js";
import { createSpawners } from "./systems/spawnersSystem.js";
import { getAbilityPercent } from "./systems/abilitySystem.js";
import { createGameSession } from "./gameSession.js";

// Crea una partida local. Los datos del lobby son opcionales para permitir
// que el usuario entre directamente a la página de juego.
export function createGameState(
  setup = {},
  progress = createGameSession(setup),
  attemptId = crypto.randomUUID(),
) {
  const levelId = Object.hasOwn(levels, progress.levelId) ? progress.levelId : 1;
  const level = levels[levelId];
  const players = new Map(progress.players.map((entry) => {
    const player = createPlayerShip(entry.id);
    player.name = entry.name;
    player.role = Object.hasOwn(roles, entry.role) ? entry.role : DEFAULT_ROLE;
    player.score = Number.isSafeInteger(entry.score) && entry.score >= 0 ? entry.score : 0;
    return [player.id, player];
  }));

  return {
    levelId,
    attemptId,
    session: {
      ...progress,
      players: Array.from(players.values(), ({ id, name, role, score }) => ({ id, name, role, score })),
    },
    phase: "playing",
    localPlayerId: progress.localPlayerId,
    waveCleared: false,
    bossIncoming: false,
    players,
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
