import { RefObject } from "react";

export type FilterTypes = "EMBOSS" | "GAUSSIAN_BLUR" | "UNSHARPEN" | "NORMAL";

export interface FilterFrameContainerProps
  extends React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  filter: FilterTypes[];
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
  filter: FilterTypes[];
  /**
   * This is the final greyscale intensity
   */
  greyscale?: number;
}
