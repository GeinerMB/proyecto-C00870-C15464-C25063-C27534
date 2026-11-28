import scoutImg from "../../../assets/enemies/enemy_sprites/enemy_scout.png"
import bomberImg from "../../../assets/enemies/enemy_sprites/enemy_bomber.png"
import fighterImg from "../../../assets/enemies/enemy_sprites/enemy_fighter.png"
import dreadnoughtImg from "../../../assets/enemies/enemy_sprites/enemy_dreadnought.png";
import roundShieldImg from "../../../assets/enemies/weapons/dreadnought_shield.png";

export const shieldTypes = {
  round: {
    spriteUrl: roundShieldImg,
    maxHp: 4,
    frameWidth: 128,
    frameHeight: 128,
    frameCount: 20,
    framesPerSecond: 10,
    rotation: 0,
  },
};

// Tipos de enemigos que se pueden generar
export const enemyTypes = {
  scout: {
    spriteUrl: scoutImg,
    frameWidth: 64,
    frameHeight: 37,
    frameCount: 6, // Cantidad de fotogramas de la animación.
    framesPerSecond: 10, // Velocidad de reproducción
    velocityX: -40, // Velocidad horizontal hacia la izquierda
    rotation: -Math.PI / 2,
    widthOnBoard: 37, // Ancho horizontal después del giro.
    maxHp: 1, // Cantidad de impactos que resiste este enemigo
    points: 1, // Cantidad de puntos que otorga el enemigo al ser destruido
    planetDamage: 1, // Cantidad de daño que hace al planeta
  },
  bomber: {
    spriteUrl: bomberImg,
    frameWidth: 64,
    frameHeight: 37,
    frameCount: 6, // Cantidad de fotogramas de la animación.
    framesPerSecond: 10, // Velocidad de reproducción
    velocityX: -40, // Velocidad horizontal hacia la izquierda
    rotation: -Math.PI / 2,
    widthOnBoard: 37, // Ancho horizontal después del giro.
    maxHp: 2, // Cantidad de impactos que resiste este enemigo
    points: 1, // Cantidad de puntos que otorga el enemigo al ser destruido
    planetDamage: 5, // Cantidad de daño que hace al planeta
  },
  fighter: {
    spriteUrl: fighterImg,
    frameWidth: 64,
    frameHeight: 37,
    frameCount: 6, // Cantidad de fotogramas de la animación.
    framesPerSecond: 10, // Velocidad de reproducción
    velocityX: -60, // Velocidad horizontal hacia la izquierda
    rotation: -Math.PI / 2,
    widthOnBoard: 37, // Ancho horizontal después del giro.
    maxHp: 2, // Cantidad de impactos que resiste este enemigo
    points: 1, // Cantidad de puntos que otorga el enemigo al ser destruido
    planetDamage: 1, // Cantidad de daño que hace al planeta
  },
  dreadnought: {
    spriteUrl: dreadnoughtImg,
    frameWidth: 128,
    frameHeight: 97,
    frameCount: 8, // Cantidad de fotogramas de la animación.
    framesPerSecond: 6, // Velocidad de reproducción
    velocityX: -90, // Velocidad horizontal hacia la izquierda
    rotation: -Math.PI / 2,
    widthOnBoard: 97, // Ancho horizontal después del giro.
    maxHp: 12, // Cantidad de impactos que resiste este enemigo
    points: 20, // Cantidad de puntos que otorga el enemigo al ser destruido
    planetDamage: 0,
    shieldType: "round",
    beam: {
      rechargeSeconds: 3, // espera entre disparo y disparo
      extendSeconds: 0.5,
      activeSeconds: 2,
      retractSeconds: 0.5,
      height: 18, // ancho del laser
      damage: 1, // daño al impactar con el laser
      hitInterval: 0.5, // daño al estar en contacto continuo.
    },
  },
};

// Obtener el tiempo de duración de la recarga del boss
function getBeamCycleDuration(beam) {
  return beam.rechargeSeconds + beam.extendSeconds
    + beam.activeSeconds + beam.retractSeconds;
}

