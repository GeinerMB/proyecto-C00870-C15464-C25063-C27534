import { createEnemy } from "../entities/enemies";

export function createSpawners(definitions) {
  return definitions.map((definition) => ({
    ...definition,
    elapsed: 0,
    spawned: 0,
  }));
}

export function updateSpawners(spawners, enemies, deltaTime) {
  for (const spawner of spawners) {
    if (spawner.spawned >= spawner.maxEnemies) continue;

    spawner.elapsed += deltaTime;
    if (spawner.elapsed < spawner.interval) continue;

    enemies.push(createEnemy(spawner.type, spawner.x, spawner.y));
    spawner.spawned += 1;
    spawner.elapsed = 0;
  }
}