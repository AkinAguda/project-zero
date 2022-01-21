export type CharacterType = "PROTECTOR" | "SOLDIER" | "WARRIOR" | "ROYALTY";

export interface CharacterData {
  pictureUrl: string;
  name: string;
  characterTitle: string;
  description: string[];
  characterType: CharacterType;
}

export interface MobCarouselViewProps {
  characters: CharacterData[];
  activeIndex: number;
  setActiveIndex: (index: number) => void;
  centerSlidePercentage: number;
  ready: boolean;
}

export type Timer = ReturnType<typeof setTimeout>;
