import { Filter } from "@hzn/hooks/FilterFrame/types";
import { MobData, CAROUSEL_ITEM_WIDTH } from "./constants";

export const getMiddleIndex = (length: number) => Math.floor(length / 2);

export const getMobsFilters = (
  mobs: MobData[],
  activeIndex: number
): Filter[][] => {
  return mobs.map((_, index) => {
    if (index === activeIndex) {
      return [{ type: "NORMAL" }];
    } else {
      return [{ type: "GAUSSIAN_BLUR", intensity: 3 }];
    }
  });
};

export const getCarouselItemWidth = () =>
  (CAROUSEL_ITEM_WIDTH / window.innerWidth) * 100;
