import { useRef, useEffect, useCallback } from "react";
import {
  loadImage,
  getValueClosestTo,
  splitRectangeIntoHexagons,
  round,
  shuffleArray,
  getValInRangeToOne,
} from "@hzn/utils/functions";
import { createAndSetupTexture, getRectangleVertices } from "@hzn/utils/webgl";
import { Polygon } from "@hzn/utils/types";
import { setupImageRenderer } from "./functions";
import {
  HEXAGON_DIAMETER_COUNT_X,
  HEXAGON_DIAMETER_COUNT_Y,
  HEXAGON_TRANSITION_RATE,
} from "./constatns";
import { TransitionConfig } from "./types";

export interface InitalConfig {
  greyScale: number;
}

/**
 * This hook is responsible for everything regarding the filter frame.
 * This hook returns the curret state of the filter frame and information regarding it.
 * @param selectedFilter This is the filter you want frame to have
 * @returns
 */
export const useTransitionFrame = (initialConfig: InitalConfig) => {
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
  const glRef = useRef<WebGLRenderingContext | null | undefined>(null);
  const randomizedIndices = useRef<number[]>([]);
  const animationframe = useRef<number>(0);
  const animationTimeTravelled = useRef<number>(0);

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
          const idealHypX =
            (canvasW.current / HEXAGON_DIAMETER_COUNT_X) *
            dpr *
            rectWRatio.current;
          const idealHypY =
            (canvasH.current / HEXAGON_DIAMETER_COUNT_Y) *
            dpr *
            rectHRatio.current;

          const hypX = round(getValueClosestTo(idealHypX, canvas.width), 100);
          const hypY = round(getValueClosestTo(idealHypY, canvas.height), 100);

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

          randomizedIndices.current = shuffleArray(
            new Array(imagePolygons.current.length).fill(0).map((_, i) => i)
          );

          const { setVertices, setGreyscale, setupRenderer, setNoise } =
            imageRendererObj.current;

          setGreyscale(initialConfig.greyScale || 0);

          setNoise(0);

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

          createAndSetupTexture(gl);

          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            image
          );

          setupRenderer({ width: canvas.width, height: canvas.height });

          gl.drawArrays(gl.TRIANGLES, 0, canvasVertices.length / 2);

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
        if (canvas && gl) {
          const { setVertices, setGreyscale, setupRenderer, setNoise } =
            imageRendererObj.current!;

          setGreyscale(transitionConfig.greyscale || 0);

          const renderPolyFrame = (
            i: number,
            greyscale: number,
            noise: number
          ) => {
            if (i >= canvasPolygons.current.length) {
              return;
            }
            setNoise(noise);
            setGreyscale(greyscale);
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

            setupRenderer({ width: canvas.width, height: canvas.height });

            gl.drawArrays(
              gl.TRIANGLES,
              0,
              canvasPolygons.current[i].vsVertices.length / 2
            );
          };

          const animate = () => {
            const velocity =
              canvasPolygons.current.length /
              HEXAGON_TRANSITION_RATE /
              transitionConfig.duration;
            let distTravelled = 0;
            let timeTravelled = 0;
            let prevTime: number;

            const render = (time: number) => {
              if (!prevTime) prevTime = time;
              const dt = time - prevTime;
              prevTime = time;
              timeTravelled += dt;
              const distNow =
                (velocity * dt + distTravelled) * HEXAGON_TRANSITION_RATE;

              const real = Math.floor(distNow);
              const fract = distNow - Math.floor(distNow);
              const travelledReal = Math.floor(distTravelled);

              if (travelledReal < real) {
                for (
                  let i = travelledReal;
                  i < real;
                  i += HEXAGON_TRANSITION_RATE
                ) {
                  for (let j = 0; j < HEXAGON_TRANSITION_RATE; j++) {
                    // transitionHexagon(i, config.greyscale);
                    renderPolyFrame(
                      randomizedIndices.current[i + j],
                      transitionConfig.greyscale,
                      0
                    );
                  }
                }
              } else {
                for (let j = 0; j < HEXAGON_TRANSITION_RATE; j++) {
                  renderPolyFrame(
                    randomizedIndices.current[real + j],
                    getValInRangeToOne(
                      transitionConfig.greyscale === 1 ? 0 : 1,
                      transitionConfig.greyscale,
                      fract
                    ),
                    0.5 + fract
                  );
                }
              }

              distTravelled = distNow;
              if (!(Math.round(timeTravelled) >= transitionConfig.duration)) {
                animationframe.current = window.requestAnimationFrame(render);
              } else {
                window.cancelAnimationFrame(animationframe.current);
              }
            };
            animationframe.current = window.requestAnimationFrame(render);
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
