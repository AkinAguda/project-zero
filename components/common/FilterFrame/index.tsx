import { useEffect } from "react";
import { useFilterFrame } from "./hooks";
import { FilterFrameContainerProps } from "./types";
import FilterFrame from "./FilterFrame";

const FilterFrameontainer: React.FC<FilterFrameContainerProps> = ({
  imageUrl,
  filter,
}) => {
  const { canvasRef, renderFrame } = useFilterFrame(filter);
  useEffect(() => {
    renderFrame(imageUrl);
  }, [renderFrame, imageUrl]);
  return <FilterFrame canvasRef={canvasRef} />;
};

export default FilterFrameontainer;
