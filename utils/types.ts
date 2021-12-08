export type Point = [number, number];

export type ConditionalClass = [boolean, ...(string | ConditionalClass)[]];

export interface Polygon {
  center: Point;
  vertices: Point[];
  vsVertices: number[];
}
