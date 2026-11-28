import rapidFireUrl from "../../../assets/player/effects/rapid_fire.png";
import shieldActivationUrl from "../../../assets/player/effects/shield_activation.png";
import invincibilityUrl from "../../../assets/player/effects/invincibility_shield.png";
import {
  HUNTER_ABILITY,
  GUARDIAN_ABILITY,
  isHunterActive,
  isGuardianActive,
} from "./abilitySystem.js";

export function createPlayerEffects(loadImage) {
  const rapidFire = loadImage(rapidFireUrl);
  const shieldActivation = loadImage(shieldActivationUrl);
  const invincibility = loadImage(invincibilityUrl);

  return function drawPlayerEffects(context, ship, layout) {
    if (!layout || ship.hp <= 0) return;

    let image;
    let frame;
    let frameSize;
    let effectScale = 1;

    if (isHunterActive(ship)) {
      const elapsed = HUNTER_ABILITY.duration - ship.ability.remaining;
      image = rapidFire;
      frameSize = 48;
      frame = Math.floor(elapsed * 14) % 6;
    } else if (isGuardianActive(ship)) {
      const elapsed = GUARDIAN_ABILITY.duration - ship.ability.remaining;
      const tick = Math.floor(elapsed * 12);
      frameSize = 64;
      effectScale = 1.3;

      if (tick < 8) {
        image = shieldActivation;
        frame = tick;
      } else {
        image = invincibility;
        frame = (tick - 8) % 10;
      }
    } else if (ship.role === "guardian" && ship.ability.readyIn > 0) {
      // Al apagarse el escudo, readyIn empieza a contar los 8 s de recarga.
      const elapsed = Math.max(0, GUARDIAN_ABILITY.cooldown - ship.ability.readyIn);
      const exitTick = Math.floor(elapsed * 24);
      if (exitTick >= 8) return;

      image = shieldActivation;
      frameSize = 64;
      effectScale = 1.3;
      frame = 7 - exitTick; // Recorre la hoja del cuadro 7 al 0.
    } else {
      return;
    }

    if (!image.complete || !image.naturalWidth) return;

    const { centerX, centerY, scaleX, scaleY } = layout;
    const width = layout.width * effectScale;
    const height = layout.height * effectScale;

    context.save();
    context.scale(1 / scaleX, 1 / scaleY);
    context.translate(centerX, centerY);
    context.rotate(Math.PI / 2);
    context.drawImage(
      image,
      frame * frameSize, 0, frameSize, frameSize,
      -width / 2, -height / 2, width, height,
    );
    context.restore();
  };
}