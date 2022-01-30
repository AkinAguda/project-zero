import { mergeClasses } from "@hzn/utils/functions";
import { CAROUSEL_ITEM_WIDTH } from "./constants";

export const getMiddleIndex = (length: number) => Math.floor(length / 2);

export const getCarouselItemWidth = () =>
  (CAROUSEL_ITEM_WIDTH / window.innerWidth) * 100;

export const getSizeClasses = (
  classes: { [key: string]: string },
  index: number,
  activeIndex: number
) => {
  const diff = Math.abs(index - activeIndex);
  const diffClass = diff === 1 ? classes["close"] : classes["normal"];
  if (index < activeIndex) {
    return mergeClasses(classes["leftSide"], diffClass);
  } else if (index > activeIndex) {
    return mergeClasses(classes["rightSide"], diffClass);
  } else {
    return "";
  }
};

export const truncate = (str: string, n: number) =>
  str.length > n ? str.substring(0, n - 1) + "..." : str;
