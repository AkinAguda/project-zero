import { useRef } from "react";
import { FilterFrameContainerProps } from "./types";
import FilterFrame from "./FilterFrame";

const FilterFrameontainer: React.FC<FilterFrameContainerProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  return <FilterFrame canvasRef={canvasRef} />;
};

export default FilterFrameontainer;
