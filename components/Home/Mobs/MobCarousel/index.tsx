import React, { useState, useEffect } from "react";
import { Filter } from "@hzn/hooks/FilterFrame/types";
import MobCarousel from "./MobCarousel";
import { MOBS } from "./constants";
import { getMobsFilters, getMiddleIndex } from "./functions";

const MobCarouselContainer: React.FC = () => {
  const [activeIndex] = useState(getMiddleIndex(MOBS.length));
  const [mobsFilters] = useState<Filter[][]>(getMobsFilters(MOBS, activeIndex));
  return (
    <MobCarousel
      mobsFilters={mobsFilters}
      mobs={MOBS}
      activeIndex={activeIndex}
    />
  );
};

export default MobCarouselContainer;
