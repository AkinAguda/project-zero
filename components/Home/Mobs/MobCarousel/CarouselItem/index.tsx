import React, { useEffect, useState, useRef } from "react";
import { useTransitionFrame, InitalConfig } from "@hzn/hooks/TransitionFrame";
import { CarouselItemConainerProps } from "./types";
import CarouselItem from "./CarouselItem";

const CarouselItemContainer: React.FC<CarouselItemConainerProps> = ({
  mob,
  active,
}) => {
  const activeRef = useRef(active);
  const [inistalRenderFinished, setInistalRenderFinished] = useState(false);
  const firstMount = useRef(true);
  const configRef = useRef<InitalConfig>({
    greyScale: activeRef.current ? 0 : 1,
  });
  const { renderFrame, canvasRef, transition } = useTransitionFrame(
    configRef.current
  );
  useEffect(() => {
    renderFrame(mob.pictureUrl).then(() => {
      setInistalRenderFinished(true);
    });
  }, [mob, renderFrame]);

  useEffect(() => {
    if (firstMount.current && inistalRenderFinished) {
      if (activeRef.current !== active) {
        transition({
          duration: 300,
          greyscale: active ? 0 : 1,
        });
      }
    }
    if (!firstMount.current && inistalRenderFinished) {
      firstMount.current = true;
    }
    activeRef.current = active;
  }, [active, inistalRenderFinished, transition]);

  return <CarouselItem canvasRef={canvasRef} active={active} />;
};

export default CarouselItemContainer;
