import React, { useEffect } from "react";
import { useFilterFrame } from "@hzn/hooks/FilterFrame";
import { CarouselItemConainerProps } from "./types";
import CarouselItem from "./CarouselItem";

const CarouselItemContainer: React.FC<CarouselItemConainerProps> = ({
  mob,
  filters,
}) => {
  const { renderFrame, canvasRef } = useFilterFrame(filters);
  useEffect(() => {
    renderFrame(mob.pictureUrl);
  }, [mob, renderFrame]);
  return <CarouselItem canvasRef={canvasRef} />;
};

export default CarouselItemContainer;
