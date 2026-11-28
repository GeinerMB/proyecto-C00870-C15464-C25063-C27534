import { createPlayerShip, moveShip } from "./entities/player.js";
import { createPlanet } from "./entities/planet.js";
import { createEnemy, enemyTypes, shieldTypes, updateEnemies } from "./entities/enemies.js";
import { createPlayerBullet, updatePlayerBullets } from "./entities/playerBullet.js";
import { createInput } from "./systems/inputSystem.js";
import { createRenderer, getPlayerMuzzle } from "./systems/renderSystem.js";
import { createSpawners, updateSpawners } from "./systems/spawnersSystem.js";
import { resolveHits, resolveBeamHits } from "./systems/collisionSystem.js";
import { roles } from "./roles.js";
import { getHudSnapshot } from "./gameState.js";
import { levels } from "./levels.js";
import {
  HUNTER_ABILITY,
  activateAbility,
  isHunterActive,
  isGuardianActive,
  updateAbility,
} from "./systems/abilitySystem.js";

export function startGame(canvas, state, onHudChange) {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.focus();

  const { players, planet, enemies, projectiles, spawners, contacts } = state;
  const playerShip = players.get(state.localPlayerId);
  const spriteUrl = roles[playerShip.role].ship;

  const { render, hitsEnemy, beamTouchesPlayer } = createRenderer(context, spriteUrl, planet);
  const input = createInput(canvas);

  let previousTime = null;
  let frameId;

  function frame(time) {
    const deltaTime = previousTime === null
      ? 0
      : Math.min((time - previousTime) / 1000, 0.5);
    previousTime = time;
    planet.age += deltaTime;

    // Si E y espacio llegan en el mismo fotograma, el disparo ya recibe la mejora
    if (input.consumeAbility()) activateAbility(playerShip);

    const shots = input.consumeShots();
    const oldHp = playerShip.hp;
    const oldScore = playerShip.score;
    const oldPlanetHp = planet.hp;
    const movement = input.readMovement();

    if (playerShip.hp > 0 && shots > 0 && !isGuardianActive(playerShip)) {
      const muzzle = getPlayerMuzzle(canvas, playerShip);
      if (muzzle) {
        const damage = isHunterActive(playerShip) ? HUNTER_ABILITY.bulletDamage : 1;

        for (let i = 0; i < shots; i++) {
          projectiles.push(createPlayerBullet(muzzle, playerShip.id, damage));
        }
      }
    }

    const steps = Math.max(1, Math.ceil(deltaTime * 120));
    const dt = deltaTime / steps;

    for (let i = 0; i < steps; i++) {
      if (playerShip.hp > 0) moveShip(playerShip, movement, dt);
      updateAbility(playerShip, dt);
      updateEnemies(enemies, dt);
      updatePlayerBullets(projectiles, dt, canvas.width);
      updateSpawners(spawners, enemies, dt);
      resolveHits(players, enemies, projectiles, hitsEnemy, contacts, planet);
      resolveBeamHits(players, enemies, beamTouchesPlayer);

      if (planet.hp === 0 || playerShip.hp === 0) {
        state.phase = "defeat";
        break;
      }

      // Se detecta el final de la oleada una sola vez.
      if (!state.waveCleared && enemies.length === 0) {
        const allSpawned = spawners.every(
          (spawner) => spawner.spawned >= spawner.maxEnemies
        );

        if (allSpawned) {
          state.waveCleared = true;
          console.log("Oleada terminada"); // TODO: Eliminar el console log

          const bossType = levels[state.levelId].bossType;
          const config = enemyTypes[bossType];
          const spawnY = (canvas.height - config.frameHeight) / 2;
          const boss = createEnemy(bossType, canvas.width, spawnY);
          boss.isBoss = true;

          boss.spriteScale = 1.5;
          boss.stopX = canvas.width * 0.82;

          if (config.beam) {
            boss.nextBeamHit = new Map();
            const marginY = 200;
            boss.patrol = {
              positions: [marginY, canvas.height / 2, canvas.height - marginY],
              from: 1,
              to: 1,
              cycle: 0,
            };
          }

          if (config.shieldType) {
            boss.shield = {
              type: config.shieldType,
              hp: shieldTypes[config.shieldType].maxHp,
              phase: "pending",
            };
          }
          enemies.push(boss);
        }
      }
    }

    const hudChanged =
      playerShip.hp !== oldHp ||
      playerShip.score !== oldScore ||
      planet.hp !== oldPlanetHp ||
      state.phase !== "playing";

    if (hudChanged) {
      onHudChange(getHudSnapshot(state));
    }

    render(playerShip, enemies, projectiles);

    if (state.phase === "playing") {
      frameId = requestAnimationFrame(frame);
    }
  }

  frameId = requestAnimationFrame(frame);

  return function stopGame() {
    cancelAnimationFrame(frameId);
    input.dispose();
  };
}
