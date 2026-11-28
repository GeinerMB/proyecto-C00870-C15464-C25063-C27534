export const levels = {
  1: {
    spawners: [
      { type: "scout", x: 1280, y: 70,  interval: 3.5, maxEnemies: 5 },
      { type: "fighter", x: 1280, y: 250,  interval: 3.5, maxEnemies: 5 },
      { type: "bomber", x: 1280, y: 626, interval: 3.5, maxEnemies: 5 },
    ],
    planetType: "mars",
    bossType: "dreadnought",
  },
  2: {
    spawners: [
      { type: "scout", x: 1280, y: 120, interval: 5, maxEnemies: 30 },
      { type: "scout", x: 1280, y: 220, interval: 4, maxEnemies: 30 },
      { type: "scout", x: 1280, y: 480, interval: 4, maxEnemies: 30 },
      { type: "scout", x: 1280, y: 580, interval: 5, maxEnemies: 30 },
    ],
    planetType: "mars",
    bossType: "dreadnought",
  },
  3: {
    spawners: [
      { type: "scout", x: 1280, y: 80, interval: 3, maxEnemies: 20 },
      { type: "fighter", x: 1280, y: 230, interval: 3.5, maxEnemies: 20 },
      { type: "bomber", x: 1280, y: 490, interval: 4, maxEnemies: 15 },
      { type: "fighter", x: 1280, y: 620, interval: 3.5, maxEnemies: 20 },
    ],
    planetType: "mars",
    bossType: "dreadnought",
  },
};
