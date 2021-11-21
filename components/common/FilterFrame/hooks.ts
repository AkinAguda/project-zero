import { useState, useRef } from "react";
import { loadImage, m3 } from "@hzn/utils/functions";
import {
  createShader,
  createProgram,
  resizeCanvasToDisplaySize,
  createAndSetupTexture,
} from "@hzn/utils/webgl";
import { filterTypes } from "./types";

/**
 * This hook is responsible for everything regarding the filter frame.
 * This hook returns the curret state of the filter frame and information regarding it.
 * @param selectedFilter This is the filter you want frame to have
 * @returns
 */
export const useFilterFrame = (selectedFilter: filterTypes) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [filter, setFilter] = useState<filterTypes>(selectedFilter);
  const renderFrame = (imageUrl: string) =>
    new Promise(async (resolve, reject) => {
      const [image, error] = await loadImage(imageUrl);
      const gl = canvasRef.current?.getContext("webgl");
      if (image && gl) {
        // Setting a local canvas variable
        const canvas = canvasRef.current!;
        // Resizing rendering context
        // resizeCanvasToDisplaySize(canvas);
        // const { width, height } = canvas.getBoundingClientRect();
        canvas.width = canvas.width;
        canvas.height = canvas.height;
        image.height = canvas.width;
        image.width = canvas.height;

        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Populating eventual vertex attrib array
        const vertices: number[] = [];
        const wCount = 30;
        const hCount = 30;

        const boxWidth = canvas.width / wCount;
        const boxHeight = canvas.height / hCount;

        const boxWidthHalf = boxWidth / 2;
        const boxHeightHalf = boxHeight / 2;

        let pointIndex = 0;

        for (let i = 0; i < hCount; i++) {
          for (let j = 0; j < wCount; j++) {
            const center = [
              boxWidthHalf * 2 * j + boxWidthHalf,
              boxHeightHalf * 2 * i + boxHeightHalf,
            ];

            // vertices[pointIndex] = center[0] - boxWidthHalf;
            // vertices[pointIndex + 1] = center[0] - boxHeightHalf;

            vertices[pointIndex] = center[0] - boxWidthHalf;
            vertices[pointIndex + 1] = center[1] - boxHeightHalf;

            // Vertex 2 coords
            vertices[pointIndex + 2] = center[0] + boxWidthHalf;
            vertices[pointIndex + 3] = center[1] - boxHeightHalf;

            // Vertex 3 coords
            vertices[pointIndex + 4] = center[0] - boxWidthHalf;
            vertices[pointIndex + 5] = center[1] + boxHeightHalf;

            // Vertex 4 coords
            vertices[pointIndex + 6] = center[0] - boxWidthHalf;
            vertices[pointIndex + 7] = center[1] + boxHeightHalf;

            // Vertex 5 coords
            vertices[pointIndex + 8] = center[0] + boxWidthHalf;
            vertices[pointIndex + 9] = center[1] - boxHeightHalf;

            // Vertex 6 coords
            vertices[pointIndex + 10] = center[0] + boxWidthHalf;
            vertices[pointIndex + 11] = center[1] + boxHeightHalf;

            pointIndex += 12;
          }
        }

        // Doing some shady stuff (pun intended)
        const vertexShaderSource = `
        attribute vec2 a_position;
        // attribute vec2 a_texCoord;
    
        uniform mat3 u_projection;

        varying vec2 v_texCoord;
    
        void main() {
            vec2 position = (u_projection * vec3(a_position, 1)).xy;
            vec2 texCoord = (u_projection * vec3(a_position, 1)).xy;
            gl_Position = vec4(position, 0, 1);
            v_texCoord = texCoord;
        }
        `;

        const fragmentShaderSource = `
        precision mediump float;

        uniform sampler2D u_image;
        // uniform vec2 u_textureSize;

        varying vec2 v_texCoord;

        void main() {
            // vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;
            gl_FragColor = texture2D(u_image, v_texCoord);
        }
        `;

        const vertexShader = createShader(
          gl,
          gl.VERTEX_SHADER,
          vertexShaderSource
        )!;
        const fragmentShader = createShader(
          gl,
          gl.FRAGMENT_SHADER,
          fragmentShaderSource
        )!;
        const program = createProgram(gl, vertexShader, fragmentShader)!;
        gl.useProgram(program);
        const transformationMatrixLocation = gl.getUniformLocation(
          program,
          "u_projection"
        );
        // const imageUniformLocation = gl.getUniformLocation(program, "u_image");

        const positionLocation = gl.getAttribLocation(program, "a_position");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array(vertices),
          gl.STATIC_DRAW
        );
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.uniformMatrix3fv(
          transformationMatrixLocation,
          false,
          m3.projection(canvas.width, canvas.height)
        );

        createAndSetupTexture(gl);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );

        const primitiveType = gl.TRIANGLES;
        const offset = 0;
        const count = 12 * (wCount * hCount);
        gl.drawArrays(primitiveType, offset, count);
      }
    });

  return {
    renderFrame,
    filter,
    setFilter,
    canvasRef,
  };
};
