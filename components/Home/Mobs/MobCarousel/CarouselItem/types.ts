import { MobData } from "./../constants";
import { Filter } from "@hzn/hooks/FilterFrame/types";

export interface CarouselItemViewProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export interface CarouselItemConainerProps {
  mob: MobData;
  filters: Filter[];
}
