function damageEnemy(enemy, amount) {
  const shield = enemy.shield;

  if (shield?.phase === "pending") return;

  if (shield?.phase === "active") {
    shield.hp = Math.max(0, shield.hp - amount);

    if (shield.hp === 0) {
      shield.phase = "broken";
    }

    return;
  }

  enemy.hp = Math.max(0, enemy.hp - amount);
}

export function resolveHits(players, enemies, bullets, hitsEnemy, contacts, planet) {
  // Resolver los disparos primero. Una baja ya no puede embestir en este paso.
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];
    const index = enemies.findIndex(enemy => hitsEnemy(bullet, enemy));
    if (index < 0) continue;

    bullets.splice(i, 1);
    const enemy = enemies[index];
    damageEnemy(enemy, 1)

    if (enemy.hp === 0) {
      enemies.splice(index, 1);
      players.get(bullet.ownerId).score += enemy.points;
    }
  }

  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemy = enemies[i];
    if (!hitsEnemy(planet, enemy)) continue;

    planet.hp = Math.max(0, planet.hp - enemy.planetDamage);
    enemies.splice(i, 1);
  }

  for (const ship of players.values()) {
    if (ship.hp === 0) continue;

    const previous = contacts.get(ship.id);
    const current = new Set();

    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (!hitsEnemy(ship, enemy)) continue;

      if (!previous?.has(enemy)) {
        ship.hp = Math.max(0, ship.hp - 1);
        damageEnemy(enemy, 1);
      }

      if (enemy.hp === 0) {
        enemies.splice(i, 1);
      } else {
        current.add(enemy);
      }

      if (ship.hp === 0) break;
    }

    contacts.set(ship.id, current);
  }
}