import { Filter } from "@hzn/hooks/FilterFrame/types";
import { MobData } from "./constants";

export interface MobCarouselViewProps {
  mobs: MobData[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  centerSlidePercentage: number;
  ready: boolean;
}

export type Timer = ReturnType<typeof setTimeout>;
