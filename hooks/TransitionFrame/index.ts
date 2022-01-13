import { useState, useRef, useEffect, useCallback } from "react";
import { loadImage, getValInRangeToOne } from "@hzn/utils/functions";
import { createAndSetupTexture, getRectangleVertices } from "@hzn/utils/webgl";
import { setupImageRenderer } from "./functions";
import { TransitionConfig, FrameState } from "./types";

/**
 * This hook is responsible for everything regarding the filter frame.
 * This hook returns the curret state of the filter frame and information regarding it.
 * @param selectedFilter This is the filter you want frame to have
 * @returns
 */
export const useTransitionFrame = (initialConfig: FrameState) => {
  // const [frameState, setFrameState] = useState<FrameState>(initialConfig);
  const currentFrameState = useRef<FrameState>(initialConfig);
  const nextFrameState = useRef<FrameState>(initialConfig);
  const animationFrameState = useRef<FrameState>(initialConfig);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRendered = useRef(false);
  type ImageRendererType = ReturnType<typeof setupImageRenderer>;
  const imageRendererObj = useRef<ImageRendererType | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const rectWRatio = useRef(0);
  const rectHRatio = useRef(0);
  const canvasW = useRef(0);
  const canvasH = useRef(0);
  const glRef = useRef<WebGLRenderingContext | null | undefined>(null);
  const animationframe = useRef<number>(0);
  const pointsCount = useRef<number>(0);

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
        if (error) {
          reject(error);
        }
        const gl = glRef.current;
        if (image && gl && canvasRef.current) {
          imageRef.current = image;
          const canvas = canvasRef.current;
          imageRendererObj.current = setupImageRenderer(gl, image, canvas);

          const { setVertices, render, setDimensions, setNoise } =
            imageRendererObj.current;

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

          pointsCount.current = canvasVertices.length / 2;

          setVertices(canvasVertices, imageVertices);

          createAndSetupTexture(gl);

          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
          );

          setDimensions({ width: canvas.width, height: canvas.height });

          render(
            currentFrameState.current.greyscale,
            currentFrameState.current.noise,
            pointsCount.current
          );

          frameRendered.current = true;

          resolve("SUCCESS");
        } else {
          reject("ERROR OCCURED SOMEWHERE");
        }
      }),
    []
  );

  const transition = useCallback(
    (transitionConfig: TransitionConfig) =>
      new Promise((resolve, reject) => {
        const canvas = canvasRef.current;
        const gl = glRef.current;
        if (canvas && gl) {
          nextFrameState.current = { ...transitionConfig.nextState };
          const { render } = imageRendererObj.current!;
          const animate = () => {
            let lastTime: number;
            let timeSpent = 0;
            if (animationframe.current) {
              cancelAnimationFrame(animationframe.current);
              currentFrameState.current = { ...animationFrameState.current };
            }
            const draw = (time: number) => {
              if (!lastTime) {
                lastTime = time;
              }
              let dt = time - lastTime;
              timeSpent += dt;
              lastTime = time;
              const rangeVal = getValInRangeToOne(
                0,
                transitionConfig.duration,
                timeSpent
              );
              if (Math.round(timeSpent) >= transitionConfig.duration) {
                cancelAnimationFrame(animationframe.current);
                animationframe.current = 0;
                render(
                  nextFrameState.current.greyscale,
                  nextFrameState.current.noise,
                  pointsCount.current
                );
                currentFrameState.current = { ...nextFrameState.current };
              } else {
                animationframe.current = window.requestAnimationFrame(draw);
                const greyscale = rangeVal * nextFrameState.current.greyscale;
                const noise = rangeVal * nextFrameState.current.noise;
                render(greyscale, noise, pointsCount.current);
                animationFrameState.current = {
                  greyscale,
                  noise,
                };
              }
            };
            animationframe.current = window.requestAnimationFrame(draw);
          };
          animate();
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

export type FilterFrameType = ReturnType<typeof useTransitionFrame>;
