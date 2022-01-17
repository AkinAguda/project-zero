export interface MobData {
  pictureUrl: string;
  name: string;
  description: string;
}

export interface MobCarouselViewProps {
  mobs: MobData[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  centerSlidePercentage: number;
  ready: boolean;
}

export type Timer = ReturnType<typeof setTimeout>;
