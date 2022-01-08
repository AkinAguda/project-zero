import { RefObject } from "react";
import { TextureConfig } from "@hzn/utils/webgl";
import { FilterFrameType } from ".";

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
   * This is the final greyscale intensity
   */
  greyscale: number;
}

export interface DrawWithFilterArgs {
  frameBuffer: WebGLFramebuffer;
  config: TextureConfig;
  polyCount: number;
  texture: WebGLTexture | null;
}
