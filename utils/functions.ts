import { ConditionalClass, Point } from "./types";

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

export const m3 = {
  projection: function (width: number, height: number) {
    //TODO: Need to update projection matrix
    return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
  },

  multiply: (a: number[], b: number[]) => {
    const a00 = a[0 * 3 + 0];
    const a01 = a[0 * 3 + 1];
    const a02 = a[0 * 3 + 2];
    const a10 = a[1 * 3 + 0];
    const a11 = a[1 * 3 + 1];
    const a12 = a[1 * 3 + 2];
    const a20 = a[2 * 3 + 0];
    const a21 = a[2 * 3 + 1];
    const a22 = a[2 * 3 + 2];
    const b00 = b[0 * 3 + 0];
    const b01 = b[0 * 3 + 1];
    const b02 = b[0 * 3 + 2];
    const b10 = b[1 * 3 + 0];
    const b11 = b[1 * 3 + 1];
    const b12 = b[1 * 3 + 2];
    const b20 = b[2 * 3 + 0];
    const b21 = b[2 * 3 + 1];
    const b22 = b[2 * 3 + 2];
    return [
      b00 * a00 + b01 * a10 + b02 * a20,
      b00 * a01 + b01 * a11 + b02 * a21,
      b00 * a02 + b01 * a12 + b02 * a22,
      b10 * a00 + b11 * a10 + b12 * a20,
      b10 * a01 + b11 * a11 + b12 * a21,
      b10 * a02 + b11 * a12 + b12 * a22,
      b20 * a00 + b21 * a10 + b22 * a20,
      b20 * a01 + b21 * a11 + b22 * a21,
      b20 * a02 + b21 * a12 + b22 * a22,
    ];
  },
};

export const angleInRadians = (angle: number) => (angle * Math.PI) / 180;

const quadrantFuncs: Array<
  (point: Point, hypCoords: Point, angle: number) => Point
> = [
  (point: Point, hypCoords: Point, angle: number) => [
    point[0] + Math.sin(angleInRadians(angle)) * hypCoords[0],
    point[1] + Math.cos(angleInRadians(angle)) * hypCoords[1],
  ],

  (point: Point, hypCoords: Point, angle: number) => [
    point[0] + Math.cos(angleInRadians(angle - 90)) * hypCoords[0],
    point[1] - Math.sin(angleInRadians(angle - 90)) * hypCoords[1],
  ],

  (point: Point, hypCoords: Point, angle: number) => [
    point[0] - Math.sin(angleInRadians(angle - 180)) * hypCoords[0],
    point[1] - Math.cos(angleInRadians(angle - 180)) * hypCoords[1],
  ],

  (point: Point, hypCoords: Point, angle: number) => [
    point[0] - Math.cos(angleInRadians(angle - 270)) * hypCoords[0],
    point[1] + Math.sin(angleInRadians(angle - 270)) * hypCoords[1],
  ],
];

export const getPolygonCoords = (
  point: Point,
  hypCoords: Point,
  angle: number
) => {
  const cornerCoords: [number, number][] = [];
  const numberOfSides = 360 / angle;

  let quadrantIndex = 0;
  let cumulativeAngle = 0;
  let quadrantMax = 90;

  for (let i = 0; i < numberOfSides; i++) {
    if (cumulativeAngle >= quadrantMax) {
      quadrantIndex++;
      quadrantMax += 90;
    }
    const coords = quadrantFuncs[quadrantIndex](
      point,
      hypCoords,
      cumulativeAngle
    );
    cornerCoords.push([round(coords[0], 100), round(coords[1], 100)]);
    cumulativeAngle += angle;
  }

  return cornerCoords;
};

export const getPolyVertices = (
  point: Point,
  hypCoords: Point,
  angle: number
) => {
  const vertices: number[] = [];
  const coords = getPolygonCoords(point, hypCoords, angle);

  for (let i = 1; i < coords.length; i++) {
    const poin1 = coords[i - 1];
    const poin2 = coords[i];
    vertices.push(poin1[0]);
    vertices.push(poin1[1]);
    vertices.push(point[0]);
    vertices.push(point[1]);
    vertices.push(poin2[0]);
    vertices.push(poin2[1]);
  }
  vertices.push(coords[coords.length - 1][0]);
  vertices.push(coords[coords.length - 1][1]);
  vertices.push(point[0]);
  vertices.push(point[1]);
  vertices.push(coords[0][0]);
  vertices.push(coords[0][1]);

  return vertices;
};
