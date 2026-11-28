import earthUrl from "../../../assets/planets/planet_earth_sprites.png"
import marsUrl from "../../../assets/planets/planet_mars_sprites.png"
import iceUrl from "../../../assets/planets/planet_ice_sprites.png"
import gasUrl from "../../../assets/planets/planet_gas_sprites.png"
import islandUrl from "../../../assets/planets/planet_island_sprites.png"

export const planetTypes = {
  earth:  { name: "Tierra", spriteUrl: earthUrl,  maxHp: 100 },
  mars:   { name: "Marte",  spriteUrl: marsUrl,   maxHp: 100 },
  ice:    { name: "Hielo",  spriteUrl: iceUrl,    maxHp: 100 },
  gas:    { name: "Gaseoso", spriteUrl: gasUrl,   maxHp: 100 },
  island: { name: "Islas",  spriteUrl: islandUrl, maxHp: 100 },
};

export function createPlanet(type) {
  const { maxHp } = planetTypes[type];
  return { kind: "planet", type, hp: maxHp, maxHp, age: 0 };
}
