import React from "react";
import { FilterFrame } from "@hzn/common";
import classes from "./MobCarousel.module.scss";

const MobCarousel: React.FC = () => (
  <div className={classes.container}>
    <FilterFrame filter={["UNSHARPEN"]} imageUrl="/behemoth.jpg" />
    <FilterFrame filter={["NORMAL"]} imageUrl="/tallneck.jpg" />
    <FilterFrame
      filter={["NORMAL", "GAUSSIAN_BLUR"]}
      imageUrl="/stormbird.jpg"
    />
  </div>
);

export default MobCarousel;
