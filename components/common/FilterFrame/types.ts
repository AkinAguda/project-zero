import { RefObject } from "react";

export type filterTypes = "DARKEN" | "BLACK_AND_WHITE";

export interface FilterFrameContainerProps
  extends React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  filter: filterTypes;
}

export interface FilterFrameViewProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}
