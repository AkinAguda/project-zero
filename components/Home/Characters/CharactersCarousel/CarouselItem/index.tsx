import React, { useEffect, useState, useRef } from "react";
import { useTransitionFrame } from "@hzn/hooks/TransitionFrame";
import { FrameState } from "@hzn/hooks/TransitionFrame/types";
import { NOISE_QUANTITY_CONSTANT } from "./constants";
import { CarouselItemConainerProps } from "./types";
import CarouselItem from "./CarouselItem";

const CarouselItemContainer: React.FC<CarouselItemConainerProps> = ({
  mob,
  active,
}) => {
  const activeRef = useRef(active);
  const [inistalRenderFinished, setInistalRenderFinished] = useState(false);
  const firstMount = useRef(true);
  const configRef = useRef<FrameState>({
    greyscale: activeRef.current ? 0 : 1,
    noise: activeRef.current ? 0 : NOISE_QUANTITY_CONSTANT,
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
          duration: 800,
          nextState: {
            greyscale: active ? 0 : 1,
            noise: active ? 0 : NOISE_QUANTITY_CONSTANT,
          },
        });
      }
    }
    if (!firstMount.current && inistalRenderFinished) {
      firstMount.current = true;
    }
    activeRef.current = active;
  }, [active, inistalRenderFinished, transition]);

  return (
    <CarouselItem canvasRef={canvasRef} active={active} mobName={mob.name} />
  );
};

export default CarouselItemContainer;
