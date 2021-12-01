import { useState, useRef } from "react";
import { loadImage } from "@hzn/utils/functions";
import {
  createAndSetupTexture,
  createTexturesWithFrameBuffers,
} from "@hzn/utils/webgl";
import { getConvolutionKernel, setupImageRenderer } from "./functions";
import { FilterTypes } from "./types";

/**
 * This hook is responsible for everything regarding the filter frame.
 * This hook returns the curret state of the filter frame and information regarding it.
 * @param selectedFilter This is the filter you want frame to have
 * @returns
 */
export const useFilterFrame = (selectedFilter: FilterTypes[]) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filters, setFilters] = useState<FilterTypes[]>(selectedFilter);
  const renderFrame = (imageUrl: string) =>
    new Promise(async (resolve, reject) => {
      const [image, error] = await loadImage(imageUrl);
      if (error) {
        reject(error);
      }
      const gl = canvasRef.current?.getContext("webgl");
      if (image && gl && canvasRef.current) {
        const canvas = canvasRef.current;
        const { drawWithKernel, setFramebuffer } = setupImageRenderer(
          gl,
          image,
          canvas
        );

        const [textures, frameBuffers, configs] =
          createTexturesWithFrameBuffers(gl, [
            { width: canvas.width, height: canvas.height },
            { width: canvas.width, height: canvas.height },
          ]);

        createAndSetupTexture(gl);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );

        filters.forEach((filter, index) => {
          setFramebuffer(frameBuffers[index % 2], configs[index % 2]);

          drawWithKernel(getConvolutionKernel(filter));

          gl.bindTexture(gl.TEXTURE_2D, textures[index % 2]);
        });
        setFramebuffer(null, { width: canvas.width, height: canvas.height });

        drawWithKernel(getConvolutionKernel("NORMAL"));
      }
    });

  return {
    renderFrame,
    filters,
    setFilters,
    canvasRef,
  };
};
