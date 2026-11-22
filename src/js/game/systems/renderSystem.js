import { enemyTypes } from "../entities/enemies.js";

const PLAYER_SPRITE_SCALE = 0.75;

function loadImage(url) {
  const image = new Image();
  image.src = url;
  return image;
}

function drawPlayer(context, playerShip, sprite) {
  const canvas = context.canvas;

  if (sprite.complete && sprite.naturalWidth > 0) {
    // Obtiene las dimensiones visibles del canvas.
    const viewWidth = canvas.clientWidth;
    const viewHeight = canvas.clientHeight;
  
    if (viewWidth > 0 && viewHeight > 0) {
      const shipScale = Math.min(
        1,
        viewWidth / canvas.width,
        viewHeight / canvas.height,
      ) * PLAYER_SPRITE_SCALE;

      const drawWidth = playerShip.width * shipScale;
      const drawHeight = playerShip.height * shipScale;

      // Posición del jugador dentro de su recorrido lógico.
      const progressX = playerShip.x / (canvas.width - playerShip.width);
      const progressY = playerShip.y / (canvas.height - playerShip.height);

      // Usa el tamaño visible para que la nave siga llegando a los bordes.
      const drawX = progressX * (viewWidth - drawWidth);
      const drawY = progressY * (viewHeight - drawHeight);

      context.save();
      context.scale(canvas.width / viewWidth, canvas.height / viewHeight);
      context.translate(drawX + drawWidth / 2, drawY + drawHeight / 2);
      context.rotate(Math.PI / 2);
      context.drawImage(sprite, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      context.restore();
    }
  }
}

function drawEnemy(context, enemy, image) {
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

export function createRenderer(context, playerSpriteUrl) {
  const playerImage = loadImage(playerSpriteUrl);
  const enemyImages = new Map();

  for (const [type, config] of Object.entries(enemyTypes)) {
    enemyImages.set(type, loadImage(config.spriteUrl));
  }

  return function render(playerShip, enemies) {
    const canvas = context.canvas;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      drawEnemy(context, enemy, enemyImages.get(enemy.type));
    }

    drawPlayer(context, playerShip, playerImage);
  };
}