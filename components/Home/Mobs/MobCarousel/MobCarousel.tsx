import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { mergeClasses } from "@hzn/utils/functions";
import CarouselItem from "./CarouselItem";
import { getSizeClasses, truncate } from "./functions";
import { MobCarouselViewProps } from "./types";
import classes from "./MobCarousel.module.scss";

const MobCarousel: React.FC<MobCarouselViewProps> = ({
  mobs,
  activeIndex,
  setActiveIndex,
  centerSlidePercentage,
  ready,
}) => (
  <div>
    <p className={mergeClasses("p-1", classes.description)}>
      {mobs[activeIndex].description}
    </p>
    {ready ? (
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
        {mobs.map((mob, index) => (
          <React.Fragment key={mobs[index].name}>
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
    ) : (
      <></>
    )}
  </div>
);

export default MobCarousel;
