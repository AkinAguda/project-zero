import { useState, useRef, useEffect } from "react";
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
  TextureConfig,
} from "@hzn/utils/webgl";
import { Polygon } from "@hzn/utils/types";
import { getConvolutionKernel, setupImageRenderer } from "./functions";
import { FilterTypes, TransitionConfig } from "./types";

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
  const canvasPolygons = useRef<Polygon[]>([]);
  const imagePolygons = useRef<Polygon[]>([]);
  const rectWRatio = useRef(0);
  const rectHRatio = useRef(0);
  const canvasW = useRef(0);
  const canvasH = useRef(0);
  const storedFB = useRef<WebGLFramebuffer | null>(null);
  const storedTex = useRef<WebGLTexture | null>(null);
  const texturesAndBuffers = useRef<
    [WebGLTexture[], WebGLFramebuffer[], TextureConfig[]]
  >([[], [], []]);

  useEffect(() => {
    const gl = canvasRef.current?.getContext("webgl");
    if (gl && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvasW.current = canvasW.current || canvas.width;
      canvasH.current = canvasH.current || canvas.height;
      rectWRatio.current = rect.width / canvasW.current;
      rectHRatio.current = rect.height / canvasH.current;
    }
  }, []);

  const renderFrame = (imageUrl: string) =>
    new Promise(async (resolve, reject) => {
      const [image, error] = await loadImage(imageUrl);
      imageRef.current = image;
      if (error) {
        reject(error);
      }
      const gl = canvasRef.current?.getContext("webgl");
      if (image && gl && canvasRef.current) {
        const angle = 60;
        const dpr = window.devicePixelRatio;
        const canvas = canvasRef.current;
        imageRendererObj.current = setupImageRenderer(gl, image, canvas);
        const idealHypX = (canvasW.current / 8) * dpr * rectWRatio.current;
        const idealHypY = (canvasH.current / 12) * dpr * rectHRatio.current;

        const hypX = getValueClosestTo(idealHypX, canvas.width);
        const hypY = getValueClosestTo(idealHypY, canvas.height);

        canvasPolygons.current = splitRectangeIntoHexagons(
          canvas.width,
          canvas.height,
          [hypX, hypY],
          angle
        );

        imagePolygons.current = splitRectangeIntoHexagons(
          image.width,
          image.height,
          [
            hypX * (image.width / canvas.width),
            hypY * (image.height / canvas.height),
          ],
          angle
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

        texturesAndBuffers.current = createTexturesWithFrameBuffers(gl, [
          { width: canvas.width, height: canvas.height },
          { width: canvas.width, height: canvas.height },
        ]);

        const [textures, frameBuffers, configs] = texturesAndBuffers.current;

        createAndSetupTexture(gl);

        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );

        let lastFBRenderedTo = frameBuffers[0];
        let lastTexRenderedTo = textures[0];

        filters.forEach((filter, index) => {
          setFramebuffer(frameBuffers[index % 2], configs[index % 2]);

          drawWithKernel(
            getConvolutionKernel(filter),
            canvasVertices.length / 2
          );
          gl.bindTexture(gl.TEXTURE_2D, textures[index % 2]);
          lastFBRenderedTo = frameBuffers[index % 2];
          lastTexRenderedTo = textures[index % 2];
        });

        storedFB.current = lastFBRenderedTo;
        storedTex.current = lastTexRenderedTo;

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

  const transition = (transitionConfig: TransitionConfig) =>
    new Promise((resolve, reject) => {
      const gl = canvasRef.current?.getContext("webgl");
      const image = imageRef.current!;
      if (gl) {
        if (!frameRendered.current) {
          reject("RENDER A FRAME with renderFrame before trying to transition");
        } else {
          const { drawWithKernel, setFramebuffer, setVertices, setGreyscale } =
            imageRendererObj.current!;

          setGreyscale(transitionConfig.greyscale || 0);

          const canvas = canvasRef.current!;

          for (let i = 0; i < canvasPolygons.current.length / 2; i++) {
            /////////////////////////////////////////////////////////////
            setVertices(
              canvasPolygons.current[i].vsVertices,
              imagePolygons.current[i].vsVertices
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
            transitionConfig.filter.forEach((filter, index) => {
              setFramebuffer(frameBuffers[index % 2], configs[index % 2]);
              drawWithKernel(
                getConvolutionKernel(filter),
                canvasPolygons.current[i].vsVertices.length / 2
              );
              gl.bindTexture(gl.TEXTURE_2D, textures[index % 2]);
            });
            setFramebuffer(null, {
              width: canvas.width,
              height: canvas.height,
            });
            drawWithKernel(
              getConvolutionKernel("NORMAL"),
              canvasPolygons.current[i].vsVertices.length / 2
            );
            ///////////////////////////////////////////////////////////////
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
