import { useState, useRef, useEffect, useCallback } from "react";
import {
  loadImage,
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
import { Filter, TransitionConfig } from "./types";

export interface InitalConfig {
  selectedFilter: Filter[];
  greyScale?: number;
}

/**
 * This hook is responsible for everything regarding the filter frame.
 * This hook returns the curret state of the filter frame and information regarding it.
 * @param selectedFilter This is the filter you want frame to have
 * @returns
 */
export const useFilterFrame = (initialConfig: InitalConfig) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRendered = useRef(false);
  type ImageRendererType = ReturnType<typeof setupImageRenderer>;
  const imageRendererObj = useRef<ImageRendererType | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasPolygons = useRef<Polygon[]>([]);
  const imagePolygons = useRef<Polygon[]>([]);
  const rectWRatio = useRef(0);
  const rectHRatio = useRef(0);
  const canvasW = useRef(0);
  const canvasH = useRef(0);
  const renderedIndex = useRef(0);
  const glRef = useRef<WebGLRenderingContext | null | undefined>(null);
  const texturesAndBuffers = useRef<
    [WebGLTexture[], WebGLFramebuffer[], TextureConfig[]]
  >([[], [], []]);

  useEffect(() => {
    glRef.current = canvasRef.current?.getContext("webgl", {
      preserveDrawingBuffer: true,
    });
    if (glRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const rect = canvas.getBoundingClientRect();
      canvasW.current = canvasW.current || canvas.width;
      canvasH.current = canvasH.current || canvas.height;
      rectWRatio.current = rect.width / canvasW.current;
      rectHRatio.current = rect.height / canvasH.current;
    }
  }, []);

  const renderFrame = useCallback(
    (imageUrl: string) =>
      new Promise(async (resolve, reject) => {
        const [image, error] = await loadImage(imageUrl);
        imageRef.current = image;
        if (error) {
          reject(error);
        }
        const gl = glRef.current;
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

          setGreyscale(initialConfig.greyScale || 0);

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

          initialConfig.selectedFilter.forEach((filter, index) => {
            setFramebuffer(frameBuffers[index % 2], configs[index % 2]);
            drawWithKernel(
              getConvolutionKernel(filter),
              canvasVertices.length / 2
            );
            gl.bindTexture(gl.TEXTURE_2D, textures[index % 2]);
            renderedIndex.current = index % 2;
          });

          setFramebuffer(null, { width: canvas.width, height: canvas.height });

          drawWithKernel(
            getConvolutionKernel({ type: "NORMAL" }),
            canvasVertices.length / 2
          );

          frameRendered.current = true;

          resolve("SUCCESS");
        } else {
          reject("ERROR OCCURED SOMEWHERE");
        }
      }),
    [initialConfig]
  );

  const transition = useCallback(
    (transitionConfig: TransitionConfig) =>
      new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        const gl = glRef.current;
        const toggler = [1, 0]; // Used when ping ponging between textures
        if (canvas && gl) {
          const { drawWithKernel, setFramebuffer, setVertices, setGreyscale } =
            imageRendererObj.current!;

          setGreyscale(transitionConfig.greyscale || 0);
          const [textures, frameBuffers, configs] = texturesAndBuffers.current;

          for (let i = 0; i < canvasPolygons.current.length; i++) {
            setVertices(
              canvasPolygons.current[i].vsVertices,
              imagePolygons.current[i].vsVertices
            );
            createAndSetupTexture(gl);

            gl.texImage2D(
              gl.TEXTURE_2D,
              0,
              gl.RGBA,
              gl.RGBA,
              gl.UNSIGNED_BYTE,
              imageRef.current!
            );

            for (let j = 0; j < transitionConfig.filters.length; j++) {
              setFramebuffer(
                frameBuffers[renderedIndex.current],
                configs[renderedIndex.current]
              );
              drawWithKernel(
                getConvolutionKernel(transitionConfig.filters[j]),
                canvasPolygons.current[i].vsVertices.length / 2
              );
              gl.bindTexture(gl.TEXTURE_2D, textures[renderedIndex.current]);
              renderedIndex.current = toggler[renderedIndex.current];
            }

            setFramebuffer(null, {
              width: canvas.width,
              height: canvas.height,
            });

            drawWithKernel(
              getConvolutionKernel({ type: "NORMAL" }),
              canvasPolygons.current[i].vsVertices.length / 2
            );
          }
        }
        resolve("TRANSITIONED");
      }),
    []
  );

  return {
    renderFrame,
    canvasRef,
    transition,
  };
};

export type FilterFrameType = ReturnType<typeof useFilterFrame>;
