import playerBulletSpriteUrl from "../../../assets/player/player_bullet.png";
import dreadnoughtBeamUrl from "../../../assets/enemies/weapons/dreadnought_beam.png";

import { enemyTypes, shieldTypes, getEnemyBeamBounds } from "../entities/enemies.js";
import { planetTypes } from "../entities/planet.js";
import { createPlayerEffects } from "./playerEffects.js";
import { createMedkitView } from "./medkitView.js";

const PLAYER_SPRITE_SCALE = 0.75;
const ENEMY_SPRITE_SCALE = 1.25;

function getEnemyScale(enemy, scaleX, scaleY) {
  const spriteScale = enemy.spriteScale ?? ENEMY_SPRITE_SCALE;
  return Math.min(1, scaleX, scaleY) * spriteScale;
}

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

// Comprobar si el rayo del boss toca el sprite del jugador
function beamTouchesPlayer(canvas, ship, beam) {
  const layout = getPlayerLayout(canvas, ship);
  if (!layout || beam.width <= 0) return false;

  const { centerX, centerY, width, height, scaleX, scaleY } = layout;

  // El giro de 90° intercambia el ancho y el alto del sprite.
  const left = (centerX - height / 2) / scaleX;
  const right = (centerX + height / 2) / scaleX;
  const top = (centerY - width / 2) / scaleY;
  const bottom = (centerY + width / 2) / scaleY;

  return left < beam.x + beam.width && right > beam.x
    && top < beam.y + beam.height && bottom > beam.y;
}

