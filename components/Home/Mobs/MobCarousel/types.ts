import { Filter } from "@hzn/hooks/FilterFrame/types";
import { MobData } from "./constants";

export interface MobCarouselViewProps {
  mobsFilters: Filter[][];
  mobs: MobData[];
}
