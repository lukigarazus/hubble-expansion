import { ORDERED_UNIVERSE_GAP, UNIFORM, RANDOM_DOT, RADIUS } from "./constants";
import { getRandomInt, collision } from "./utils";

const DOT_SIZE_MAPPING = {
  [UNIFORM]: (radius = RADIUS) => radius,
  [RANDOM_DOT]: (min = 1, max = 10) => getRandomInt(min, max)
};

const getOrderedDot = (x, y, dotSize) => ({
  x,
  y,
  radius: DOT_SIZE_MAPPING[dotSize]()
});

const getRandomDot = dotSize => {
  return {
    x: Math.random(),
    y: Math.random(),
    radius: DOT_SIZE_MAPPING[dotSize]()
  };
};

export const generateOrderedUniverse = (spaceSize, dotSize) => {
  const universe = [{ x: 0.5, y: 0.5, radius: RADIUS }];
  const start = [ORDERED_UNIVERSE_GAP, ORDERED_UNIVERSE_GAP];
  while (start[0] < 1) {
    while (start[1] < 1) {
      universe.push(getOrderedDot(...start, dotSize));
      start[1] += ORDERED_UNIVERSE_GAP;
    }
    start[0] += ORDERED_UNIVERSE_GAP;
    start[1] = ORDERED_UNIVERSE_GAP;
  }
  universe.shift();
  return universe;
};

export const generateRandomUniverse = (spaceSize, dotSize, dotCount) => {
  const universe = [{ x: 0.5, y: 0.5, radius: RADIUS }];
  for (let c = 0; c < dotCount; c++) {
    const dot = getRandomDot(dotSize);

    const coll = collision(dot, universe, spaceSize);
    if (!coll) universe.push(dot);
    else {
      c--;
    }
  }
  universe.shift();
  return universe;
};

export const generateCircularUniverse = () => {
  const universe = [];
  const start = [0.5, 0.5];

  return universe;
};
