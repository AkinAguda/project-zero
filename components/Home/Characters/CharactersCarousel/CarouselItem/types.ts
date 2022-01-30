import { MobData } from "./../types";

interface CarouselItemCommonProps {
  active: boolean;
}

export interface CarouselItemViewProps extends CarouselItemCommonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  mobName: string;
}

export interface CarouselItemConainerProps extends CarouselItemCommonProps {
  mob: MobData;
}
