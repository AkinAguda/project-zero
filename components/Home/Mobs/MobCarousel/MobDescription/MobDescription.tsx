import React from "react";
import { mergeClasses } from "@hzn/utils/functions";
import { MobDescriptionViewProps } from "./types";
import classes from "./MobDescription.module.scss";

const MobDescription: React.FC<MobDescriptionViewProps> = ({
  description,
  paragraphRef,
}) => (
  <p className={mergeClasses("p-1", classes.description)} ref={paragraphRef}>
    {description}
  </p>
);

export default MobDescription;
