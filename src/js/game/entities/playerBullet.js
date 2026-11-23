const PROJECTILE_SIZE = 32;
const PROJECTILE_SPEED = 250;

export function createPlayerBullet(muzzle) {
  // En el primer cuadro de 32 px, la parte visible llega hasta la fila 24.
  // Tras el giro, su borde trasero queda a 9 px del centro del proyectil.
  const centerToTail = PROJECTILE_SIZE * (9 / 32);

  return {
    x: muzzle.x + centerToTail,
    y: muzzle.y,
    size: PROJECTILE_SIZE,
    age: 0,
  };
}

export function updatePlayerBullets(projectiles, deltaTime, boardWidth) {
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
    projectile.x += PROJECTILE_SPEED * deltaTime;
    projectile.age += deltaTime;

    if (projectile.x - projectile.size / 2 >= boardWidth) {
      projectiles.splice(i, 1);
    }
  }
}
