import memo from "memoizee";
import { debounce } from "lodash";
import { TIME_UNIT_SHIFT } from "./constants";

export function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getChangedCenter = debounce((state, setState) => {
  const ind = Math.ceil(Math.random() * state.universe.length);
  setState({
    ...state,
    active: ind < state.universe.length ? ind : state.universe.length - 1,
    // active: state.active + 1,
    changes: state.changes + 1,
    transition: true,
    oldActive: state.active
  });
}, 100);

export const getExpandedSpaceSize = memo((x, y, time) =>
  [x, y].map(el => el * TIME_UNIT_SHIFT ** time)
);

export const getOrigPoss = ({ x, y, radius }, size) => [
  size[0] * x,
  size[1] * y,
  radius
];

export const getShiftedPoss = ({ x, y, radius }, state, spaceSize) => [
  spaceSize[0] * x - state.pixelShift[0] / 2,
  spaceSize[1] * y - state.pixelShift[1] / 2,
  radius
];

export const sortUniverse = universe =>
  universe.sort((a, b) => {
    // if (a.x === b.x) {
    //   return a.y > b.y ? 1 : -1;
    // }
    // return a.x > b.x ? 1 : -1;
    return a.x + a.y > b.x + b.y ? 1 : -1;
  });

export const collision = ({ x, y, radius }, universe, spaceSize) => {
  x *= spaceSize[0];
  y *= spaceSize[1];
  for (let i = 0; i < universe.length; i++) {
    const dot = universe[i];
    const dotX = dot.x * spaceSize[0];
    const dotY = dot.y * spaceSize[1];
    const dist = Math.sqrt((x - dotX) ** 2 + (y - dotY) ** 2);

    if (dist <= radius + dot.radius + 30) {
      /* ensure proper distance between dots */ return true;
    }
  }
  return false;
};
