import React from "react";
import { Carousel } from "react-responsive-carousel";
import { mergeClasses } from "@hzn/utils/functions";
import CarouselItem from "./CarouselItem";
import { getSizeClasses } from "./functions";
import { CharacterCarouselViewProps } from "./types";
import classes from "./CharactersCarousel.module.scss";

const CharactersCarousel: React.FC<CharacterCarouselViewProps> = ({
  activeIndex,
  setActiveIndex,
  centerSlidePercentage,
  characters,
}) => (
  <div className={classes.container}>
    <div className={classes.left}>
      <Carousel
        selectedItem={activeIndex}
        showArrows={false}
        showIndicators={false}
        showStatus={false}
        centerSlidePercentage={centerSlidePercentage}
        onChange={setActiveIndex}
        onClickItem={setActiveIndex}
        transitionTime={300}
        showThumbs={false}
        centerMode
        useKeyboardArrows
        emulateTouch
        swipeable
      >
        {characters.map((mob, index) => (
          <React.Fragment key={characters[index].name}>
            <div
              className={mergeClasses(classes.itemWrapper, [
                activeIndex !== index,
                getSizeClasses(classes, index, activeIndex),
              ])}
            >
              <CarouselItem mob={mob} active={activeIndex === index} />
            </div>
          </React.Fragment>
        ))}
      </Carousel>
    </div>
  </div>
);

export default CharactersCarousel;
