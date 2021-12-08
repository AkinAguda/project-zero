import { useState, useRef } from "react";
import {
  loadImage,
  getPolyVertices,
  getValueClosestTo,
  splitRectangeIntoHexagons,
} from "@hzn/utils/functions";
import {
  createAndSetupTexture,
  createTexturesWithFrameBuffers,
  getRectangleVertices,
} from "@hzn/utils/webgl";
import { Point, Polygon } from "@hzn/utils/types";
import { getConvolutionKernel, setupImageRenderer } from "./functions";
import { FilterTypes } from "./types";

/**
 * This hook is responsible for everything regarding the filter frame.
 * This hook returns the curret state of the filter frame and information regarding it.
 * @param selectedFilter This is the filter you want frame to have
 * @returns
 */
export const useFilterFrame = (
  selectedFilter: FilterTypes[],
  greyScale = 0
) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRendered = useRef(false);
  const [filters, setFilters] = useState<FilterTypes[]>(selectedFilter);
  type ImageRendererType = ReturnType<typeof setupImageRenderer>;
  const imageRendererObj = useRef<ImageRendererType | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const polygons = useRef<Polygon[]>([]);
  const renderFrame = (imageUrl: string) =>
    new Promise(async (resolve, reject) => {
      const [image, error] = await loadImage(imageUrl);
      imageRef.current = image;
      if (error) {
        reject(error);
      }
      const gl = canvasRef.current?.getContext("webgl");
      if (image && gl && canvasRef.current) {
        const canvas = canvasRef.current;

        imageRendererObj.current = setupImageRenderer(gl, image, canvas);

        polygons.current = splitRectangeIntoHexagons(
          canvas.width,
          canvas.height,
          100,
          60
        );

        const { drawWithKernel, setFramebuffer, setVertices, setGreyscale } =
          imageRendererObj.current;

        setGreyscale(greyScale);

        const canvasVertices = getRectangleVertices(
          0,
          0,
          canvas.width,
          canvas.height
        );
        const imageVertices = getRectangleVertices(
          0,
          0,
          image.width,
          image.height
        );

        setVertices(canvasVertices, imageVertices);

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

          drawWithKernel(
            getConvolutionKernel(filter),
            canvasVertices.length / 2
          );

          gl.bindTexture(gl.TEXTURE_2D, textures[index % 2]);
        });

        setFramebuffer(null, { width: canvas.width, height: canvas.height });

        drawWithKernel(
          getConvolutionKernel("NORMAL"),
          canvasVertices.length / 2
        );

        frameRendered.current = true;

        resolve("SUCCESS");
      } else {
        reject("ERROR OCCURED SOMEWHERE");
      }
    });

  const transition = (finalFilters: FilterTypes[], time = 1) =>
    new Promise((resolve, reject) => {
      const gl = canvasRef.current?.getContext("webgl");
      const image = imageRef.current!;
      if (gl) {
        if (!frameRendered.current) {
          reject("RENDER A FRAME with renderFrame before trying to transition");
        } else {
          const { drawWithKernel, setFramebuffer, setVertices, setGreyscale } =
            imageRendererObj.current!;

          setGreyscale(0.0);

          const idealHyp = 100;
          const canvas = canvasRef.current!;
          // const x = 300;
          // const y = 400;

          for (let i = 0; i < polygons.current.length; i++) {
            /////////////////////////////////////////
            const x = polygons.current[i].center[0];
            const y = polygons.current[i].center[1];
            // const hyp = 100;
            const hypX = getValueClosestTo(idealHyp, canvas.width);
            const hypY = getValueClosestTo(idealHyp, canvas.height);
            const angle = 60;

            const canvasVertices = getPolyVertices([x, y], [hypX, hypY], angle);
            const imageVertices = getPolyVertices(
              [
                x * (image.width / canvas.width),
                y * (image.height / canvas.height),
              ],
              [
                hypX * (image.width / canvas.width),
                hypY * (image.height / canvas.height),
              ],
              angle
            );
            /////////////////////////////////////////
            setVertices(canvasVertices, imageVertices);

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

            finalFilters.forEach((filter, index) => {
              setFramebuffer(frameBuffers[index % 2], configs[index % 2]);

              drawWithKernel(
                getConvolutionKernel(filter),
                canvasVertices.length / 2
              );

              gl.bindTexture(gl.TEXTURE_2D, textures[index % 2]);
            });

            setFramebuffer(null, {
              width: canvas.width,
              height: canvas.height,
            });

            drawWithKernel(
              getConvolutionKernel("NORMAL"),
              canvasVertices.length / 2
            );
            /////////////////////////////////////////
          }
        }
        resolve("TRANSITIONED");
      }
    });

  return {
    renderFrame,
    filters,
    setFilters,
    canvasRef,
    transition,
  };
};