// Genera un movimiento de patrullaje vertical para los boss
function updateBossPatrol(enemy, beam) {
  const patrol = enemy.patrol;
  const duration = getBeamCycleDuration(beam);
  const cycle = Math.floor(enemy.beamTime / duration);

  // El primer disparo se hace desde el centro, donde entró el jefe.
  if (cycle === 0) return;

  if (cycle !== patrol.cycle) {
    patrol.cycle = cycle;
    patrol.from = patrol.to;

    if (patrol.from === 1) {
      patrol.to = Math.random() < 0.5 ? 0 : 2;
    } else {
      patrol.to = 1;
    }
  }

  const timeInCycle = enemy.beamTime % duration;
  const moveSeconds = beam.rechargeSeconds * 0.75;
  const progress = Math.min(timeInCycle / moveSeconds, 1);

  const startY = patrol.positions[patrol.from];
  const endY = patrol.positions[patrol.to];
  enemy.y = startY + (endY - startY) * progress;
}

// Crea un enemigo del tipo indicado en la posición de aparición.
export function createEnemy(type, spawnX, spawnY) {
  const config = enemyTypes[type];

  return {
    type, // Tipo de enemigo creado.
    x: spawnX + config.frameWidth / 2, // Centra la posición horizontal usando el ancho del fotograma.
    y: spawnY + config.frameHeight / 2, // Centra la posición vertical usando el alto del fotograma.
    age: 0, // Tiempo que lleva activo el enemigo desde su creación.
    hp: config.maxHp,
    maxHp: config.maxHp,
    points: config.points,
    planetDamage: config.planetDamage,
  };
}

// Actualiza la posición y el tiempo de vida de un enemigo.
export function updateEnemy(enemy, deltaTime) {
  const config = enemyTypes[enemy.type];
  enemy.x += config.velocityX * deltaTime;

  // Frena solo a los enemies declarados como boss en la posición de parada
  if (enemy.stopX !== undefined) {
    enemy.x = Math.max(enemy.x, enemy.stopX);

    // Activa el escudo al llegar a su punto de parada
    if (enemy.x === enemy.stopX && enemy.shield?.phase === "pending") {
      enemy.shield.phase = "active";
    }
    
    if (config.beam && enemy.stopX !== undefined && enemy.x === enemy.stopX) {
      enemy.beamTime ??= 0;
    }

    if (enemy.beamTime !== undefined) {
      enemy.beamTime += deltaTime;

      if (enemy.patrol) {
        updateBossPatrol(enemy, config.beam);
      }
    }
  }

  enemy.age += deltaTime;
}

// Comprueba si el enemigo todavía se encuentra dentro del espacio visible.
export function isEnemyOnCourse(enemy) {
  const halfWidth = enemyTypes[enemy.type].widthOnBoard / 2;

  // Conserva el enemigo mientras su lado derecho siga dentro del tablero.
  return enemy.x + halfWidth > 0;
}

// Actualiza todos los enemigos y elimina los que ya abandonaron el tablero.
export function updateEnemies(enemies, deltaTime) {
  // Recorre la lista desde el final para eliminar elementos sin alterar los índices.
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];

    // Actualiza la posición y la edad del enemigo.
    updateEnemy(enemy, deltaTime);

    // Si salió completamente del tablero, lo elimina de la colección.
    if (!isEnemyOnCourse(enemy)) {
      enemies.splice(i, 1);
    }
  }
}

// Devuelve rectándulo con cordenas para el rayo, o null si se está recargando
export function getEnemyBeamBounds(enemy) {
  if (enemy.beamTime === undefined) return null;

  const beam = enemyTypes[enemy.type].beam;
  const holdEnd = beam.extendSeconds + beam.activeSeconds;
  const cycle = getBeamCycleDuration(beam);
  const time = (enemy.beamTime % cycle) - beam.rechargeSeconds;

  if (time < 0) return null;

  let left = 0;
  let right = enemy.x;

  if (time < beam.extendSeconds) {
    // La punta avanza desde el jefe hasta el borde izquierdo.
    const progress = time / beam.extendSeconds;
    left = enemy.x * (1 - progress);
  } else if (time >= holdEnd) {
    // Se apaga primero el tramo junto al jefe y al final el del borde.
    const progress = (time - holdEnd) / beam.retractSeconds;
    right = enemy.x * (1 - progress);
  }

  return {
    x: left,
    y: enemy.y - beam.height / 2,
    width: right - left,
    height: beam.height,
  };
}
