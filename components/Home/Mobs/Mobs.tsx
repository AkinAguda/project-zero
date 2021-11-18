import React from "react";
import { FilterFrame } from "@hzn/common";
import classes from "./Mobs.module.css";

const Mobs: React.FC = () => (
  <div className={classes.container}>
    <FilterFrame filter="BLACK_AND_WHITE" />
  </div>
);

export default Mobs;
