import { RefObject } from "react";

export type FilterTypes = "DARKEN" | "BLACK_AND_WHITE" | "SHARPEN";

export interface FilterFrameContainerProps
  extends React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  filter: FilterTypes;
  imageUrl: string;
}

export interface FilterFrameViewProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}
