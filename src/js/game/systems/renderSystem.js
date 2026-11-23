import { enemyTypes } from "../entities/enemies.js";
import playerBulletSpriteUrl from "../../../assets/player/player_bullet.png";

const PLAYER_SPRITE_SCALE = 0.75;
const ENEMY_SPRITE_SCALE = 1.25;

function loadImage(url) {
  const image = new Image();
  image.src = url;
  return image;
}

function getPlayerLayout(canvas, ship) {
  const viewWidth = canvas.clientWidth;
  const viewHeight = canvas.clientHeight;
  if (viewWidth === 0 || viewHeight === 0) return null;

  const scaleX = viewWidth / canvas.width;
  const scaleY = viewHeight / canvas.height;
  const shipScale = Math.min(1, scaleX, scaleY) * PLAYER_SPRITE_SCALE;

  const width = ship.width * shipScale;
  const height = ship.height * shipScale;
  const progressX = ship.x / (canvas.width - ship.width);
  const progressY = ship.y / (canvas.height - ship.height);

  // Centro que realmente ocupa la nave en la pantalla.
  const centerX = progressX * (viewWidth - width) + width / 2;
  const centerY = progressY * (viewHeight - height) + height / 2;

  return { centerX, centerY, width, height, scaleX, scaleY };
}

function drawPlayer(context, ship, sprite) {
  if (!sprite.complete || sprite.naturalWidth === 0) return;

  const layout = getPlayerLayout(context.canvas, ship);
  if (!layout) return;

  const { centerX, centerY, width, height, scaleX, scaleY } = layout;

  context.save();
  context.scale(1 / scaleX, 1 / scaleY);
  context.translate(centerX, centerY);
  context.rotate(Math.PI / 2);
  context.drawImage(sprite, -width / 2, -height / 2, width, height);
  context.restore();
}

export function getPlayerMuzzle(canvas, ship) {
  const layout = getPlayerLayout(canvas, ship);
  if (!layout) return null;

  // En fighter_ship.svg, el centro está en (24, 24) y la punta en (24, 4.12).
  // Tras girar la nave 90°, esa distancia apunta hacia la derecha.
  const noseFraction = (24 - 4.12) / 48;
  const noseX = layout.centerX + layout.height * noseFraction;

  // El proyectil se mueve en coordenadas internas del canvas.
  return {
    x: noseX / layout.scaleX,
    y: layout.centerY / layout.scaleY,
  };
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
    const spriteScale = Math.min(1, scaleX, scaleY) * ENEMY_SPRITE_SCALE;

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

function drawPlayerBullet(context, playerBullet, image) {
  if (!image.complete || image.naturalWidth === 0) return;

  const frameSize = 32;
  const frameCount = 4;
  const framesPerSecond = 15;
  const frame = Math.floor(playerBullet.age * framesPerSecond) % frameCount;
  const size = playerBullet.size;

  context.save();
  context.translate(playerBullet.x, playerBullet.y);
  context.rotate(Math.PI / 2);
  context.drawImage(
    image,
    frame * frameSize, 0, frameSize, frameSize,
    -size / 2, -size / 2, size, size,
  );
  context.restore();
}

export function createRenderer(context, playerSpriteUrl) {
  const playerImage = loadImage(playerSpriteUrl);
  const playerBulletImage = loadImage(playerBulletSpriteUrl);
  const enemyImages = new Map();

  for (const [type, config] of Object.entries(enemyTypes)) {
    enemyImages.set(type, loadImage(config.spriteUrl));
  }

  return function render(playerShip, enemies, playerBullets) {
    const canvas = context.canvas;
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      drawEnemy(context, enemy, enemyImages.get(enemy.type));
    }

    for (const playerBullet of playerBullets) {
      drawPlayerBullet(context, playerBullet, playerBulletImage);
    }

    drawPlayer(context, playerShip, playerImage);
  };
}
