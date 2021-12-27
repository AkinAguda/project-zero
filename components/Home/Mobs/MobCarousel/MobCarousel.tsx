import React from "react";
import CarouselItem from "./CarouselItem";
import { MobCarouselViewProps } from "./types";
import classes from "./MobCarousel.module.scss";

const MobCarousel: React.FC<MobCarouselViewProps> = ({ mobsFilters, mobs }) => (
  <div className={classes.container}>
    {mobsFilters &&
      mobsFilters.map((mobFilters, index) => (
        <React.Fragment key={mobs[index].name}>
          <CarouselItem mob={mobs[index]} filters={mobFilters} />
        </React.Fragment>
      ))}
  </div>
);

export default MobCarousel;
