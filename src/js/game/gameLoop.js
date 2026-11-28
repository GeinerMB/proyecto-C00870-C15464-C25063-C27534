import { createPlayerShip, moveShip } from "./entities/player.js";
import { createPlanet } from "./entities/planet.js";
import { dropMedkit, resolveMedkits } from "./entities/medkit.js";
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
  SPECIALIST_ABILITY,
  activateAbility,
  isHunterActive,
  isGuardianActive,
  updateAbility,
  getAbilityPercent,
} from "./systems/abilitySystem.js";

export function startGame(canvas, state, onHudChange) {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.focus();

  const { players, planet, enemies, projectiles, spawners, contacts, medkits } = state;
  const playerShip = players.get(state.localPlayerId);
  const spriteUrl = roles[playerShip.role].ship;

  const { render, hitsEnemy, beamTouchesPlayer, touchesMedkit } =
    createRenderer(context, spriteUrl, planet);
    
  const input = createInput(canvas);

  let previousTime = null;
  let frameId;

  function frame(time) {
    const deltaTime = previousTime === null
      ? 0
      : Math.min((time - previousTime) / 1000, 0.5);
    previousTime = time;
    planet.age += deltaTime;

    const oldAbilityPercent = getAbilityPercent(playerShip);
    const oldHp = playerShip.hp;
    let pickupChangedHud = false;

    // Si E y espacio llegan en el mismo fotograma, el disparo ya recibe la mejora
    if (input.consumeAbility() && activateAbility(playerShip)) {
      if (playerShip.role === "especialista") {
        dropMedkit(playerShip, medkits, SPECIALIST_ABILITY.dropHealFraction);
      }
    }

    const shots = input.consumeShots();
    
    const oldScore = playerShip.score;
    const oldPlanetHp = planet.hp;
    const oldLevelId = state.levelId;
    const oldBossIncoming = state.bossIncoming;
    const bossType = levels[state.levelId]?.bossType;
    const oldBoss = enemies.find((enemy) => enemy.type === bossType);
    const oldBossHp = oldBoss?.hp;
    const oldBossShieldHp = oldBoss?.shield?.hp;
    const oldBossShieldPhase = oldBoss?.shield?.phase;
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

      for (const ship of players.values()) {
        ship.healFxRemaining = Math.max(0, ship.healFxRemaining - dt);
      }

      if (playerShip.hp > 0) moveShip(playerShip, movement, dt);
      updateAbility(playerShip, dt);
      updateEnemies(enemies, dt);
      updatePlayerBullets(projectiles, dt, canvas.width);
      updateSpawners(spawners, enemies, dt);

      // Se procesan los contactos con los botiquines
      if (resolveMedkits(medkits, players, touchesMedkit, SPECIALIST_ABILITY.pickupHealFraction)) {
        pickupChangedHud = true;
      }

      resolveHits(players, enemies, projectiles, hitsEnemy, contacts, planet);
      resolveBeamHits(players, enemies, beamTouchesPlayer);

      const allSpawned = spawners.every(
        (spawner) => spawner.spawned >= spawner.maxEnemies
      );
      if (!state.waveCleared && allSpawned && enemies.length > 0) {
        state.bossIncoming = true;
      }

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
          state.bossIncoming = false;
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

      const activeBossType = levels[state.levelId]?.bossType;
      const bossIsDefeated = state.waveCleared
        && activeBossType
        && !enemies.some((enemy) => enemy.type === activeBossType);
      const nextLevelId = state.levelId + 1;
      const nextLevel = levels[nextLevelId];

      if (bossIsDefeated) {
        if (nextLevel) {
          state.levelId = nextLevelId;
          state.waveCleared = false;
          state.bossIncoming = false;
          spawners.splice(0, spawners.length, ...createSpawners(nextLevel.spawners));
          projectiles.length = 0;
          medkits.length = 0
          contacts.clear();
        } else {
          state.phase = "victory";
          break;
        }
      }
    }

    const currentBoss = enemies.find((enemy) => enemy.type === bossType);
    const hudChanged =
      pickupChangedHud ||
      getAbilityPercent(playerShip) !== oldAbilityPercent ||
      playerShip.hp !== oldHp ||
      playerShip.score !== oldScore ||
      planet.hp !== oldPlanetHp ||
      state.levelId !== oldLevelId ||
      state.bossIncoming !== oldBossIncoming ||
      oldBossHp !== currentBoss?.hp ||
      oldBossShieldHp !== currentBoss?.shield?.hp ||
      oldBossShieldPhase !== currentBoss?.shield?.phase ||
      state.phase !== "playing";

    if (hudChanged) {
      onHudChange(getHudSnapshot(state));
    }

    render(playerShip, enemies, projectiles, medkits, players);

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
