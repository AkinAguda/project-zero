import React from "react";
import { FilterFrame } from "@hzn/common";
import classes from "./MobCarousel.module.scss";

const MobCarousel: React.FC = () => (
  <div className={classes.container}>
    {/* <FilterFrame filter={["NORMAL"]} greyscale={1.0} imageUrl="/behemoth.jpg" /> */}
    {/* <FilterFrame filter={["NORMAL"]} imageUrl="/tallneck.jpg" /> */}
    <FilterFrame filters={[{ type: "NORMAL" }]} imageUrl="/stormbird.jpg" />
  </div>
);

export default MobCarousel;
