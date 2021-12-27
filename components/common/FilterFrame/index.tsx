import { useEffect } from "react";
import { useFilterFrame } from "./hooks";
import { FilterFrameContainerProps } from "./types";
import FilterFrame from "./FilterFrame";

const FilterFrameontainer: React.FC<FilterFrameContainerProps> = ({
  imageUrl,
  filters,
  greyscale,
}) => {
  const { canvasRef, renderFrame, transition } = useFilterFrame(
    filters,
    greyscale
  );
  useEffect(() => {
    renderFrame(imageUrl)
      .then((v) => console.log(v))
      .then(() =>
        setTimeout(() => {
          transition({
            filters: [{ type: "GAUSSIAN_BLUR", intensity: 1 }],
            duration: 50000,
            greyscale: 1.0,
          }).then((v) => console.log(v));
        }, 0)
      );
  }, [renderFrame, imageUrl, transition]);
  return <FilterFrame canvasRef={canvasRef} />;
};

export default FilterFrameontainer;
