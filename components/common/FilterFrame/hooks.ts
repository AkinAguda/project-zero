import { useState, useRef } from "react";
import { loadImage, m3, getTriangularVertices } from "@hzn/utils/functions";
import {
  createShader,
  createProgram,
  resizeCanvasToDisplaySize,
  createAndSetupTexture,
  setRectangle,
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
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        resizeCanvasToDisplaySize(canvas);
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Doing some shady stuff (pun intended)
        const vertexShaderSource = `
        attribute vec2 a_position;
        attribute vec2 a_texCoord;

        uniform vec2 u_resolution;

        varying vec2 v_texCoord;

        vec2 convertToClipSpace(vec2 position) {
          // convert the position from pixels to 0.0 to 1.0
          vec2 zeroToOne = position / u_resolution;
       
          // convert from 0->1 to 0->2
          vec2 zeroToTwo = zeroToOne * 2.0;
       
          // convert from 0->2 to -1->+1 (clip space)
          vec2 clipSpace = zeroToTwo - 1.0;
       
          return clipSpace;
        }

        void main() {
            gl_Position = vec4(convertToClipSpace(a_position), 0, 1);
            v_texCoord = a_texCoord;
        }
        `;

        const fragmentShaderSource = `
        precision mediump float;

        uniform sampler2D u_image;
        uniform vec2 u_textureSize;
    
        varying vec2 v_texCoord;
    
        void main() {
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

        const resolutionUniformLocation = gl.getUniformLocation(
          program,
          "u_resolution"
        );

        gl.uniform2f(
          resolutionUniformLocation,
          gl.canvas.width,
          gl.canvas.height
        );

        const positionLocation = gl.getAttribLocation(program, "a_position");
        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        setRectangle(gl, 0, 0, canvas.width, canvas.height);
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        const textureLocation = gl.getAttribLocation(program, "a_texCoord");

        var texcoordBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
        gl.bufferData(
          gl.ARRAY_BUFFER,
          new Float32Array([
            0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
          ]),
          gl.STATIC_DRAW
        );

        const textureSize = gl.getUniformLocation(program, "u_textureSize");
        gl.uniform2f(textureSize, image.width, image.height);

        gl.enableVertexAttribArray(textureLocation);
        gl.vertexAttribPointer(textureLocation, 2, gl.FLOAT, false, 0, 0);

        createAndSetupTexture(gl);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          image
        );

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    });

  return {
    renderFrame,
    filter,
    setFilter,
    canvasRef,
  };
};
