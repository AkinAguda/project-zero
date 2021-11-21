import React from "react";
import { FilterFrame } from "@hzn/common";
import classes from "./MobCarousel.module.scss";

const MobCarousel: React.FC = () => (
  <div className={classes.container}>
    <FilterFrame filter="BLACK_AND_WHITE" imageUrl="/aloy-peace.jpg" />
    <FilterFrame filter="BLACK_AND_WHITE" imageUrl="/aloy-peace.jpg" />
    <FilterFrame filter="BLACK_AND_WHITE" imageUrl="/aloy-peace.jpg" />
  </div>
);

export default MobCarousel;
