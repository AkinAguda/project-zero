import { RefObject } from "react";

export type FilterTypes = "EMBOSS" | "GAUSSIAN_BLUR" | "UNSHARPEN" | "NORMAL";

export interface Filter {
  type: FilterTypes;
  intensity?: number;
}

export interface FilterFrameContainerProps
  extends React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  filters: Filter[];
  imageUrl: string;
  greyscale?: number;
}

export interface FilterFrameViewProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}

export interface TransitionConfig {
  /**
   * This is the duration of the transition in milliseconds
   */
  duration: number;
  /**
   * This is an array of filters to who'se final value will be given at the end of the transition
   */
  filters: Filter[];
  /**
   * This is the final greyscale intensity
   */
  greyscale?: number;
}
