export const HEAL_FX_SECONDS = 8 / 12; // Una vuelta de healing_aura.png.

export function healPlayer(ship, fraction) {
  if (ship.hp <= 0 || ship.hp >= ship.maxHp) return false;

  ship.hp = Math.min(ship.maxHp, ship.hp + ship.maxHp * fraction);
  ship.healFxRemaining = HEAL_FX_SECONDS;
  return true;
}

export function dropMedkit(ship, medkits, dropHealFraction) {
  medkits.push({
    // Copia la posición al soltarlo para que el objeto permanezca allí.
    x: ship.x,
    y: ship.y,
    width: ship.width,
    height: ship.height,
    contacts: new Set([ship.id]),
  });

  healPlayer(ship, dropHealFraction);
}

export function resolveMedkits(medkits, players, touchesMedkit, pickupHealFraction) {
  let pickedUp = false;

  for (let i = medkits.length - 1; i >= 0; i--) {
    const kit = medkits[i];

    for (const ship of players.values()) {
      if (ship.hp <= 0) continue;

      const touching = touchesMedkit(kit, ship);
      if (touching === null) continue; // El canvas aún no tiene tamaño visible.

      if (!touching) {
        kit.contacts.delete(ship.id);
        continue;
      }

      if (kit.contacts.has(ship.id)) continue;
      kit.contacts.add(ship.id);

      if (!healPlayer(ship, pickupHealFraction)) continue;

      medkits.splice(i, 1);
      pickedUp = true;
      break; // Un mismo botiquín solo puede curar a una nave.
    }
  }

  return pickedUp;
}