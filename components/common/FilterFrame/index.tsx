import { useEffect } from "react";
import { useFilterFrame } from "./hooks";
import { FilterFrameContainerProps } from "./types";
import FilterFrame from "./FilterFrame";

const FilterFrameontainer: React.FC<FilterFrameContainerProps> = ({
  imageUrl,
  filter,
  greyscale,
}) => {
  const { canvasRef, renderFrame, transition } = useFilterFrame(
    filter,
    greyscale
  );
  useEffect(() => {
    renderFrame(imageUrl)
      .then(() => transition(["NORMAL"]))
      .then((v) => console.log(v));
  }, [renderFrame, imageUrl, transition]);
  return <FilterFrame canvasRef={canvasRef} />;
};

export default FilterFrameontainer;
