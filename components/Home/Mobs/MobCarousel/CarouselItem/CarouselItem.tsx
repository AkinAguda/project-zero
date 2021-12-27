import React from "react";
import { CarouselItemViewProps } from "./types";
import classes from "./CarouselItem.module.scss";

const CarouselItem: React.FC<CarouselItemViewProps> = ({ canvasRef }) => (
  <div className={classes.container}>
    <canvas ref={canvasRef}></canvas>
  </div>
);

export default CarouselItem;
