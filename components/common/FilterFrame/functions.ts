import { FilterTypes } from "./types";

export const getConvolutionKernel = (filter: FilterTypes): number[] => {
  switch (filter) {
    case "SHARPEN":
      return [0, -1, 0, -1, 5, -1, 0, -1, 0];
    case "BLACK_AND_WHITE":
      return [0, 0, 0, 0, 1, 0, 0, 0, 0];
    default:
      return [0, 0, 0, 0, 1, 0, 0, 0, 0];
  }
};
