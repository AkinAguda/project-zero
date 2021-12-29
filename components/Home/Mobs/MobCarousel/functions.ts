import { MobData, CAROUSEL_ITEM_WIDTH } from "./constants";

export const getMiddleIndex = (length: number) => Math.floor(length / 2);

export const getCarouselItemWidth = () =>
  (CAROUSEL_ITEM_WIDTH / window.innerWidth) * 100;

export const getSizeClasses = (
  classes: { [key: string]: string },
  index: number,
  activeIndex: number
) => {
  const diff = Math.abs(index - activeIndex);
  switch (diff) {
    case 1:
      return classes["sizeOne"];
    case 2:
      return classes["sizeTwo"];

    default:
      return classes["sizeThree"];
  }
};
