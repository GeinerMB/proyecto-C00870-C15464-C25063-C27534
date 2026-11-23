const PROJECTILE_SIZE = 32; // Tamaño fijo del bullet
const PROJECTILE_SPEED = 250; // Velocidad del disparo

// Crea el proyectil a partir de la posición de la punta de la nave.
export function createPlayerBullet(muzzle) {
  // Calcula la distancia entre el centro del proyectil y su borde trasero.
  // Esta corrección permite que el disparo aparezca correctamente alineado
  // después de aplicar la rotación de la imagen.
  const centerToTail = PROJECTILE_SIZE * (9 / 32);

  return {
    x: muzzle.x + centerToTail, // Posiciona el centro del proyectil ligeramente después de la nave.
    y: muzzle.y, // Mantiene el proyectil a la misma altura que el centro de la nave
    size: PROJECTILE_SIZE,
    age: 0, // Tiempo transcurrido desde que fue creado.
  };
}

// Actualiza todos los proyectiles y elimina los que salen del tablero.
export function updatePlayerBullets(projectiles, deltaTime, boardWidth) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    projectile.x += PROJECTILE_SPEED * deltaTime;
    projectile.age += deltaTime;

    // Comprueba si el lado izquierdo del proyectil salió completamente del tablero.
    if (projectile.x - projectile.size / 2 >= boardWidth) {
      projectiles.splice(i, 1);
    }
  }
}
