import { createPlayerShip, moveShip } from "./entities/player.js";
import { updateEnemies } from "./entities/enemies.js";
import { createPlayerBullet, updatePlayerBullets } from "./entities/playerBullet.js";
import { createInput } from "./systems/inputSystem.js";
import { createRenderer, getPlayerMuzzle } from "./systems/renderSystem.js";
import { createSpawners, updateSpawners } from "./systems/spawnersSystem.js";
import { levels } from "./levels.js";

export function startGame(canvas, playerSpriteUrl, levelId = 1) {
  const context = canvas.getContext("2d");
  if (!context) return;

  canvas.focus();

  const playerShip = createPlayerShip();
  const projectiles = []
  const enemies = [];
  const spawners = createSpawners(levels[levelId].spawners);
  const render = createRenderer(context, playerSpriteUrl);
  const input = createInput(canvas);

  let previousTime = null;
  let frameId;

  function frame(time) {
    const deltaTime = previousTime === null
      ? 0
      : Math.min((time - previousTime) / 1000, 0.5);
    previousTime = time;

    moveShip(playerShip, input.readMovement(), deltaTime);
    updateEnemies(enemies, deltaTime);
    updatePlayerBullets(projectiles, deltaTime, canvas.width);

    const shots = input.consumeShots();

    if (shots > 0) {
      const muzzle = getPlayerMuzzle(canvas, playerShip);

      if (muzzle) {
        for (let i = 0; i < shots; i++) {
          projectiles.push(createPlayerBullet(muzzle));
        }
      }
    }

    render(playerShip, enemies, projectiles);
    updateSpawners(spawners, enemies, deltaTime);

    frameId = requestAnimationFrame(frame);
  }

  frameId = requestAnimationFrame(frame);

  return function stopGame() {
    cancelAnimationFrame(frameId);
    input.dispose();
  };
}
