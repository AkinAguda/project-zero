import React from "react";
import LogoSvg from "@hzn/svgs/logo.svg";
import MobCarousel from "./MobCarousel/MobCarousel";
import classes from "./Mobs.module.scss";
import { mergeClasses } from "@hzn/utils/functions";

const Mobs: React.FC = () => (
  <div className={classes.container}>
    <LogoSvg />
    <h3 className={mergeClasses("h3-1", classes.subHeading)}>
      Beasts of metal, wrath, and destruction
    </h3>
    <p className={mergeClasses("p-1", classes.description)}>
      Witness the new age of beasts in the post apocalyptic world. What could
      have happened to the Mother Nature and the life she brimmed with?
    </p>
    <MobCarousel />
  </div>
);

export default Mobs;
