import React from "react";
import { FilterFrame } from "@hzn/common";
import classes from "./MobCarousel.module.scss";

const MobCarousel: React.FC = () => (
  <div className={classes.container}>
    <FilterFrame filter={["NORMAL"]} imageUrl="/behemoth.jpg" />
    <FilterFrame filter={["EMBOSS"]} imageUrl="/tallneck.jpg" />
    <FilterFrame filter={["NORMAL"]} imageUrl="/stormbird.jpg" />
  </div>
);

export default MobCarousel;
