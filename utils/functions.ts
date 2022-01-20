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
 * instead of callbacks.
 *
 * @param url - Url of the image
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
 * This rounds numbers up to a specified precision. Where the precsion value is
 * always a power of 10. The number of zeros in the precision value determines the
 * number of decimal places in the final result.
 *
 * Examples:
 *
 * 0.3333 rounded to a precision of 10 returns 0.3.
 *
 * 0.3333 rounded to a precision of 100 return 0.33
 *
 * @param number - This is the number we want to round
 * @param precision - This is the precision in powers of 10
 * @returns
 */
export const round = (number: number, precision: number) =>
  Math.round((number + Number.EPSILON) * precision) / precision;

/**
 * Given a range, this function determines where a value falls within that range
 * and maps that to a range of 0 -> 1.
 *
 * Examples:
 *
 * Given a range of 20 -> 100, the value 40 will return 0.25. Which is 25% of the way from 20 to 100.
 *
 * Similarly, given a range of 100 -> 20, the value 40 will return 0.75 (75%) of the way to from 100 to 20.
 *
 * @param start - Start of the range
 * @param end - End point of the range
 * @param value - A value that MUST be within range
 * @returns
 */
export const getValInRangeFromZeroToOne = (
  start: number,
  end: number,
  value: number
) => {
  const max = Math.max(start, end);
  const min = Math.min(start, end);

  if (value > max) {
    throw new Error(
      `The value ${value}, cannot be greater than the maximum value ${max} in the range`
    );
  }
  if (value < min) {
    throw new Error(
      `The value ${value}, cannot be less than the minimum value ${min} in the range`
    );
  }

  return (value - start) / (end - start);
};

/**
 * Given a range, this function takes a value between 0 -> 1 and finds what that value corresponds to
 * in the specified range.
 *
 * Examples:
 *
 * Given a range of 20 -> 100, the value 0.25 will return 40 as it is 25% of the way from 20 to 100.
 *
 * Similarly, given a range of 100 -> 20, the value 0.75 will return 40 as it is 75% of tew way from 100 to 20.
 *
 * @param start - Start of the range
 * @param end - End point of the range
 * @param value - A value that MUST be within 0 -> 1
 * @returns
 */
export const getValueInRangeFromRangeInZeroToOne = (
  start: number,
  end: number,
  value: number
) => {
  if (value < 0) {
    throw new Error(`The value ${value}, cannot be less than 0`);
  }

  if (value > 1) {
    throw new Error(`The value ${value}, cannot be greater than 1`);
  }

  return value * (end - start) + start;
};
