import React, { useRef, useEffect } from "react";
import { MobDescriptionContainerProps } from "./types";
import ModDescription from "./MobDescription";

const ModDescriptionContainer: React.FC<MobDescriptionContainerProps> = ({
  description,
}) => {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const paragraph = paragraphRef.current;
    timer.current = setTimeout(() => {
      paragraphRef.current?.classList.add("pop-appear-1-300");
    });
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
      timer.current = null;
      if (paragraph) paragraph.classList.remove("pop-appear-1-300");
    };
  }, [description]);

  return (
    <ModDescription description={description} paragraphRef={paragraphRef} />
  );
};

export default ModDescriptionContainer;
