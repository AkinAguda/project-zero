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
    renderFrame(imageUrl).then(() =>
      setTimeout(() => {
        transition({
          filter: ["NORMAL"],
          duration: 50000,
          greyscale: 1.0,
        }).then((v) => console.log(v));
      }, 0)
    );
  }, [renderFrame, imageUrl, transition]);
  return <FilterFrame canvasRef={canvasRef} />;
};

export default FilterFrameontainer;
