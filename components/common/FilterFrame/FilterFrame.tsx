import { mergeClasses } from "@hzn/utils/functions";
import { FilterFrameViewProps } from "./types";
import classes from "./FilterFrame.module.scss";

const FilterFrame: React.FC<FilterFrameViewProps> = ({ canvasRef }) => (
  <canvas className={classes.container} ref={canvasRef}></canvas>
);

export default FilterFrame;
