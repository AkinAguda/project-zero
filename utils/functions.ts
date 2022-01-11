import { ConditionalClass } from "./types";

/**
 * This function allows you to combine sevral classNames together.
 * For conditional classes, just pass in the condition (boolean)
 * as the first elemnt in the array and pass the classes you want
 * to merge as the other items in the array.
 */

export const mergeClasses = (
  ...args: (string | ConditionalClass)[]
): string => {
  return args.reduce((accumulator: string, currentValue) => {
    if (Array.isArray(currentValue)) {
      const bool = currentValue.shift();
      if (bool)
        return `${accumulator} ${mergeClasses(
          ...(currentValue as (string | ConditionalClass)[])
        )}`;
      return accumulator;
    }
    if (!currentValue) return accumulator;
    return `${accumulator ? `${accumulator} ` : ""}${currentValue}`;
  }, "");
};

/**
 * This function loads an image from the specified url. This returns a promise
 * instead of callbacks
 */
export const loadImage = (
  url: string
): Promise<[HTMLImageElement | null, (string | Error) | null]> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.src = url;
    image.onload = () => resolve([image, null]);
    image.onerror = (error) => reject([null, error]);
  });

/**
 * This rounds numbers up to a specified precision
 * @param number
 * @param precision
 * @returns
 */
export const round = (number: number, precision: number) =>
  Math.round((number + Number.EPSILON) * precision) / precision;

export const getValueClosestTo = (value: number, total: number): number => {
  const count = total / (value * 2);
  return total / Math.round(count) / 2;
};

export const shuffleArray = (array: any[]): any[] => {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};

export const getValInRangeToOne = (start: number, end: number, value: number) =>
  (value - start) / (end - start);
