import React from "react";
import { storiesOf } from "@storybook/react";
import Hubble from "../src/index";

storiesOf("Hubble", module)
  .add("random universe, random dot", () => (
    <Hubble universe="random" dotSize="random" />
  ))
  .add("ordered universe, random dot", () => (
    <Hubble universe="ordered" dotSize="random" />
  ))
  .add("ordered universe, uniform dot", () => (
    <Hubble universe="ordered" dotSize="uniform" />
  ))
  .add("random universe, random dot, custom count", () => (
    <Hubble universe="random" dotSize="random" dotCount={80} />
  ));
