import medkitUrl from "../../../assets/items/medkit.png";
import healingAuraUrl from "../../../assets/player/effects/healing_aura.png";
import { HEAL_FX_SECONDS } from "../entities/medkit.js";

export function createMedkitView(context, loadImage, getPlayerLayout) {
  const kitImage = loadImage(medkitUrl);
  const auraImage = loadImage(healingAuraUrl);
  const canvas = context.canvas;

  function getKitLayout(kit) {
    const layout = getPlayerLayout(canvas, kit);
    if (!layout) return null;

    const size = 32 * Math.min(1, layout.scaleX, layout.scaleY);
    return { ...layout, size };
  }

  function touchesMedkit(kit, ship) {
    const item = getKitLayout(kit);
    const player = getPlayerLayout(canvas, ship);
    if (!item || !player) return null;

    return (
      Math.abs(item.centerX - player.centerX) < (item.size + player.height) / 2 &&
      Math.abs(item.centerY - player.centerY) < (item.size + player.width) / 2
    );
  }

  function drawItems(medkits) {
    if (!kitImage.complete || !kitImage.naturalWidth) return;

    for (const kit of medkits) {
      const layout = getKitLayout(kit);
      if (!layout) continue;

      const { centerX, centerY, scaleX, scaleY, size } = layout;
      context.save();
      context.scale(1 / scaleX, 1 / scaleY);
      context.drawImage(kitImage, centerX - size / 2, centerY - size / 2, size, size);
      context.restore();
    }
  }

  function drawAuras(players) {
    if (!auraImage.complete || !auraImage.naturalWidth) return;

    for (const ship of players.values()) {
      if (ship.hp <= 0 || ship.healFxRemaining <= 0) continue;

      const layout = getPlayerLayout(canvas, ship);
      if (!layout) continue;

      const elapsed = HEAL_FX_SECONDS - ship.healFxRemaining;
      const frame = Math.min(7, Math.floor(elapsed * 12));
      const size = Math.max(layout.width, layout.height) * 1.4;

      context.save();
      context.scale(1 / layout.scaleX, 1 / layout.scaleY);
      context.translate(layout.centerX, layout.centerY);
      context.drawImage(
        auraImage,
        frame * 64, 0, 64, 64,
        -size / 2, -size / 2, size, size,
      );
      context.restore();
    }
  }

  return { touchesMedkit, drawItems, drawAuras };
}