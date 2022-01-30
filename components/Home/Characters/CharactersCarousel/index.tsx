import React, { useState, useEffect, useRef } from "react";
import { getMiddleIndex, getCarouselItemWidth } from "./functions";
import { CHARACTERS } from "./constants";
import CharactersCarousel from "./CharactersCarousel";
import { Timer } from "./types";

const CharactersCarouselContainer: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(
    getMiddleIndex(CHARACTERS.length)
  );
  const [centerSlidePercentage, setCenterSlidePercentage] = useState(0);
  const [ready, setReady] = useState(false);
  const resizeTimeout = useRef<Timer>();

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (resizeTimeout.current) {
        clearTimeout(resizeTimeout.current);
      }
      resizeTimeout.current = setTimeout(() => {
        setCenterSlidePercentage(getCarouselItemWidth());
        clearTimeout(resizeTimeout.current!);
      }, 50);
    });
    setCenterSlidePercentage(getCarouselItemWidth());
    setReady(true);
  }, []);

  return (
    <CharactersCarousel
      setActiveIndex={setActiveIndex}
      characters={CHARACTERS}
      activeIndex={activeIndex}
      centerSlidePercentage={centerSlidePercentage}
      ready={ready}
    />
  );
};

export default CharactersCarouselContainer;
