// Genera un reporte JSON de la paleta y sus contrastes desde las variables reales.
// No modifica tokens ni hojas de estilo. Ejecutar: npm run palette:game.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

const project = new URL("../", import.meta.url);
const css = ["src/styles/tokens.css", "src/styles/game.css"]
  .map((path) => readFileSync(new URL(path, project), "utf8"))
  .join("\n");
const tokens = Object.fromEntries(
  [...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
);

function resolveColor(token) {
  const value = tokens[token];
  const reference = /^var\((--[\w-]+)\)$/.exec(value);
  if (reference) return resolveColor(reference[1]);
  if (!/^#[\da-f]{6}$/i.test(value)) throw new Error(`Color no compatible: ${token}`);
  return value;
}

function luminance(hex) {
  const [red, green, blue] = hex.match(/[\da-f]{2}/gi).map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

const selected = [
  ["Fondo", "--dialog-header-top"],
  ["Panel", "--dialog-surface"],
  ["Cabecera", "--dialog-header-bottom"],
  ["Texto", "--color-text"],
  ["Texto secundario", "--game-text-muted"],
  ["Energía", "--game-energy"],
  ["Vida", "--game-health"],
  ["Aviso y foco", "--game-warning"],
];
const palette = selected.map(([label, token]) => ({ label, token, hex: resolveColor(token) }));
const contrast = [];
for (const foreground of ["--color-text", "--game-text-muted", "--game-energy", "--game-warning"]) {
  for (const background of ["--dialog-header-top", "--dialog-surface", "--dialog-header-bottom"]) {
    const a = luminance(resolveColor(foreground));
    const b = luminance(resolveColor(background));
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    if (ratio < 4.5) throw new Error(`Contraste insuficiente: ${foreground} sobre ${background}`);
    contrast.push({ foreground, background, ratio: Number(ratio.toFixed(2)), aa: true });
  }
}

const output = new URL("design/validation/", project);
mkdirSync(output, { recursive: true });
writeFileSync(new URL("game-palette.json", output), JSON.stringify({ palette, contrast }, null, 2) + "\n");
console.log(`Paleta generada: ${palette.length} colores; ${contrast.length} combinaciones cumplen AA (4.5:1).`);
