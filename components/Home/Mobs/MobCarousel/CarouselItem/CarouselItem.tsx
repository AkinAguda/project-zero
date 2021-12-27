import React from "react";
import { mergeClasses } from "@hzn/utils/functions";
import { CarouselItemViewProps } from "./types";
import classes from "./CarouselItem.module.scss";

const CarouselItem: React.FC<CarouselItemViewProps> = ({
  canvasRef,
  active,
}) => (
  <div className={mergeClasses(classes.container, [active, classes.active])}>
    <canvas ref={canvasRef}></canvas>
  </div>
);

export default CarouselItem;
