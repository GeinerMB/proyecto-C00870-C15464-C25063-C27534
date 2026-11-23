import scoutImg from "../../../assets/enemies/enemy_sprites/enemy_scout.png"

export const enemyTypes = {
  scout: {
    spriteUrl: scoutImg,
    frameWidth: 64,
    frameHeight: 37,
    frameCount: 6,
    framesPerSecond: 10,
    velocityX: -40,
    rotation: -Math.PI / 2,
    widthOnBoard: 37, // Ancho horizontal después del giro.
  },
};

export function createEnemy(type, spawnX, spawnY) {
  const config = enemyTypes[type];

  return {
    type,
    x: spawnX + config.frameWidth / 2,
    y: spawnY + config.frameHeight / 2,
    age: 0,
  };
}

export function updateEnemy(enemy, deltaTime) {
  const config = enemyTypes[enemy.type];
  enemy.x += config.velocityX * deltaTime;
  enemy.age += deltaTime;
}

export function isEnemyOnCourse(enemy) {
  const halfWidth = enemyTypes[enemy.type].widthOnBoard / 2;
  return enemy.x + halfWidth > 0;
}

export function updateEnemies(enemies, deltaTime) {
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    updateEnemy(enemy, deltaTime);

    if (!isEnemyOnCourse(enemy)) {
      enemies.splice(i, 1);
    }
  }
}
