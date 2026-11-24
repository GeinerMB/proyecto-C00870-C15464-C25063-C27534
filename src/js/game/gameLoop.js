import { createPlayerShip, moveShip } from "./entities/player.js";
import { createPlanet } from "./entities/planet.js";
import { updateEnemies } from "./entities/enemies.js";
import { createPlayerBullet, updatePlayerBullets } from "./entities/playerBullet.js";
import { createInput } from "./systems/inputSystem.js";
import { createRenderer, getPlayerMuzzle } from "./systems/renderSystem.js";
import { createSpawners, updateSpawners } from "./systems/spawnersSystem.js";
import { resolveHits } from "./systems/collisionSystem.js";
import { levels } from "./levels.js";

export function startGame(canvas, playerSpriteUrl, levelId = 1, onPlayerChange = () => {}) {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.focus();

  const planet = createPlanet(levels[levelId].planetType)
  const playerShip = createPlayerShip();
  const players = new Map([[playerShip.id, playerShip]]);
  const contacts = new Map();
  const projectiles = []
  const enemies = [];
  const spawners = createSpawners(levels[levelId].spawners);
  const { render, hitsEnemy } = createRenderer(context, playerSpriteUrl, planet);
  const input = createInput(canvas);

  let previousTime = null;
  let frameId;

  function frame(time) {
    const deltaTime = previousTime === null
      ? 0
      : Math.min((time - previousTime) / 1000, 0.5);
    previousTime = time;
    planet.age += deltaTime;

    const shots = input.consumeShots();
    const oldHp = playerShip.hp;
    const oldScore = playerShip.score;
    const movement = input.readMovement();

    if (playerShip.hp > 0 && shots > 0) {
      const muzzle = getPlayerMuzzle(canvas, playerShip);
      if (muzzle) {
        for (let i = 0; i < shots; i++) {
          projectiles.push(createPlayerBullet(muzzle, playerShip.id));
        }
      }
    }

    const steps = Math.max(1, Math.ceil(deltaTime * 120));
    const dt = deltaTime / steps;

    for (let i = 0; i < steps; i++) {
      if (playerShip.hp > 0) moveShip(playerShip, movement, dt);
      updateEnemies(enemies, dt);
      updatePlayerBullets(projectiles, dt, canvas.width);
      updateSpawners(spawners, enemies, dt);
      resolveHits(players, enemies, projectiles, hitsEnemy, contacts, planet);
    }

    if (playerShip.hp !== oldHp || playerShip.score !== oldScore) {
      onPlayerChange({
        id: playerShip.id,
        hp: playerShip.hp,
        maxHp: playerShip.maxHp,
        score: playerShip.score,
      });
    }

    render(playerShip, enemies, projectiles);
    frameId = requestAnimationFrame(frame);
  }

  frameId = requestAnimationFrame(frame);

  return function stopGame() {
    cancelAnimationFrame(frameId);
    input.dispose();
  };
}
