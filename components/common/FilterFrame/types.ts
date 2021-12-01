import { RefObject } from "react";

export type FilterTypes = "EMBOSS" | "GAUSSIAN_BLUR" | "UNSHARPEN" | "NORMAL";

export interface FilterFrameContainerProps
  extends React.DetailedHTMLProps<
    React.CanvasHTMLAttributes<HTMLCanvasElement>,
    HTMLCanvasElement
  > {
  filter: FilterTypes[];
  imageUrl: string;
}

export interface FilterFrameViewProps {
  canvasRef: RefObject<HTMLCanvasElement>;
}
