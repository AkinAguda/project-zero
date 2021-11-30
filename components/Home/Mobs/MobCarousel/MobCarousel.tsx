import React from "react";
import { FilterFrame } from "@hzn/common";
import classes from "./MobCarousel.module.scss";

const MobCarousel: React.FC = () => (
  <div className={classes.container}>
    <FilterFrame filter="BLACK_AND_WHITE" imageUrl="/behemoth.jpg" />
    <FilterFrame filter="BLACK_AND_WHITE" imageUrl="/tallneck.jpg" />
    <FilterFrame filter="BLACK_AND_WHITE" imageUrl="/stormbird.jpg" />
  </div>
);

export default MobCarousel;
