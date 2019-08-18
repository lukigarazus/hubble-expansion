import React, { useRef, useState } from "react";
import ResizeObserver from "resize-observer-polyfill";
import { generateOrderedUniverse, generateRandomUniverse } from "./generation";
import {
  ORDERED,
  RANDOM,
  RADIUS,
  SPACE_SIZE,
  UNIVERSE_TYPE,
  START_COLOR,
  GRADIENT,
  CHANGE_TIMEOUT,
  EXPANSION_TIME,
  UNIFORM,
  DOT_COUNT
} from "./constants";
import {
  getChangedCenter,
  getExpandedSpaceSize,
  getOrigPoss,
  getShiftedPoss,
  sortUniverse
} from "./utils";

const UNIVERSE_TYPE_MAPPING = {
  [ORDERED]: generateOrderedUniverse,
  [RANDOM]: generateRandomUniverse
};

const approachOneStep = (n, t) => n + (t - n) * 0.08;

const approach = (n, t) => {
  let a = approachOneStep(n, t);
  if (Math.abs(t - a) < 0.3) {
    return t;
  }
  return a;
};

const ctxDraw = (x, y, radius, ctx, color, method, rc) => {
  if (rc) {
    rc.circle(x, y, radius * 2);
    return;
  }
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx[method || "stroke"]();
};

const getDiffs = (state, canvasSize, spaceSize, setState, active) => {
  // if (state.transition) {
  const activeCoords = state.universe[active];
  const origPoss = getOrigPoss(
    { x: activeCoords.x, y: activeCoords.y, radius: activeCoords.radius },
    canvasSize
  );
  const shiftedPoss = getShiftedPoss(activeCoords, state, spaceSize);
  const diffs = origPoss.map((el, i) => el - shiftedPoss[i]);
  return diffs;
};

class Hubble extends React.Component {
  constructor(props) {
    super(props);
    const {
      universe = UNIVERSE_TYPE,
      dotSize = UNIFORM,
      dotCount = DOT_COUNT
    } = this.props;
    this.canvasState = {
      canvasSize: SPACE_SIZE
    };
    this.setCanvasState = n => {
      this.canvasState = n;
      this.forceUpdate();
    };
    this.state = {
      transitionDiffs: [0, 0],
      time: 0,
      changes: 0, // This is useless for now
      universe: [{ x: 0.5, y: 0.5, radius: RADIUS }].concat(
        sortUniverse(
          UNIVERSE_TYPE_MAPPING[universe](
            this.canvasState.canvasSize,
            dotSize,
            dotCount
          )
        )
      ),
      pixelShift: [0, 0],
      active: 0,
      observer: new ResizeObserver(entries => {
        const newWidth = entries[0].contentRect.width;
        if (newWidth !== this.canvasState.canvasSize[0])
          this.setCanvasState({
            ...this.canvasState,
            canvasSize: [newWidth, newWidth / 2]
          });
      })
    };
  }

  componentDidUpdate() {
    if (this.state.time < EXPANSION_TIME)
      setTimeout(
        () =>
          this.setState({
            pixelShift: [
              this.spaceSize[0] - this.canvasState.canvasSize[0],
              this.spaceSize[1] - this.canvasState.canvasSize[1]
            ],
            time:
              this.state.time + 1 > EXPANSION_TIME
                ? this.state.time
                : this.state.time + 1
          }),
        10
      );
    else if (this.state.transition) {
      const newDiffs = getDiffs(
        this.state,
        this.canvasState.canvasSize,
        this.spaceSize,
        this.setState.bind(this),
        this.state.active
      );
      const approached = this.diffs.map((el, i) =>
        approach(el + this.state.transitionDiffs[i], newDiffs[i])
      );
      if (approached.slice(0, 2).every((el, i) => el === newDiffs[i])) {
        this.setState({
          transition: false,
          transitionDiffs: [0, 0],
          oldActive: undefined
        });
      } else {
        const transitionDiffs = approached.map((el, i) => el - this.diffs[i]);
        setTimeout(() => this.setState({ transitionDiffs }), 50);
      }
    } else {
      setTimeout(
        () => getChangedCenter(this.state, this.setState.bind(this)),
        CHANGE_TIMEOUT
      );
    }
  }

  render() {
    const { canvasState, canvas, hubble } = this;
    const { canvasSize } = canvasState;
    if (hubble) {
      this.state.observer.observe(hubble);
    }
    if (canvas) {
      const ctx = canvas.getContext("2d");

      ctx.clearRect(0, 0, canvasSize[0], canvasSize[1]);

      const spaceSize = getExpandedSpaceSize(...canvasSize, this.state.time);
      this.spaceSize = spaceSize;
      this.state.universe.forEach((pos, i) =>
        ctxDraw(
          ...getOrigPoss(pos, canvasSize),
          ctx,
          START_COLOR,
          this.state.active === i && "fill"
        )
      );
      const diffs = getDiffs(
        this.state,
        canvasSize,
        spaceSize,
        this.setState.bind(this),
        [this.state.oldActive, this.state.active].find(el => el !== undefined)
      );
      this.diffs = diffs;
      this.state.universe.forEach(pos => {
        const poss = getShiftedPoss(pos, this.state, spaceSize);
        const posX = poss[0] + diffs[0] + this.state.transitionDiffs[0];
        const posY = poss[1] + diffs[1] + this.state.transitionDiffs[1];
        ctxDraw(posX, posY, poss[2], ctx, GRADIENT[this.state.time]);
      });
    }
    return (
      <div
        ref={me => {
          if (!this.hubble) {
            this.hubble = me;
            this.forceUpdate();
          }
        }}
        className="hubble-expansion"
      >
        <div className="container">
          <canvas
            width={`${canvasState.canvasSize[0]}px`}
            height={`${canvasState.canvasSize[1]}px`}
            ref={me => {
              if (!this.canvas) {
                this.canvas = me;
                this.forceUpdate();
              }
            }}
          />
        </div>

        <p className="hubble-caption">
          <span>Hubble expansion</span>
        </p>
      </div>
    );
  }
}

export default Hubble;
