import { RefObject } from "react";
import { TextureConfig } from "@hzn/utils/webgl";
import { FilterFrameType } from ".";

export type FilterTypes =
  | "EMBOSS"
  | "GAUSSIAN_BLUR"
  | "UNSHARPEN"
  | "NORMAL"
  | "BOX_BLUR";

export interface Filter {
  type: FilterTypes;
  intensity?: number;
}

interface FilterFrameCommonProps
  extends React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  canvasRef: RefObject<HTMLCanvasElement>;
}

export interface FilterFrameContainerProps extends FilterFrameCommonProps {
  state: FilterFrameType;
}

export interface FilterFrameViewProps extends FilterFrameCommonProps {}

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

export interface DrawWithFilterArgs {
  frameBuffer: WebGLFramebuffer;
  config: TextureConfig;
  filter: Filter;
  polyCount: number;
  texture: WebGLTexture | null;
}
