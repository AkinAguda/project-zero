import { MobData } from "./../constants";
import { Filter } from "@hzn/hooks/FilterFrame/types";

interface CarouselItemCommonProps {
  active: boolean;
}

export interface CarouselItemViewProps extends CarouselItemCommonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

export interface CarouselItemConainerProps extends CarouselItemCommonProps {
  mob: MobData;
}
