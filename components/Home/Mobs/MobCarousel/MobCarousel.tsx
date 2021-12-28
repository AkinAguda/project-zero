import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import CarouselItem from "./CarouselItem";
import { MobCarouselViewProps } from "./types";
import classes from "./MobCarousel.module.scss";

const MobCarousel: React.FC<MobCarouselViewProps> = ({
  mobsFilters,
  mobs,
  activeIndex,
  setActiveIndex,
  centerSlidePercentage,
  ready,
}) => (
  <div>
    {ready ? (
      <Carousel
        className={classes.container}
        selectedItem={activeIndex}
        showArrows={false}
        showIndicators={false}
        showStatus={false}
        centerSlidePercentage={centerSlidePercentage}
        onChange={setActiveIndex}
        onClickItem={setActiveIndex}
        showThumbs={false}
        centerMode
        useKeyboardArrows
        emulateTouch
        swipeable
      >
        {mobsFilters &&
          mobsFilters.map((mobFilters, index) => (
            <React.Fragment key={mobs[index].name}>
              <div className={classes.itemWrapper}>
                <CarouselItem
                  mob={mobs[index]}
                  filters={mobFilters}
                  active={activeIndex === index}
                  greyscale={activeIndex !== index ? 1 : 0}
                />
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