function drawPlayer(context, ship, sprite, board = context.canvas) {
  if (!sprite.complete || sprite.naturalWidth === 0) return;

  const layout = getPlayerLayout(board, ship);
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

function drawEnemy(context, enemy, image, canvas = context.canvas, config = enemyTypes[enemy.type]) {
  if (!image.complete || image.naturalWidth === 0) return;

  // const config = enemyTypes[enemy.type];
  const { frameWidth, frameHeight } = config;
  const frame = Math.floor(enemy.age * config.framesPerSecond) % config.frameCount;

  // const canvas = context.canvas;
  const scaleX = canvas.clientWidth / canvas.width;
  const scaleY = canvas.clientHeight / canvas.height;
  if (scaleX === 0 || scaleY === 0) return;

  // Mismo criterio que el jugador: reducir uniformemente y limitar la escala a 1.
  const spriteScale = getEnemyScale(enemy, scaleX, scaleY);

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

function drawDreadnoughtBeam(context, enemy, beam, image) {
  if (beam.width <= 0 || !image.complete || !image.naturalWidth) return;

  const frameWidth = 18;
  const frameHeight = 38;
  const frameCount = 4;
  const framesPerSecond = 12;
  const frame = Math.floor(enemy.beamTime * framesPerSecond) % frameCount;

  // Mantiene la proporción del sprite si cambias el grosor del rayo.
  const tileLength = frameHeight * beam.height / frameWidth;

  context.save();
  context.imageSmoothingEnabled = false;

  // Solo se ve el tramo que la mecánica considera activo.
  context.beginPath();
  context.rect(beam.x, beam.y, beam.width, beam.height);
  context.clip();

  // Tras el giro, cada tramo crece desde la nave hacia la izquierda.
  context.translate(enemy.x, enemy.y);
  context.rotate(Math.PI / 2);

  for (let offset = 0; offset < enemy.x - beam.x; offset += tileLength) {
    context.drawImage(
      image,
      frame * frameWidth, 0, frameWidth, frameHeight,
      -beam.height / 2, offset, beam.height, tileLength
    );
  }

  context.restore();
}

function createEnemyHitTest(board, playerImage, bulletImage, enemyImages, planetImage, shieldImages) {
  const mask = document.createElement("canvas");
  const ctx = mask.getContext("2d", { willReadFrequently: true });

  return function hitsEnemy(entity, enemy) {
    const sx = board.clientWidth / board.width;
    const sy = board.clientHeight / board.height;
    if (!sx || !sy) return false;

    const isBullet = entity.kind === "bullet";
    const isPlanet = entity.kind === "planet";
    let image = playerImage;
    if (isBullet) image = bulletImage;
    if (isPlanet) image = planetImage;

    // const enemyImage = enemyImages.get(enemy.type);
    const useShield = isBullet && enemy.shield?.phase === "active";

    const config = useShield
      ? shieldTypes[enemy.shield.type]
      : enemyTypes[enemy.type];

    const enemyImage = useShield
      ? shieldImages.get(enemy.shield.type)
      : enemyImages.get(enemy.type);

    if (!image.complete || !image.naturalWidth ||
        !enemyImage?.complete || !enemyImage.naturalWidth) return false;

    // Centro y semitamaños en coordenadas internas del tablero.
    let x = entity.x;
    let y = entity.y;
    let halfW = entity.size / 2;
    let halfH = halfW;

    if (isPlanet) {
      const layout = getPlanetLayout(board);
      if (!layout) return false;

      halfW = layout.width / 2;
      halfH = layout.height / 2;
      x = layout.x + halfW;
      y = layout.y + halfH;

    } else if (!isBullet) {
      const layout = getPlayerLayout(board, entity);
      x = layout.centerX / sx;
      y = layout.centerY / sy;
      // El jugador se dibuja girado 90°.
      halfW = layout.height / (2 * sx);
      halfH = layout.width / (2 * sy);
    }

    // const config = enemyTypes[enemy.type];
    const scale = getEnemyScale(enemy, sx, sy);
    const cos = Math.abs(Math.cos(config.rotation));
    const sin = Math.abs(Math.sin(config.rotation));
    const enemyHalfW = (config.frameWidth * cos + config.frameHeight * sin)
      * scale / (2 * sx);
    const enemyHalfH = (config.frameWidth * sin + config.frameHeight * cos)
      * scale / (2 * sy);

    const left = Math.max(0, Math.floor(Math.max(x - halfW, enemy.x - enemyHalfW)));
    const top = Math.max(0, Math.floor(Math.max(y - halfH, enemy.y - enemyHalfH)));
    const right = Math.min(board.width, Math.ceil(Math.min(x + halfW, enemy.x + enemyHalfW)));
    const bottom = Math.min(board.height, Math.ceil(Math.min(y + halfH, enemy.y + enemyHalfH)));
    const width = right - left;
    const height = bottom - top;
    if (width <= 0 || height <= 0) return false;

    // Reutiliza la superficie entre comprobaciones.
    if (mask.width < width) mask.width = width;
    if (mask.height < height) mask.height = height;
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(-left, -top);

    if (isPlanet) {
      drawPlanet(ctx, entity, planetImage, board);
    } else if (isBullet) {
      drawPlayerBullet(ctx, entity, bulletImage);
    } else {
      drawPlayer(ctx, entity, playerImage, board);
    }

    ctx.globalCompositeOperation = "source-in";
    drawEnemy(ctx, enemy, enemyImage, board, config);
    ctx.restore();

    const pixels = ctx.getImageData(0, 0, width, height).data;
    for (let alpha = 3; alpha < pixels.length; alpha += 4) {
      if (pixels[alpha] > 0) return true;
    }
    return false;
  };
}

function getPlanetLayout(canvas) {
  const viewWidth = canvas.clientWidth;
  const viewHeight = canvas.clientHeight;
  if (!viewWidth || !viewHeight) return null;

  // Modifica el tamaño del planeta
  const diameter = Math.min(viewHeight * 0.85, viewWidth * 0.90);

  const scaleX = viewWidth / canvas.width;
  const scaleY = viewHeight / canvas.height;

  return {
    x: (-0.45 * diameter) / scaleX, // Modifica su ubicación en x
    y: ((viewHeight - diameter) / 2) / scaleY,
    width: diameter / scaleX,
    height: diameter / scaleY,
  };
}

function drawPlanet(context, planet, image, board = context.canvas) {
  if (planet.hp <= 0) return;
  if (!image.complete || !image.naturalWidth) return;

  const layout = getPlanetLayout(board);
  if (!layout) return;

  const frameSize = 200;
  const frameCount = 80;
  const rotationSeconds = 20; // Velocidad de la animación
  const frame = Math.floor(planet.age * frameCount / rotationSeconds) % frameCount;

  context.drawImage(
    image,
    frame * frameSize, 0, frameSize, frameSize,
    layout.x, layout.y, layout.width, layout.height,
  );
}

export function createRenderer(context, playerSpriteUrl, planet) {
  const planetImage = loadImage(planetTypes[planet.type].spriteUrl);
  const playerImage = loadImage(playerSpriteUrl);
  const playerBulletImage = loadImage(playerBulletSpriteUrl);
  const beamImage = loadImage(dreadnoughtBeamUrl);
  const drawPlayerEffects = createPlayerEffects(loadImage);
  const medkitView = createMedkitView(context, loadImage, getPlayerLayout);
  const enemyImages = new Map();
  const shieldImages = new Map();

  for (const [type, config] of Object.entries(enemyTypes)) {
    enemyImages.set(type, loadImage(config.spriteUrl));
  }

  for (const [type, config] of Object.entries(shieldTypes)) {
    shieldImages.set(type, loadImage(config.spriteUrl));
  }

  function render(playerShip, enemies, playerBullets,  medkits, players) {
    const canvas = context.canvas;
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawPlanet(context, planet, planetImage);
    medkitView.drawItems(medkits);

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      const beam = getEnemyBeamBounds(enemy);

      if (beam) {
        drawDreadnoughtBeam(context, enemy, beam, beamImage);
      }

      drawEnemy(context, enemy, enemyImages.get(enemy.type));

      if (enemy.shield?.phase === "active") {
        const type = enemy.shield.type;

        context.save();
        context.globalAlpha = 0.55;
        drawEnemy(context, enemy, shieldImages.get(type), canvas, shieldTypes[type]);
        context.restore();
      }
    }

    for (const playerBullet of playerBullets) {
      drawPlayerBullet(context, playerBullet, playerBulletImage);
    }

    // Valora que la vida del jugador no sea 0
    if (playerShip.hp > 0) drawPlayer(context, playerShip, playerImage);
    drawPlayerEffects(context, playerShip, getPlayerLayout(canvas, playerShip));
    medkitView.drawAuras(players);
  }

  return {
    render,
    touchesMedkit: medkitView.touchesMedkit,
    hitsEnemy: createEnemyHitTest(
      context.canvas, playerImage, playerBulletImage, enemyImages, planetImage, shieldImages
    ),
    beamTouchesPlayer: (ship, beam) => beamTouchesPlayer(context.canvas, ship, beam),
  };
}
