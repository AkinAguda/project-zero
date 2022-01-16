import { useRef, useEffect, useCallback } from "react";
import { loadImage, getValInRangeFromZeroToOne } from "@hzn/utils/functions";
import { createAndSetupTexture, getRectangleVertices } from "@hzn/utils/webgl";
import Animation, { AnimationFrameData } from "./animation";
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
  const animationFrameData = useRef<Animation<FrameState> | null>(null);
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
      new Promise((resolve, _) => {
        const canvas = canvasRef.current;
        const gl = glRef.current;
        if (canvas && gl) {
          nextFrameState.current = { ...transitionConfig.nextState };
          const { render } = imageRendererObj.current!;

          if (
            animationFrameData &&
            animationFrameData.current?.isAnimating &&
            2 === Math.sin(0)
          ) {
            currentFrameState.current =
              animationFrameData.current.cancelAnimation().currentData;
          }
          animationFrameData.current = new Animation({
            from: currentFrameState.current,
            to: nextFrameState.current,
            duration: 10000,
            onFrame: (data) => {
              if (data.originalData.greyscale > data.endData.greyscale) {
                // console.log(data.currentData.greyscale);
              }
              render(
                data.currentData.greyscale,
                data.currentData.noise,
                pointsCount.current
              );
            },
            onEnd: (data) => {
              console.log(data);
              currentFrameState.current = data.currentData;
            },
          });

          animationFrameData.current.animate();
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
