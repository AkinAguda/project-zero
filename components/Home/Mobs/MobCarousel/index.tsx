import React, { useState, useEffect } from "react";
import { Filter } from "@hzn/hooks/FilterFrame/types";
import MobCarousel from "./MobCarousel";
import { MOBS } from "./constants";

const MobCarouselContainer: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobsFilters] = useState<Filter[][]>(
    MOBS.map(() => [{ type: "NORMAL" }])
  );
  return <MobCarousel mobsFilters={mobsFilters} mobs={MOBS} />;
};

export default MobCarouselContainer;
