import { RefObject } from "react";

export interface MobDescriptionContainerProps {
  description: string;
}

export interface MobDescriptionViewProps extends MobDescriptionContainerProps {
  paragraphRef: RefObject<HTMLParagraphElement>;
}
