// Genera un reporte JSON de la paleta y sus contrastes desde las variables reales de Rules.
// Ejecutar: npm run palette:rules.
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";

const project = new URL("../", import.meta.url);
const css = ["src/styles/tokens.css", "src/styles/rules.css"]
  .map((path) => readFileSync(new URL(path, project), "utf8"))
  .join("\n");
const tokens = Object.fromEntries(
  [...css.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
);

function resolveColor(token) {
  const value = tokens[token];
  if (!value) throw new Error(`Token no encontrado: ${token}`);
  const reference = /^var\((--[\w-]+)\)$/.exec(value);
  if (reference) return resolveColor(reference[1]);
  if (/^#[\da-f]{3}$/i.test(value)) {
    // Expand 3-digit hex to 6-digit
    const [, r, g, b] = value;
    return `#${r}${r}${g}${g}${b}${b}`.toLowerCase();
  }
  if (!/^#[\da-f]{6}$/i.test(value)) throw new Error(`Color no compatible: ${token} = ${value}`);
  return value.toLowerCase();
}

function luminance(hex) {
  const [red, green, blue] = hex.match(/[\da-f]{2}/gi).map((part) => {
    const value = parseInt(part, 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

const selected = [
  ["Fondo de panel", "--rules-panel-bg"],
  ["Fondo de escenario", "--rules-stage-bg"],
  ["Fondo de sub-tarjeta", "--rules-subcard-bg"],
  ["Cabecera superior", "--rules-header-top"],
  ["Cabecera inferior", "--rules-header-bottom"],
  ["Texto principal", "--color-text"],
  ["Texto secundario", "--rules-text-muted"],
  ["Acento cian", "--rules-accent"],
  ["Alerta / Derrota", "--rules-warning"],
  ["Victoria / Éxito", "--rules-success"],
  ["Ámbar", "--rules-amber"],
];

const palette = selected.map(([label, token]) => ({ label, token, hex: resolveColor(token) }));
const contrast = [];

const foregrounds = [
  "--color-text",
  "--rules-text-muted",
  "--rules-accent",
  "--rules-success",
  "--rules-warning",
  "--rules-amber",
];

const backgrounds = [
  "--rules-panel-bg",
  "--rules-subcard-bg",
  "--rules-stage-bg",
  "--rules-header-top",
];

for (const foreground of foregrounds) {
  for (const background of backgrounds) {
    const a = luminance(resolveColor(foreground));
    const b = luminance(resolveColor(background));
    const ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    if (ratio < 4.5) {
      throw new Error(`Contraste insuficiente: ${foreground} (${ratio.toFixed(2)}) sobre ${background}`);
    }
    contrast.push({ foreground, background, ratio: Number(ratio.toFixed(2)), aa: true });
  }
}

const output = new URL("design/validation/", project);
mkdirSync(output, { recursive: true });
writeFileSync(new URL("rules-palette.json", output), JSON.stringify({ palette, contrast }, null, 2) + "\n");
console.log(`Paleta generada: ${palette.length} colores; ${contrast.length} combinaciones cumplen AA (>= 4.5:1).`);

