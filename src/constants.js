import gradient from "gradient-color";

export const ORDERED_UNIVERSE_GAP = 0.05;

export const START_COLOR = "blue";
export const END_COLOR = "red";

// Universe types
export const ORDERED = "ordered";
export const RANDOM = "random";

// Dot type
export const UNIFORM = "uniform";
export const RANDOM_DOT = "random";

export const UNIVERSE_TYPE = ORDERED;

export const RADIUS = 5;

export const SPACE_SIZE = [1000, 500];

export const DOT_COUNT = 250;

export const EXPANSION_TIME = 500;

export const TIME_UNIT_SHIFT = 1.00005;

export const GRADIENT = gradient([START_COLOR, END_COLOR], EXPANSION_TIME + 1);

export const CHANGE_TIMEOUT = 500;
