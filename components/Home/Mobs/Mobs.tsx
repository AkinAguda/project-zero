import React from "react";
import WebglCondition from "@hzn/common/WebglCondition";
import LogoSvg from "@hzn/svgs/logo.svg";
import MobCarousel from "./MobCarousel";
import classes from "./Mobs.module.scss";
import { mergeClasses } from "@hzn/utils/functions";

const Mobs: React.FC = () => (
  <div className={classes.container}>
    <div className={classes.intro}>
      <LogoSvg />
      <h3 className={mergeClasses("h3-1", classes.subHeading)}>
        Beasts of metal, wrath, and destruction
      </h3>
    </div>
    <WebglCondition usesWebgl>
      <MobCarousel />
    </WebglCondition>
  </div>
);

export default Mobs;
