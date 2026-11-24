import scoutImg from "../../../assets/enemies/enemy_sprites/enemy_scout.png"

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
    maxHp: 2, // Cantidad de impactos que resiste este enemigo
    points: 1, // Cantidad de puntos que otorga el enemigo al ser destruido
  },
};

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
  };
}

// Actualiza la posición y el tiempo de vida de un enemigo.
export function updateEnemy(enemy, deltaTime) {
  const config = enemyTypes[enemy.type];
  enemy.x += config.velocityX * deltaTime;
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
