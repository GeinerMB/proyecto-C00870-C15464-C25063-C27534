import { moveShip } from "./entities/player.js";
import { dropMedkit, resolveMedkits } from "./entities/medkit.js";
import { createEnemy, enemyTypes, shieldTypes, updateEnemies } from "./entities/enemies.js";
import { createPlayerBullet, updatePlayerBullets } from "./entities/playerBullet.js";
import { createInput } from "./systems/inputSystem.js";
import { createRenderer, getPlayerMuzzle } from "./systems/renderSystem.js";
import { updateSpawners } from "./systems/spawnersSystem.js";
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
    if (state.phase !== "playing") return;

    const deltaTime = previousTime === null
      ? 0
      : Math.min((time - previousTime) / 1000, 0.5);
    previousTime = time;
    planet.age += deltaTime;

    const oldAbilityPercent = getAbilityPercent(playerShip);
    const oldHp = playerShip.hp;
    let pickupChangedHud = false;

    // Apply the ability before processing shots from the same frame.
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
      if (bossIsDefeated) {
        state.phase = levels[state.levelId + 1] ? "level-complete" : "victory";
        break;
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
    } else {
      input.setEnabled(false);
    }
  }

  if (state.phase === "playing") frameId = requestAnimationFrame(frame);

  function pause() {
    if (state.phase !== "playing") return;
    state.phase = "paused";
    cancelAnimationFrame(frameId);
    input.setEnabled(false);
    previousTime = null;
    onHudChange(getHudSnapshot(state));
  }

  function resume() {
    if (state.phase !== "paused") return;
    state.phase = "playing";
    input.setEnabled(true);
    previousTime = null;
    canvas.focus();
    onHudChange(getHudSnapshot(state));
    frameId = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(frameId);
    input.dispose();
  }

  return { pause, resume, stop };
}
