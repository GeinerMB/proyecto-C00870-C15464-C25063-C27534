import scoutImg from "../../../assets/enemies/enemy_sprites/enemy_scout.png"

export const enemyTypes = {
  scout: {
    spriteUrl: scoutImg,
    frameWidth: 64,
    frameHeight: 37,
    frameCount: 6,
    framesPerSecond: 10,
    velocityX: -75,
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

export function drawEnemy(context, enemy, image) {
  if (!image.complete || image.naturalWidth === 0) return;

  const config = enemyTypes[enemy.type];
  const { frameWidth, frameHeight } = config;
  const frame = Math.floor(enemy.age * config.framesPerSecond) % config.frameCount;

  const canvas = context.canvas;
    const scaleX = canvas.clientWidth / canvas.width;
    const scaleY = canvas.clientHeight / canvas.height;
    if (scaleX === 0 || scaleY === 0) return;

    // Mismo criterio que el jugador: reducir uniformemente y limitar la escala a 1.
    const spriteScale = Math.min(1, scaleX, scaleY);

    context.save();
    context.translate(enemy.x, enemy.y);
    context.scale(spriteScale / scaleX, spriteScale / scaleY);
    context.rotate(config.rotation);

    context.drawImage(
    image,
    frame * frameWidth, 0, frameWidth, frameHeight,
    -frameWidth / 2, -frameHeight / 2, frameWidth, frameHeight,
    );

    context.restore();
}