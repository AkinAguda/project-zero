import React, { useState, useEffect, useRef } from "react";
import { Filter } from "@hzn/hooks/FilterFrame/types";
import MobCarousel from "./MobCarousel";
import { MOBS } from "./constants";
import {
  getMobsFilters,
  getMiddleIndex,
  getCarouselItemWidth,
} from "./functions";
import { Timer } from "./types";

const MobCarouselContainer: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(getMiddleIndex(MOBS.length));
  const [mobsFilters] = useState<Filter[][]>(getMobsFilters(MOBS, activeIndex));
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(0);
  const [ready, setReady] = useState(false);
  const resizeTimeout = useRef<Timer>();

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      resizeTimeout.current = setTimeout(() => {
        setCenterSlidePercentage(getCarouselItemWidth());
        clearTimeout(resizeTimeout.current!);
      }, 200);
    });
    setCenterSlidePercentage(getCarouselItemWidth());
    setReady(true);
  }, []);

  return (
    <MobCarousel
      setActiveIndex={setActiveIndex}
      mobsFilters={mobsFilters}
      mobs={MOBS}
      activeIndex={activeIndex}
      centerSlidePercentage={centerSlidePercentage}
      ready={ready}
    />
  );
};

export default MobCarouselContainer;
