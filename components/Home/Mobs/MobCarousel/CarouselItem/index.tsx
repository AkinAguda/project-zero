import React, { useEffect, useState } from "react";
import { useFilterFrame } from "@hzn/hooks/FilterFrame";
import { Filter } from "@hzn/hooks/FilterFrame/types";
import { getFilterBasedOnActive } from "./functions";
import { CarouselItemConainerProps } from "./types";
import CarouselItem from "./CarouselItem";

const CarouselItemContainer: React.FC<CarouselItemConainerProps> = ({
  mob,
  active,
}) => {
  const [filter, setFilter] = useState<Filter[]>(
    getFilterBasedOnActive(active)
  );
  const { renderFrame, canvasRef } = useFilterFrame(filter, active ? 0 : 1);

  useEffect(() => {
    renderFrame(mob.pictureUrl);
  }, [mob, renderFrame]);
  return <CarouselItem canvasRef={canvasRef} active={active} />;
};

export default CarouselItemContainer;
